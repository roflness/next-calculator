from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from ev_cost_calculator import load_charger_configurations, get_charger_config_by_id, calculate_charger_throughput_costs, calculate_charging_costs, calculate_ev_cost, calculate_ghg_reduction, calculate_ice_cost, calculate_monthly_charger_throughput_v2, calculate_monthly_costs, calculate_savings, calculate_total_charger_output, calculate_total_costs, calculate_weekly_charger_throughput, get_basic_service_fee, get_subscription_fee, is_charging_sufficient_v2
import json
import os
import calendar

app = Flask(__name__, static_folder='out', static_url_path='/')

NEXT_PUBLIC_API_BASE_URL = os.getenv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000')

if os.getenv('FLASK_ENV') == 'development':
    CORS(app)  # Allow all domains for development
else:
    CORS(app, resources={r"/api/*": {"origins": NEXT_PUBLIC_API_BASE_URL}})

load_charger_configurations()
# Load your configuration file
with open('./ev_config.json', 'r') as config_file:
    config_data = json.load(config_file)
    charger_type_config = config_data['charger_types']

time_of_use_rates = config_data['time_of_use_rates']

ghg_variables = config_data['ghg_variables']
gas_mj_per_gal = ghg_variables['gas_mj_per_gal']
gas_unadjusted_ci = ghg_variables['gas_unadjusted_ci']
elec_mj_per_gal = ghg_variables['elec_mj_per_gal']
elec_unadjusted_ci = ghg_variables['elec_unadjusted_ci']

ice_variables = config_data['ice_variables']
gas_price = ice_variables['gas_price']
ice_efficiency = ice_variables['ice_efficiency']

    
@app.route('/api/charger_types', methods=['GET'])
@cross_origin() # Enables CORS specifically for this route
def charger_types():
    try:
        return jsonify(charger_type_config)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/time_of_use_rates', methods=['GET'])
@cross_origin()
def get_time_of_use_rates():
    try:
        return jsonify(time_of_use_rates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    season = data.get('season')
    time_of_day = data.get('timeOfDay')
    day_type = data.get('dayType')  # Expecting "Weekday" or "Weekend"

    # Calculate consumption fee
    rates = time_of_use_rates.get(season, {}).get(day_type, {}).get(time_of_day, {})
    consumption_fee = rates.get('rate', None)
    
    if consumption_fee is None:
        return jsonify({'error': 'Invalid season, time of day, or day type'}), 400
    
    # Perform your calculations here using consumption_fee
    result = {'consumption_fee': consumption_fee}  # Example response
    
    return jsonify(result)

@app.route('/api/results', methods=['POST'])
@cross_origin() # Enables CORS specifically for this route
def handle_results():
    data = request.get_json()

    if not data:
            return jsonify({"error": "No data provided"}), 400

    num_vehicles = int(data.get('numVehicles', 1))
    miles_driven_per_day = float(data.get('milesDrivenPerDay', 1))
    battery_size = float(data.get('batterySize', 1))
    vehicle_efficiency = float(data.get('vehicleEfficiency', 1))
    charging_hours_per_day = int(data.get('chargingHoursPerDay', 24))
    charging_days_per_week = int(data.get('chargingDaysPerWeek', 1))
    # season = data.get('season', 'Summer')
    # time_of_day = data.get('timeOfDay', 'Off-Peak')
    selected_hours = data.get('selectedHours', [])

    # Calculate charging_hours_per_day based on selected_hours
    charging_hours_per_day = len(selected_hours)

    chargers = data.get('chargers', [])
    processed_chargers = []

    for charger in chargers:
        try:
            charger_type_id = int(charger.get('chargerType', 0))  # Use get() with default value
            charger_count = int(charger.get('chargerCount', 0))

            if charger_type_id == 0 or charger_count == 0:
                continue  # Skip this charger if the necessary data isn't provided

            charger_config = get_charger_config_by_id(charger_type_id)
            if charger_config:
                processed_chargers.append({
                    'type': charger_config['type'],
                    'count': charger_count,
                    'rating_kW': charger_config['rating_kW'],
                    'efficiency': charger_config['efficiency']
                })
        except ValueError:
            continue  # Skip this charger if there's an error converting types

    # Calculate monthly costs for the entire year
    def calculate_monthly_costs(selected_hours, month, num_days):
        # Example calculation for monthly costs
        basic_service_fee = 10.0
        usage_subscription_fee = 5.0
        consumption_fee = sum(hour * 0.1 for hour in selected_hours) * num_days  # Adjusted for number of days
        total_monthly_cost = basic_service_fee + usage_subscription_fee + consumption_fee
        return basic_service_fee, usage_subscription_fee, consumption_fee, total_monthly_cost

    monthly_results = {}
    annual_costs = {
        "total_basic_service_fee": 0,
        "total_subscription_fee": 0,
        "total_consumption_fee": 0,
        "total_monthly_ev_cost": 0,
    }

    for month in range(1, 13):
        month_name = calendar.month_name[month]
        num_days = calendar.monthrange(2024, month)[1]  # Assuming year 2024 for example
        basic_service_fee, usage_subscription_fee, consumption_fee, total_monthly_cost = calculate_monthly_costs(selected_hours, month, num_days)
        
        monthly_results[month_name] = {
            "basic_service_fee": basic_service_fee,
            "subscription_fee": usage_subscription_fee,
            "consumption_fee": consumption_fee,
            "total_monthly_cost": total_monthly_cost,
        }

        annual_costs["total_basic_service_fee"] += basic_service_fee
        annual_costs["total_subscription_fee"] += usage_subscription_fee
        annual_costs["total_consumption_fee"] += consumption_fee
        annual_costs["total_monthly_ev_cost"] += total_monthly_cost

    annual_costs["average_monthly_ev_cost"] = annual_costs["total_monthly_ev_cost"] / 12

    sufficient, total_energy_needed, total_charging_capacity, total_number_chargers, kw_average, charger_type_count, additional_chargers_needed = is_charging_sufficient_v2(num_vehicles, miles_driven_per_day, vehicle_efficiency, processed_chargers, charging_hours_per_day)

    if sufficient:
        optimal_charging_kw = total_energy_needed / charging_hours_per_day
    else:
        optimal_charging_kw = total_charging_capacity / charging_hours_per_day

    total_ev_cost, monthly_ice_cost, monthly_ice_cost_one_vehicle, usage_load_kw, subscription_threshold, subscription_level, subscription_fee, hourly_usage_load_kw, charging_hours_needed_daily, usage_subscription_threshold, usage_subscription_level, usage_subscription_fee = calculate_total_costs(
        num_vehicles, battery_size, vehicle_efficiency, processed_chargers, miles_driven_per_day, charging_days_per_week, selected_hours, charging_hours_per_day, gas_price, ice_efficiency)

    # ICE cost comparison (assuming constant ICE cost across the year for simplicity)
    total_ice_cost = monthly_ice_cost * 12
    monthly_ice_cost_one_vehicle = total_ice_cost / 12  # Assuming total_ice_cost is for all vehicles

    monthly_savings = calculate_savings(monthly_ice_cost, annual_costs["average_monthly_ev_cost"])
    ghg_reduction_result = calculate_ghg_reduction(gas_mj_per_gal, gas_unadjusted_ci, elec_mj_per_gal, elec_unadjusted_ci, num_vehicles, miles_driven_per_day, charging_days_per_week, ice_efficiency, vehicle_efficiency)

    usage_load_kw_basic_service_fee = get_basic_service_fee(usage_load_kw)

    kwh_charger_output_daily, kwh_charger_output_weekly = calculate_weekly_charger_throughput(processed_chargers, charging_hours_per_day, charging_days_per_week)
    kwh_charger_output_monthly, load_kw, max_subscription_threshold, max_subscription_level, max_subscription_fee = calculate_monthly_charger_throughput_v2(kwh_charger_output_daily, charging_days_per_week, processed_chargers, charging_hours_per_day)
    charger_output_costs_weekly, charger_output_costs_monthly = calculate_charger_throughput_costs(kwh_charger_output_weekly, kwh_charger_output_monthly, selected_hours, load_kw)

    max_load_kw_basic_service_fee = get_basic_service_fee(load_kw)

    if sufficient:
        optimal_charging_kw = total_energy_needed / charging_hours_per_day
    else:
        optimal_charging_kw = total_charging_capacity / charging_hours_per_day

    basic_service_fee = get_basic_service_fee(optimal_charging_kw)

    # Prepare the output message
    if sufficient:
        message = f"{total_number_chargers} chargers with "
        message += "an avg " if charger_type_count > 1 else "a "
        message += f"rating of {kw_average:.2f} kW is sufficient for vehicle operation and charging behavior. Total daily energy needed: {total_energy_needed:.2f} kWh, Total daily charging capacity: {total_charging_capacity:.2f} kWh"
    else:
        message = f"{total_number_chargers} chargers with "
        message += "an avg " if charger_type_count > 1 else "a "
        message += f"rating of {kw_average:.2f} kW is NOT sufficient for vehicle operation and charging behavior.. Total daily energy needed: {total_energy_needed:.2f} kWh, Total daily charging capacity: {total_charging_capacity:.2f} kWh. \n"
        message += f"Additional chargers needed with the same kW rating: {additional_chargers_needed}"

    results = {
        "annual_costs": annual_costs,
        "monthly_results": monthly_results,
        "total_ev_cost": total_ev_cost,
        "total_ice_cost": total_ice_cost,
        "monthly_savings": monthly_savings,
        "ghg_reduction_result": ghg_reduction_result,
        "message": message,
        "chargers": processed_chargers,
        "optimal_charging_kw": optimal_charging_kw,
        "basic_service_fee": basic_service_fee,
        "selected_hours": selected_hours,
        "num_vehicles": num_vehicles,
        "miles_driven_per_day": miles_driven_per_day,
        "total_energy_needed": total_energy_needed,
        "total_number_chargers": total_number_chargers,
        "charging_hours_needed_daily": charging_hours_needed_daily,
        "usage_load_kw": usage_load_kw
    }

    try:
        return jsonify(results)
    except Exception as e:
        # logging.error("Error processing chargers: %s", e)
        return jsonify({"error": "Failed to process chargers"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))  # Use port 5001 if PORT not set
    app.run(host='0.0.0.0', port=port)
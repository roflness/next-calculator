import math
import json
# test
def load_config(filename):
    with open(filename, 'r') as file:
        return json.load(file)

config = load_config('./ev_config.json')
subscription_fees = config['subscription_fees']
time_of_use_rates = config['time_of_use_rates']

ghg_variables = config['ghg_variables']
gas_mj_per_gal = ghg_variables['gas_mj_per_gal']
gas_unadjusted_ci = ghg_variables['gas_unadjusted_ci']
elec_mj_per_gal = ghg_variables['elec_mj_per_gal']
elec_unadjusted_ci = ghg_variables['elec_unadjusted_ci']

# Assuming you have a global variable for storing charger configurations
charger_configurations = {}

# Function to load charger configurations from a JSON file
def load_charger_configurations():
    global charger_configurations
    with open('./ev_config.json', 'r') as file:
        data = json.load(file)
        charger_configurations = {str(charger['charger_type_id']): charger for charger in data['charger_types']}

# Function to get charger configuration by ID
def get_charger_config_by_id(charger_type_id):
    # Convert charger_id to string if necessary, assuming IDs are stored as strings in the dictionary
    return charger_configurations.get(str(charger_type_id), None)

# Get vehicle driving information
# def get_vehicle_driving(num_vehicles, miles_per_day)

# Basic service fee based on load in a given hour. use for both vehicle usage and max charger throughput
def get_basic_service_fee(load_kw):
    if load_kw <= 500:
        return 213.30
    else:
        return 766.91

# Function to get subscription fee based on max load
def get_subscription_fee(load_kw):
    # Ensure subscription_fees is defined and accessible, otherwise raise an error
    if not subscription_fees:
        raise ValueError("Subscription fees are not defined.")

    # Convert the keys to integers for proper comparison
    sorted_thresholds = sorted(subscription_fees.keys(), key=int)
    for threshold in sorted_thresholds:
        if load_kw <= int(threshold):
            return int(threshold), subscription_fees[threshold]['level'], subscription_fees[threshold]['fee']

    # Handle cases where usage_load_kw is greater than all thresholds
    highest_threshold = sorted_thresholds[-1]
    return int(highest_threshold), subscription_fees[highest_threshold]['level'], subscription_fees[highest_threshold]['fee']

# Function to map month to season
def get_season_for_month(month):
    if month in [6, 7, 8, 9]:
        return "Summer"
    elif month in [3, 4]:
        return "Winter (March and April)"
    else:
        return "Winter (excluding March and April)"


def calculate_ev_cost(total_distance_per_week, selected_hours, vehicle_efficiency, usage_load_kw, subscription_fee):
    # Step 1: Calculate the total kWh needed
    total_kwh_needed = total_distance_per_week / vehicle_efficiency
    
    # Step 2: Calculate the total charging capacity during selected hours
    total_kwh_available = sum(hour * 0.1 for hour in selected_hours)  # Replace with actual rate calculation
    
    # Step 3: Calculate the consumption fee based on the kWh needed and available rates
    consumption_fee = (total_kwh_needed / total_kwh_available) * sum(hour * 0.1 for hour in selected_hours)  # Example calculation

    # Step 4: Add basic service fee and subscription fee
    basic_service_fee = get_basic_service_fee(usage_load_kw)
    total_ev_cost = consumption_fee + basic_service_fee + subscription_fee

    return total_ev_cost

# Function to calculate ICE cost
def calculate_ice_cost(total_distance_per_week, gas_price, ice_efficiency):
    ice_cost_per_mile = gas_price / ice_efficiency
    monthly_ice_cost = ice_cost_per_mile * total_distance_per_week * 4.345
    return monthly_ice_cost

# Function to calculate total load and costs for multiple vehicles
def calculate_total_costs(num_vehicles, battery_size, vehicle_efficiency, chargers, miles_driven_per_day, charging_days_per_week, selected_hours, charging_hours_per_day,gas_price,ice_efficiency):
    # Calculate total distance per week based on daily mileage and operational days
    total_distance_per_week = miles_driven_per_day * charging_days_per_week * num_vehicles
    usage_load_kw = 0

    kw_consumed_daily = (miles_driven_per_day / vehicle_efficiency)
    remaining_battery_daily = battery_size - kw_consumed_daily

    # Retrieve information on charging sufficiency and average charging capability
    sufficient, total_energy_needed, total_daily_charging_capacity, total_number_chargers, kw_average, charger_type_count, additional_chargers_needed = is_charging_sufficient_v2(num_vehicles, miles_driven_per_day, vehicle_efficiency, chargers, charging_hours_per_day)

    # Calculate how many charging hours are needed based on available average power
    if kw_average > 0:
        charging_hours_needed_daily = remaining_battery_daily / kw_average
    else:
        charging_hours_needed_daily = 0

    # charging_hours_needed_daily = remaining_battery_daily / is_charging_sufficient_v2(kw_average)
    
    hourly_usage_load_kw = (charging_hours_needed_daily) * (num_vehicles) # return back to this, needs to be rejiggered
    usage_subscription_threshold, usage_subscription_level, usage_subscription_fee = get_subscription_fee(hourly_usage_load_kw)
    
    for charger in chargers:
        if 'rating_kW' not in charger or 'count' not in charger:
            print("Error: Charger data is incomplete.")
            continue  # Skip this charger or handle the error appropriately
        usage_load_kw += charger["rating_kW"] * charger["count"]

    usage_load_kw = usage_load_kw * charging_hours_per_day # max charger output per day based on charging behavior

    subscription_threshold, subscription_level, subscription_fee = get_subscription_fee(usage_load_kw)
    total_ev_cost = calculate_ev_cost(total_distance_per_week, selected_hours, vehicle_efficiency, usage_load_kw, subscription_fee)

    # Calculate ICE vehicle costs
    monthly_ice_cost = calculate_ice_cost(total_distance_per_week, gas_price, ice_efficiency)
    monthly_ice_cost_one_vehicle = monthly_ice_cost / num_vehicles
    return total_ev_cost, monthly_ice_cost, monthly_ice_cost_one_vehicle, usage_load_kw, subscription_threshold, subscription_level, subscription_fee, hourly_usage_load_kw, charging_hours_needed_daily, usage_subscription_threshold, usage_subscription_level, usage_subscription_fee

# Adjusted Function for Total Costs to Reflect Changes
# def calculate_total_costs_weekly(num_vehicles, miles_driven_per_day, charging_days_per_week, vehicle_efficiency, season, time_of_day):
#     consumption_fee = rates[season][time_of_day]
#     ev_cost_per_mile = consumption_fee / vehicle_efficiency
    
#     total_distance_per_week = miles_driven_per_day * charging_days_per_week * num_vehicles
#     total_weekly_ev_cost = ev_cost_per_mile * total_distance_per_week
#     # weekly_ev_cost = calculate_weekly_ev_cost(total_distance_per_week, season, time_of_day)
#     return total_weekly_ev_cost


# Adjusted Function to Calculate Monthly Costs Including All Fees
def calculate_monthly_costs(weekly_ev_cost, usage_load_kw):
    basic_service_fee = get_basic_service_fee(usage_load_kw)
    subscription_threshold, subscription_level, subscription_fee = get_subscription_fee(usage_load_kw)
    monthly_ev_cost = (weekly_ev_cost * 4.345) + (basic_service_fee + subscription_fee)
    return monthly_ev_cost

def calculate_savings(monthly_ice_cost, monthly_ev_cost):
    monthly_savings = monthly_ice_cost - monthly_ev_cost
    return monthly_savings

# Function to calculate full throughput of chargers on weekly basis
def calculate_weekly_charger_throughput(chargers, charging_hours_per_day, charging_days_per_week):
    kwh_charger_output = 0
    for chargers in chargers:
        kwh_charger_output += chargers["rating_kW"] * chargers["count"]

    kwh_charger_output_daily = kwh_charger_output * charging_hours_per_day
    kwh_charger_output_weekly = kwh_charger_output_daily * charging_days_per_week
    return kwh_charger_output_daily, kwh_charger_output_weekly

# Function to calculate throughput of chargers on monthly basis
def calculate_monthly_charger_throughput_v2(kwh_charger_output_daily,charging_days_per_week, chargers, charging_hours_per_day):
    kwh_charger_output_monthly = (kwh_charger_output_daily * charging_days_per_week) * 4.345
    load_kw = 0
    # Raw load_kw calculation
    for chargers in chargers:
        load_kw += chargers["rating_kW"] * chargers["count"]

    # load_kw = load_kw * charging_hours_per_day * charging_days_per_week
    max_subscription_threshold, max_subscription_level, max_subscription_fee = get_subscription_fee(load_kw)

    return kwh_charger_output_monthly, load_kw, max_subscription_threshold, max_subscription_level, max_subscription_fee

# Function to calculate costs of total throughput of chargers
def calculate_charger_throughput_costs(kwh_charger_output_weekly, kwh_charger_output_monthly, selected_hours, load_kw):
    # Calculate the basic service fee based on load kW
    basic_service_fee = get_basic_service_fee(load_kw)
    
    # Get the subscription fee based on load kW
    subscription_threshold, subscription_level, subscription_fee = get_subscription_fee(load_kw)
    
    # Calculate the consumption fee based on selected hours
    total_hours = len(selected_hours)
    if total_hours > 0:
        average_consumption_rate = sum(hour * 0.1 for hour in selected_hours) / total_hours  # Replace 0.1 with actual rate calculation
    else:
        average_consumption_rate = 0

    # Calculate weekly and monthly costs
    charger_output_costs_weekly = kwh_charger_output_weekly * average_consumption_rate
    charger_output_costs_monthly = (kwh_charger_output_monthly * average_consumption_rate) + basic_service_fee + subscription_fee
    
    return charger_output_costs_weekly, charger_output_costs_monthly

# Function using the charger list to calculate if the specified chargers is enough to accommodate the vehicle's operational needs

def is_charging_sufficient_v2(num_vehicles, miles_driven_per_day, vehicle_efficiency, chargers, charging_hours_per_day):
    total_daily_distance = num_vehicles * miles_driven_per_day
    total_daily_energy_needed = total_daily_distance / vehicle_efficiency

    total_daily_charging = 0
    total_number_chargers = 0
    charger_type_count = 0

    for charger in chargers:  # Iterate over each charger in the list
        if 'count' in charger and 'rating_kW' in charger:
            total_daily_charging += charger['count'] * charger['rating_kW']
            total_number_chargers += charger['count']  # Increment the total number of chargers
            charger_type_count += 1

    if total_number_chargers == 0:
        return False, total_daily_energy_needed, 0, 0, 0, len(chargers), 0  # Avoid division by zero

    total_daily_charging_capacity = total_daily_charging * charging_hours_per_day
    kw_average = total_daily_charging / total_number_chargers

    additional_chargers_needed = math.ceil(((total_daily_energy_needed - total_daily_charging_capacity) / charging_hours_per_day) / kw_average)

    if total_daily_charging_capacity >= total_daily_energy_needed:
        return True, total_daily_energy_needed, total_daily_charging_capacity, total_number_chargers, kw_average, charger_type_count, additional_chargers_needed
    else:
        return False, total_daily_energy_needed, total_daily_charging_capacity, total_number_chargers, kw_average, charger_type_count, additional_chargers_needed

def calculate_total_charger_output(chargers, charging_hours_per_day, charging_days_per_week):
    total_output_weekly = 0
    for charger in chargers:
        daily_output = charger["count"] * charger["rating_kW"] * charging_hours_per_day * charger["efficiency"]
        weekly_output = daily_output * charging_days_per_week
        total_output_weekly += weekly_output
    return total_output_weekly

def calculate_charging_costs(chargers, miles_driven_per_day, vehicle_efficiency, num_vehicles, rates, season, time_of_day):
    total_costs = {}
    for charger in chargers:
        kw_needed_per_vehicle = (miles_driven_per_day / vehicle_efficiency) / charger["rating_kW"]
        total_kw = kw_needed_per_vehicle * num_vehicles
        rate = rates[season][time_of_day]  # Assuming rate is directly accessible
        cost_per_charger = total_kw * rate * charger["efficiency"]
        total_costs[charger["type"]] = cost_per_charger * charger["count"]
    return total_costs

def calculate_ghg_reduction(gas_mj_per_gal, gas_unadjusted_ci, elec_mj_per_gal, elec_unadjusted_ci, num_vehicles, miles_driven_per_day, charging_days_per_week, ice_efficiency, vehicle_efficiency):
    miles_driven = (miles_driven_per_day * charging_days_per_week * num_vehicles) * 4.345 #monthly miles driven

    # Calculate fuel used in gallons for ICE and kWh for electric vehicles
    gasoline_used = miles_driven / ice_efficiency  # gallons
    kwh_used = miles_driven / vehicle_efficiency  # kWh

    # Calculate GHG emissions in metric tons CO2
    gasoline_ghg = gasoline_used * gas_mj_per_gal * gas_unadjusted_ci * (1 / 1000000)  # Convert grams to metric tons
    electric_ghg = kwh_used * elec_mj_per_gal * elec_unadjusted_ci * (1 / 1000000)  # Convert grams to metric tons

    # Calculate net GHG reduction
    net_ghg_reduction = gasoline_ghg - electric_ghg

    return {
        "Miles Driven": miles_driven,
        "Gasoline Used (gallons)": gasoline_used,
        "Electricity Used (kWh)": kwh_used,
        "Gasoline Fuel Usage GHGs (MT CO2)": gasoline_ghg,
        "Electric Fuel Usage GHGs (MT CO2)": electric_ghg,
        "Net GHG Reductions (MT CO2)": net_ghg_reduction
    }

# Use this block to run tests or execute the module directly
if __name__ == '__main__':
    # Sample data for testing
    num_vehicles = 5
    battery_size = 100
    vehicle_efficiency = 1.2
    chargers = [{'type': 'Level 2', 'count': 3, 'rating_kW': 7, 'efficiency': 0.95}]
    selectedHours = [21,22,23,0,1,2,3,4,5,6,7,17]
    miles_driven_per_day = 120
    charging_days_per_week = 5
    season = 'Summer'
    time_of_day = 'Off-Peak'
    gas_price = 4.65  # per gallon
    ice_efficiency = 20  # miles per gallon 
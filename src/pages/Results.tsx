import React from 'react';
import { useRouter } from 'next/router';


interface ChargerType {
  charger_type_id: number;
  type: string;
  rating_kW: number;
}

interface GHGReductionResult {
  'Miles Driven': number;
  'Gasoline Used (gallons)': number;
  'Electricity Used (kWh)': number;
  'Gasoline Fuel Usage GHGs (MT CO2)': number;
  'Electric Fuel Usage GHGs (MT CO2)': number;
  'Net GHG Reductions (MT CO2)': number;
}

interface Data {
  message: string;
  charging_hours_needed_daily: number;
  hourly_usage_load_kw: number;
  usage_load_kw: number;
  subscription_level: string;
  subscription_threshold: number;
  subscription_fee: number;
  usage_subscription_level: string;
  usage_subscription_threshold: number;
  usage_subscription_fee: number;
  max_subscription_level: string;
  max_subscription_threshold: number;
  max_subscription_fee: number;
  max_load_kw_basic_service_fee: number;
  load_kw: number;
  monthly_ev_cost: number;
  monthly_savings: number;
  total_number_chargers: number;
  num_vehicles: number;
  miles_driven_per_day: number;
  charging_days_per_week: number;
  monthly_ice_cost: number;
  monthly_ice_cost_one_vehicle: number;
  ice_efficiency: number;
  weekly_ev_cost: number;
  ghg_reduction_result: GHGReductionResult;
}   

const Results = () => {
    const router = useRouter();
    const { data } = router.query;

    const results = data ? JSON.parse(data) : {};

    return (
        <div id="msresult">
            <h1 className="fs-header">Results</h1>
            <h2 className="fs-second-title">{results.message}</h2>
            <br/><br/>
            <p><span className="fs-title">Charging hours needed daily per vehicle: </span>{results.charging_hours_needed_daily.toFixed(2)}</p>
            <p><span className="fs-title">kW needed to accommodate vehicle operation per hour: </span>{results.hourly_usage_load_kw.toFixed(2)}</p>
            <p><span className="fs-title">kW allowed to charge per hour (limited to {results.total_number_chargers} chargers): </span>{results.usage_load_kw.toFixed(2)}</p>
            <p><span className="fs-title">Preferred Subscription Level: {results.subscription_level} - {results.subscription_threshold} kW with a fee of </span>${results.subscription_fee.toFixed(2)}</p>
            <p><span className="fs-title">Recommended Subscription Level based on vehicle operation: </span>{results.usage_subscription_level} - {results.usage_subscription_threshold} kW with a fee of ${results.usage_subscription_fee.toFixed(2)}</p>
            <p><span className="fs-title">Basic Service Fee based with operational load of {results.usage_load_kw.toFixed(2)} kW: </span>${results.usage_load_kw_basic_service_fee.toFixed(2)}</p>
            <br/><br/>
            <p><span className="fs-title">Weekly Operational EV costs for {results.num_vehicles} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week (consumption rates only, no fees): </span>${results.weekly_ev_cost.toFixed(2)}</p>
            <p><span className="fs-title">Monthly Operational EV costs (consumption rates with fees included): </span>${results.monthly_ev_cost.toFixed(2)}</p>
            <br/><br/>
            <p><span className="fs-title">Monthly Operational ICE cost for {results.num_vehicles} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week with {results.ice_efficiency} MPG: </span>${results.monthly_ice_cost.toFixed(2)}</p>
            <p><span className="fs-title">Monthly Operational gas cost for one ICE vehicle: </span>${results.monthly_ice_cost_one_vehicle.toFixed(2)}</p>
            <br/><br/>
            <p><span className="fs-title">Monthly Savings: </span>${results.monthly_savings.toFixed(2)}</p>
            <br/>
            <p><span className="fs-title">Max Load kW per hour: </span>{results.load_kw.toFixed(2)}</p>
            <p><span className="fs-title">Max Subscription Level: {results.max_subscription_level} - {results.max_subscription_threshold} kW with a subscription charge of ${results.max_subscription_fee.toFixed(2)}</span></p>
            <p><span className="fs-title">Basic Service Fee based with max load of {results.load_kw.toFixed(2)} kW: </span>${results.max_load_kw_basic_service_fee.toFixed(2)}</p>
            <br/>
            <h2 className="fs-second-title">GHG reductions as difference between gasoline and electric GHGs</h2>
            <p><span className="fs-title">Miles Driven: </span>{results.ghg_reduction_result['Miles Driven']}</p>
            <p><span className="fs-title">Gasoline Used (gallons): </span>{results.ghg_reduction_result['Gasoline Used (gallons)'].toFixed(2)}</p>
            <p><span className="fs-title">Electricity Used (kW): </span>{results.ghg_reduction_result['Electricity Used (kWh)'].toFixed(2)}</p>
            <br/>
            <p><span className="fs-title">Gasoline Fuel Usage GHGs (MT CO2): </span>{results.ghg_reduction_result['Gasoline Fuel Usage GHGs (MT CO2)'].toFixed(2)}</p>
            <p><span className="fs-title">Elec Fuel Usage GHGs (MT CO2): </span>{results.ghg_reduction_result['Electric Fuel Usage GHGs (MT CO2)'].toFixed(2)}</p>
            <p><span className="fs-title">Net GHG Reductions (MT CO2): </span>{results.ghg_reduction_result['Net GHG Reductions (MT CO2)'].toFixed(2)}</p>
            <br/>
            <p>
                <a href="/" className="secondary-button" target="_top">Calculate Again</a>
            </p>
        </div>
    );
}

export default Results;
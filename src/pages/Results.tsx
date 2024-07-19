import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Typography, Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import DashboardCard from '../components/shared/DashboardCard';

interface ChargerType {
  charger_type_id: number;
  type: string;
  rating_kW: number;
  count: number;
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
  usage_load_kw_basic_service_fee: number;
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
  chargers: ChargerType[]; // Add this field to the interface
}

const Results = () => {
  const router = useRouter();
  const { data } = router.query;

  // Ensure data is a string before parsing
  const results: Data = typeof data === 'string' ? JSON.parse(data) : {};

  const safeToFixed = (value: any, decimals: number = 2) => {
    return value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A';
  };

  return (
    <div id="msresult">
      <h1 className="fs-header">Results</h1>
      <h2 className="fs-second-title">{results.message}</h2>
      <br /><br />
      <p><span className="fs-title">Charging hours needed daily per vehicle: </span>{safeToFixed(results.charging_hours_needed_daily)}</p>
      <p><span className="fs-title">kW needed to accommodate vehicle operation per hour: </span>{safeToFixed(results.hourly_usage_load_kw)}</p>
      <p><span className="fs-title">kW allowed to charge per hour (limited to {results.total_number_chargers} chargers): </span>{safeToFixed(results.usage_load_kw)}</p>
      <p><span className="fs-title">Preferred Subscription Level: {results.subscription_level} - {results.subscription_threshold} kW with a fee of </span>${safeToFixed(results.subscription_fee)}</p>
      <p><span className="fs-title">Recommended Subscription Level based on vehicle operation: </span>{results.usage_subscription_level} - {results.usage_subscription_threshold} kW with a fee of ${safeToFixed(results.usage_subscription_fee)}</p>
      <p><span className="fs-title">Basic Service Fee based with operational load of {safeToFixed(results.usage_load_kw)} kW: </span>${safeToFixed(results.usage_load_kw_basic_service_fee)}</p>
      <br /><br />
      <p><span className="fs-title">Weekly Operational EV costs for {results.num_vehicles} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week (consumption rates only, no fees): </span>${safeToFixed(results.weekly_ev_cost)}</p>
      <p><span className="fs-title">Monthly Operational EV costs (consumption rates with fees included): </span>${safeToFixed(results.monthly_ev_cost)}</p>
      <br /><br />
      <p><span className="fs-title">Monthly Operational ICE cost for {results.num_vehicles} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week with {results.ice_efficiency} MPG: </span>${safeToFixed(results.monthly_ice_cost)}</p>
      <p><span className="fs-title">Monthly Operational gas cost for one ICE vehicle: </span>${safeToFixed(results.monthly_ice_cost_one_vehicle)}</p>
      <br /><br />
      <p><span className="fs-title">Monthly Savings: </span>${safeToFixed(results.monthly_savings)}</p>
      <br />
      <p><span className="fs-title">Max Load kW per hour: </span>{safeToFixed(results.load_kw)}</p>
      <p><span className="fs-title">Max Subscription Level: {results.max_subscription_level} - {results.max_subscription_threshold} kW with a subscription charge of ${safeToFixed(results.max_subscription_fee)}</span></p>
      <p><span className="fs-title">Basic Service Fee based with max load of {safeToFixed(results.load_kw)} kW: </span>${safeToFixed(results.max_load_kw_basic_service_fee)}</p>
      <br />
      <h2 className="fs-second-title">GHG reductions as difference between gasoline and electric GHGs</h2>
      <p><span className="fs-title">Miles Driven: </span>{results?.ghg_reduction_result?.['Miles Driven'] ?? 'N/A'}</p>
      <p><span className="fs-title">Gasoline Used (gallons): </span>{results?.ghg_reduction_result?.['Gasoline Used (gallons)'] ?? 'N/A'}</p>
      <p><span className="fs-title">Electricity Used (kW): </span>{results?.ghg_reduction_result?.['Electricity Used (kWh)'] ?? 'N/A'}</p>
      <br />
      <p><span className="fs-title">Gasoline Fuel Usage GHGs (MT CO2): </span>{results?.ghg_reduction_result?.['Gasoline Fuel Usage GHGs (MT CO2)'] ?? 'N/A'}</p>
      <p><span className="fs-title">Elec Fuel Usage GHGs (MT CO2): </span>{results?.ghg_reduction_result?.['Electric Fuel Usage GHGs (MT CO2)'] ?? 'N/A'}</p>
      <p><span className="fs-title">Net GHG Reductions (MT CO2): </span>{results?.ghg_reduction_result?.['Net GHG Reductions (MT CO2)'] ?? 'N/A'}</p>
      <br />
      <p>
        <Link href="/" className="secondary-button">Calculate Again</Link>
      </p>
      <DashboardCard title="Chargers Selected">
        <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
          <Table
            aria-label="simple table"
            sx={{
              whiteSpace: "nowrap",
              mt: 2
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Rating (kW)</TableCell>
                <TableCell>Count</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.chargers.map((charger: ChargerType, index: number) => (
                <TableRow key={index}>
                  <TableCell>{charger.type}</TableCell>
                  <TableCell>{charger.rating_kW}</TableCell>
                  <TableCell>{charger.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </DashboardCard>
    </div>
  );
}

export default Results;
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DashboardCard from '../components/shared/DashboardCard';
import ChargersSelected from '../components/Results/ChargersSelected';
import { ActionButton } from '../styles/myComponentStyles';
import CostComparisonChart from '../components/Results/CostComparisonChart';
import CostComparisonTable from '../components/Results/CostComparisonTable';
// import SecondaryForm from '../components/Results/SecondaryForm';
import Sidebar from './Sidebar';
import { Grid, Typography, Box, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import MonthlyFeeBreakdownTable from '@/components/Results/MonthlyFeeBreakdownTable';


interface ChargerType {
  charger_type_id: number;
  type: string;
  rating_kW: number;
  count: number;
}

interface ChargersSelectedProps {
  chargers: ChargerType[];
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
  optimal_charging_kw: number;
  basic_service_fee: number;
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
  total_energy_needed: number;
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
  charger_output_costs_monthly: number;
  charger_output_costs_weekly: number;
  chargers: ChargerType[];
  formData: FormData;
}

interface FormData {
  numVehicles: string;
  milesDrivenPerDay: string;
  batterySize: string;
  vehicleEfficiency: string;
  chargingHoursPerDay: string;
  chargingDaysPerWeek: string;
  season: string;
  timeOfDay: string;
  chargers: ChargerType[];
}

const Results = () => {
  const router = useRouter();
  // const { data } = router.query;
  const { data, formData } = router.query;

  const results: Data = typeof data === 'string' ? JSON.parse(data) : {};
  const initialFormData: FormData = typeof formData === 'string' ? JSON.parse(formData) : {};

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const safeToFixed = (value: any, decimals: number = 2) => {
    return value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A';
  };

  const safeToWhole = (value: any, decimals: number = 0) => {
    return value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A';
  };

  // Calculate the breakdown for optimal charging
  const optimalCharging = {
    basicServiceFee: results.basic_service_fee,
    subscriptionFee: results.usage_subscription_fee,
    consumptionFee: results.monthly_ev_cost - results.basic_service_fee - results.usage_subscription_fee,
    totalMonthlyCost: results.monthly_ev_cost,
  };

  // Calculate the breakdown for max throughput charging
  const maxThroughputCharging = {
    basicServiceFee: results.max_load_kw_basic_service_fee,
    subscriptionFee: results.max_subscription_fee,
    consumptionFee: results.charger_output_costs_monthly - results.max_load_kw_basic_service_fee - results.max_subscription_fee,
    totalMonthlyCost: results.charger_output_costs_monthly,
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar isSidebarOpen={isSidebarOpen} onSidebarClose={() => setSidebarOpen(false)} isMobileSidebarOpen={false} formData={initialFormData} />
      <Box sx={{ width: isSidebarOpen ? '80%' : '100%', p: 3 }}>
        <Typography variant="h4" gutterBottom>Results</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Daily Charging Requirements">
              <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                  aria-label="simple table"
                  sx={{
                    whiteSpace: 'nowrap',
                    mt: 2,
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Num Vehicles</TableCell>
                      <TableCell>Miles Per Day</TableCell>
                      <TableCell>Daily Charging Hours Needed</TableCell>
                      <TableCell>Daily kWh Needed</TableCell>
                      <TableCell>Daily kWh Max Allowed ({results.total_number_chargers} chargers)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{safeToWhole(results.num_vehicles)}</TableCell>
                      <TableCell>{safeToWhole(results.miles_driven_per_day)}</TableCell>
                      <TableCell>{safeToFixed(results.charging_hours_needed_daily)}</TableCell>
                      <TableCell>{safeToFixed(results.total_energy_needed)}</TableCell>
                      <TableCell>{safeToFixed(results.usage_load_kw)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
              <br></br>
              <Typography variant="h6" gutterBottom>{results.message}</Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <MonthlyFeeBreakdownTable
              optimalCharging={optimalCharging}
              maxThroughputCharging={maxThroughputCharging}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Subscription Details">
              <Typography>Preferred Subscription Level: {results.subscription_level} - {results.subscription_threshold} kW with a fee of ${safeToFixed(results.subscription_fee)}</Typography>
              <Typography>Recommended Subscription Level based on vehicle operation: {results.usage_subscription_level} - {results.usage_subscription_threshold} kW with a fee of ${safeToFixed(results.usage_subscription_fee)}</Typography>
              <Typography>Basic Service Fee based with operational load of {safeToFixed(results.usage_load_kw)} kW: ${safeToFixed(results.usage_load_kw_basic_service_fee)}</Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <DashboardCard title="Operational Costs">
              <Typography>Weekly Operational EV costs for {safeToFixed(results.num_vehicles)} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week (consumption rates only, no fees): ${safeToFixed(results.weekly_ev_cost)}</Typography>
              <Typography>Monthly Operational EV costs (consumption rates with fees included): ${safeToFixed(results.monthly_ev_cost)}</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard title="ICE Costs">
              <Typography>Monthly Operational ICE cost for {results.num_vehicles} vehicles driving {results.miles_driven_per_day} miles/day for {results.charging_days_per_week} days/week with {results.ice_efficiency} MPG: ${safeToFixed(results.monthly_ice_cost)}</Typography>
              <Typography>Monthly Operational gas cost for one ICE vehicle: ${safeToFixed(results.monthly_ice_cost_one_vehicle)}</Typography>
              <Typography>Monthly Savings: ${safeToFixed(results.monthly_savings)}</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Load and Fees">
              <Typography>Max Load kW per hour: {safeToFixed(results.load_kw)}</Typography>
              <Typography>Max Subscription Level: {results.max_subscription_level} - {results.max_subscription_threshold} kW with a subscription charge of ${safeToFixed(results.max_subscription_fee)}</Typography>
              <Typography>Basic Service Fee based with max load of {safeToFixed(results.load_kw)} kW: ${safeToFixed(results.max_load_kw_basic_service_fee)}</Typography>
            </DashboardCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard title="GHG Reductions">
              <Typography>GHG reductions as difference between gasoline and electric GHGs</Typography>
              <Typography>Miles Driven: {results?.ghg_reduction_result?.['Miles Driven'] ?? 'N/A'}</Typography>
              <Typography>Gasoline Used (gallons): {results?.ghg_reduction_result?.['Gasoline Used (gallons)'] ?? 'N/A'}</Typography>
              <Typography>Electricity Used (kW): {results?.ghg_reduction_result?.['Electricity Used (kWh)'] ?? 'N/A'}</Typography>
              <Typography>Gasoline Fuel Usage GHGs (MT CO2): {results?.ghg_reduction_result?.['Gasoline Fuel Usage GHGs (MT CO2)'] ?? 'N/A'}</Typography>
              <Typography>Electric Fuel Usage GHGs (MT CO2): {results?.ghg_reduction_result?.['Electric Fuel Usage GHGs (MT CO2)'] ?? 'N/A'}</Typography>
              <Typography>Net GHG Reductions (MT CO2): {results?.ghg_reduction_result?.['Net GHG Reductions (MT CO2)'] ?? 'N/A'}</Typography>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <CostComparisonChart
              evCost={results.monthly_ev_cost}
              iceCost={results.monthly_ice_cost}
              basicServiceFee={results.basic_service_fee}
              subscriptionFee={results.usage_subscription_fee}
              consumptionCost={results.monthly_ev_cost - results.basic_service_fee - results.usage_subscription_fee}
            />
          </Grid>
          <Grid item xs={12}>
            <ChargersSelected chargers={results.chargers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <DashboardCard title="Cost Comparison Table">
              <CostComparisonTable
                iceCost={results.monthly_ice_cost}
                basicServiceFee={results.usage_load_kw_basic_service_fee}
                subscriptionFee={results.usage_subscription_fee}
                consumptionCost={results.monthly_ev_cost - results.usage_load_kw_basic_service_fee - results.usage_subscription_fee}
              />
            </DashboardCard>
          </Grid>
        </Grid>
        <Box mt={3}>
          <Link href="/">
            <ActionButton type="button" className="next action-button">Restart</ActionButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default Results;
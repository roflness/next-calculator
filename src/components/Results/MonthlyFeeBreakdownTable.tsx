import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

interface FeeBreakdown {
  basicServiceFee: number;
  subscriptionFee: number;
  consumptionFee: number;
  totalMonthlyCost: number;
}

interface MonthlyFeeBreakdownTableProps {
  optimalCharging: FeeBreakdown;
  maxThroughputCharging: FeeBreakdown;
}

const MonthlyFeeBreakdownTable: React.FC<MonthlyFeeBreakdownTableProps> = ({ optimalCharging, maxThroughputCharging }) => {
    const safeToFixed = (value: any, decimals: number = 2) => {
        return value !== undefined && value !== null ? value.toFixed(decimals) : 'N/A';
      };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h6" gutterBottom>
        Monthly Fee Breakdown
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Scenario</TableCell>
            <TableCell>Basic Service Fee</TableCell>
            <TableCell>Subscription Fee</TableCell>
            <TableCell>Consumption Fee</TableCell>
            <TableCell align="right">Total Monthly Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Optimal Charging (Preferred)</TableCell>
            <TableCell>${safeToFixed(optimalCharging.basicServiceFee)}</TableCell>
            <TableCell>${safeToFixed(optimalCharging.subscriptionFee)}</TableCell>
            <TableCell>${safeToFixed(optimalCharging.consumptionFee)}</TableCell> 
            <TableCell align="right">
             <Typography variant="h6">${safeToFixed(optimalCharging.totalMonthlyCost)}</Typography>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Max Charging</TableCell>
            <TableCell>${safeToFixed(maxThroughputCharging.basicServiceFee)}</TableCell>
            <TableCell>${safeToFixed(maxThroughputCharging.subscriptionFee)}</TableCell>
            <TableCell>${safeToFixed(maxThroughputCharging.consumptionFee)}</TableCell>
            <TableCell align="right">
                <Typography variant="h6">${safeToFixed(maxThroughputCharging.totalMonthlyCost)}</Typography>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MonthlyFeeBreakdownTable;
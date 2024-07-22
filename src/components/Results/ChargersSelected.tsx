// src/components/shared/ChargersSelected.tsx
import React from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import DashboardCard from '../shared/DashboardCard';

interface ChargerType {
  type: string;
  rating_kW: number;
  count: number;
}

interface ChargersSelectedProps {
  chargers: ChargerType[];
}

const ChargersSelected: React.FC<ChargersSelectedProps> = ({ chargers }) => {
  return (
    <DashboardCard title="Chargers Selected">
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
              <TableCell>Type</TableCell>
              <TableCell>Rating (kW)</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chargers?.map((charger, index) => (
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
  );
};

export default ChargersSelected;
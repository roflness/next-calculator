import React from 'react';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '../shared/DashboardCard';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface CostComparisonChartProps {
  evCost?: number;
  iceCost?: number;
  basicServiceFee?: number;
  subscriptionFee?: number;
  consumptionCost?: number;
}

const CostComparisonChart: React.FC<CostComparisonChartProps> = ({
  evCost = 0,
  iceCost = 0,
  basicServiceFee = 0,
  subscriptionFee = 0,
  consumptionCost = 0,
}) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: true,
      },
      height: 370,
      stacked: true,
    },
    colors: [primary, secondary, '#00C49F', '#FFBB28'],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: '60%',
        columnWidth: '60%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
      },
    },
    stroke: {
      show: true,
      width: 5,
      lineCap: 'butt',
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: true,
      total: {
        enabled: true,
        style: {
          fontSize: '13px',
          fontWeight: 900,
        },
      },
      formatter: function (val: number) {
        return val !== 0 ? `$${val.toFixed(2)}` : '';
      },
    },
    legend: {
      show: true,
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        formatter: function (value: number) {
          return `$${value.toFixed(2)}`;
        },
      },
    },
    xaxis: {
      categories: ['EV Costs', 'ICE Costs'],
      axisBorder: {
        show: false,
      },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
      y: {
        formatter: function (value: number) {
          return `$${value.toFixed(2)}`;
        },
      },
    },
  };

  const seriescolumnchart: any = [
    iceCost !== 0 && {
        name: 'ICE Cost',
        data: [0, iceCost],
    },
    basicServiceFee !== 0 && {
      name: 'Basic Service Fee',
      data: [basicServiceFee, 0],
    },
    subscriptionFee !== 0 && {
      name: 'Subscription Fee',
      data: [subscriptionFee, 0],
    },
    consumptionCost !== 0 && {
      name: 'Consumption Cost',
      data: [consumptionCost, 0],
    },

  ].filter(Boolean);  // filter out any falsy values

  return (
    <DashboardCard title="EV vs ICE Costs">
      <Chart
        options={optionscolumnchart}
        series={seriescolumnchart}
        type="bar"
        height="auto"
        width={'100%'}
      />
    </DashboardCard>
  );
};

export default CostComparisonChart;
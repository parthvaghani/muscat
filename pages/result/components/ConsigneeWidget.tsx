import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';

import DashboardWidgetCard from '../../../src/components/shared/DashboardWidgetCard';
import SkeletonEmployeeSalaryCard from "../../../src/components/dashboards/skeleton/EmployeeSalaryCard";
import { Box } from "@mui/material";


 

const ConsigneeWidget = ({ scoresPercentage, title  }: {scoresPercentage: [string, number][] , title: string}) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.error.main;

  const labels: string[][] = [];
  const data: number[] = [];

  scoresPercentage.forEach(([label, value]) => { 
    labels.push([label]);
    data.push(value);
  });
  
  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'bar',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 280,
    },
    colors: [primarylight, primarylight,  primarylight, primarylight, primarylight,primary,primary,primary,primary,primary],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: true,
        endingShape: 'rounded',
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    xaxis: {
      categories: labels,
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: true,
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
    },
  };
  const seriescolumnchart = [
    {
      name: '',
      data: data,
    },
  ];

  return (
    <>
      {
        (
          <DashboardWidgetCard
            title={title}
            subtitle=""
            dataLabel1="점수"
            dataItem1="36,358"
            dataLabel2="평균점수"
            dataItem2="5,296"
          >
            <>
              <Box height="295px">
                <Chart options={optionscolumnchart} series={seriescolumnchart} type="bar" height={280} width={"100%"} />
              </Box>
            </>
          </DashboardWidgetCard>
        )}
    </>

  );
};

export default ConsigneeWidget;

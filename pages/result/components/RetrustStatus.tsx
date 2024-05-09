import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Typography, Avatar } from '@mui/material'; 

import DashboardCard from '../../../src/components/shared/DashboardCard'; 

 

const RetrustStatus = ({ retrustCount1,retrustCount2 }: {retrustCount1:number, retrustCount2:number}) => {
  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = theme.palette.primary.light;
  const successlight = theme.palette.success.light;

  // chart
  const optionscolumnchart: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: '#adb0bb',
      toolbar: {
        show: false,
      },
      height: 155,
    },
    colors: [primary, primarylight, '#F9F9FD'],
    plotOptions: {
      pie: {
        startAngle: 0,
        endAngle: 360,
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    responsive: [
      {
        breakpoint: 991,
        options: {
          chart: {
            width: 120,
          },
        },
      },
    ],
  };
  const seriescolumnchart = [retrustCount1, retrustCount2];

  return (
    <>
      {
          (
          <DashboardCard title="재위탁 여부">
            <Grid container spacing={3}>
              {/* column */}
              <Grid item xs={7} sm={7}> 
                <Stack spacing={3} mt={5} direction="row">
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ width: 9, height: 9, bgcolor: primary, svg: { display: 'none' } }}
                    ></Avatar>
                    <Typography variant="subtitle2" color="textSecondary">
                      재위탁 있음 {retrustCount1}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar
                      sx={{ width: 9, height: 9, bgcolor: primarylight, svg: { display: 'none' } }}
                    ></Avatar>
                    <Typography variant="subtitle2" color="textSecondary">
                    재위탁 없음 {retrustCount2}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
              {/* column */}
              <Grid item xs={5} sm={5}>
                <Chart
                  options={optionscolumnchart}
                  series={seriescolumnchart}
                  type="donut"
                  height={150}
                  width={"100%"}
                />
              </Grid>
            </Grid>
          </DashboardCard>
        )}
    </>

  );
};

export default RetrustStatus;
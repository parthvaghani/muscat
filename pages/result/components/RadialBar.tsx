import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles"; 
import ParentCard from "../../../src/components/shared/ParentCard"; 
export default function RadialbarChart({ countYByArea, countNByArea , title}: { countYByArea: Record<string, number>, countNByArea: Record<string, number>, title:string }) {

  // chart color
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // 라벨과 데이터를 초기화합니다.
  const labels1: string[] = [];
  const data1: number[] = [];

  const labels2: string[] = [];
  const data2: number[] = [];

  // countYByArea와 countNByArea에서 각각 라벨과 데이터를 추출합니다.
  for (const [label, value] of Object.entries(countYByArea)) {
    labels1.push(label);
    data1.push(value);
  }
  for (const [label, value] of Object.entries(countNByArea)) {
    labels2.push(label);
    data2.push(value);
  }
  console.log(labels2)

  // Radar Chart의 옵션과 시리즈를 설정합니다.
  const optionsradarchart: any = {
    chart: {
      id: "pie-chart",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      toolbar: {
        show: false,
      },
    },
    colors: [primary, secondary],
    labels: labels2, // 라벨 설정
    tooltip: {
      theme: "dark",
    },
  };
  const seriesradarchart: any = [
    {
      name: "최초점검",
      data: data1, // 데이터 설정
    },
    {
      name: "이행점검",
      data: data2, // 데이터 설정
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item lg={12} md={12} xs={12}>
        <ParentCard title={title}>
          <Chart
            options={optionsradarchart}
            series={seriesradarchart}
            type="radar"
            height="300px"
            width={"100%"}
          />
        </ParentCard>
      </Grid>
    </Grid> 
  );
};

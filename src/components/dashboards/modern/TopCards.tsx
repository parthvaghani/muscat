import Image from "next/image";
import { Box, CardContent, Grid, Typography } from "@mui/material";

 
const topcards = [
  { 
    title: "이슈 사항",
    digits: "96",
    bgcolor: "primary",
  },
  { 
    title: "지연",
    digits: "3,650",
    bgcolor: "warning",
  },
  { 
    title: "점검 제외",
    digits: "356",
    bgcolor: "secondary",
  },
  { 
    title: "자가점검 제출 대기",
    digits: "696",
    bgcolor: "error",
  },
  { 
    title: "검수 중",
    digits: "96k",
    bgcolor: "success",
  },
  { 
    title: "검수 완료",
    digits: "59",
    bgcolor: "info",
  },
];

const TopCards = () => {
  return (
    <Grid container spacing={2} mt={1}>
      {topcards.map((topcard, i) => (
        <Grid item xs={12} sm={8} lg={4} key={i}>
          <Box bgcolor={topcard.bgcolor + ".light"} textAlign="center" padding={1}> 
              <Typography
                color={topcard.bgcolor + ".main"}
                variant="subtitle1"
                fontWeight={600}
              >
                {topcard.title}
              </Typography>
              <Typography
                color={topcard.bgcolor + ".main"}
                variant="h4"
                fontWeight={600}
              >
                {topcard.digits}
              </Typography>
           
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;

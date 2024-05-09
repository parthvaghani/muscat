import React from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Button } from '@mui/material';
import { IconChevronsRight, IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../../src/components/shared/DashboardCard';
import SkeletonSalesOverviewCard from '../../../src/components/dashboards/skeleton/SalesOverviewCard';
import { Row } from 'antd';

interface SalesOverviewCardProps {
  isLoading: boolean;
}

const CheckStatus = ({ numberOfFailedCheck1, numberOfFailedCheck2, companyCount }: {numberOfFailedCheck1:number, numberOfFailedCheck2:number, companyCount:number}) => {
  // chart color
  const theme = useTheme(); 
  return (
    <>
      {
          (
          <DashboardCard>
            <>
            <Box display={'flex'} alignItems={'center'}  >
              <Typography mt={3} width={140} textAlign={'center'} fontSize={20}>
                최초 점검
              </Typography>
              <Box
                sx={{ my: 0.5, width:"82px", height:1 }}
              >
              </Box>
              <Typography mt={3} width={140} textAlign={'center'} fontSize={20}>
                이행 점검
              </Typography>
              
            </Box>
            <Box display={'flex'} alignItems={'center'}  >
              <Box mt={0} width={140} sx={{mr: '10px'}}>
                <Box sx={{border:'4px solid #ffc000', borderRadius: 70, width: 140, height: 140, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Box>
                    <Typography sx={{fontSize: 16}}>
                      미흡
                    </Typography>
                    <Typography sx={{fontSize: 16}}>
                      <Typography sx={{fontWeight: 'bold', fontSize: 24, display: 'inline', color: '#ffc000'}}>
                        {numberOfFailedCheck1}
                      </Typography>
                      건
                    </Typography>
                    <Typography sx={{fontSize:16}}>
                      1개사 당 <Typography sx={{fontWeight: 'bold', fontSize: 24, display: 'inline', color: '#ffc000'}}>{numberOfFailedCheck1/companyCount}</Typography>건
                    </Typography>
                    
                  </Box>
                </Box>
              </Box>
              <Button
                sx={{ my: 0.5, width:"25px", height:1 }}
                variant="outlined"
                size="small" 
                aria-label="move all right"
              >
                <IconChevronsRight width={20} height={20} />
              </Button>
              <Box mt={3} height="155px" width={155}>
                <Box sx={{border:'4px solid #ed7d31', ml: '10px', borderRadius: 70, width: 140, height: 140, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Box>
                    <Typography sx={{fontSize: 16}}>
                      미흡
                    </Typography>
                    <Typography sx={{fontSize: 16}}>
                      <Typography sx={{fontWeight: 'bold', fontSize: 24, display: 'inline', color: '#ed7d31'}}>
                        {numberOfFailedCheck2}
                      </Typography>
                      건
                    </Typography>
                    <Typography sx={{fontSize:16}}>
                      1개사 당 <Typography sx={{fontWeight: 'bold', fontSize: 24, display: 'inline', color: '#ed7d31'}}>{numberOfFailedCheck2/companyCount}</Typography>건
                    </Typography>
                    
                  </Box>
                </Box>
              </Box>
              
            </Box>
            
            </>
          </DashboardCard>
        )}
    </>

  );
};

export default CheckStatus;

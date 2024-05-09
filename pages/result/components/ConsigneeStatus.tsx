import React, { useState } from 'react';
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { useTheme } from '@mui/material/styles';
import { Stack, Typography, Box, Button } from '@mui/material';
import { IconChevronsRight, IconGridDots } from '@tabler/icons-react';
import DashboardCard from '../../../src/components/shared/DashboardCard';
import SkeletonSalesOverviewCard from '../../../src/components/dashboards/skeleton/SalesOverviewCard';
import { Row } from 'antd';
 

const ConsigneeStatus = ({  consigneeData}:  {   consigneeData: any;}) => {
  // chart color
  const theme = useTheme();
  const [companyName, setCompanyName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [address, setAddress] = useState('');
  const [contractContent, setContractContent] = useState<string>('');
  const [managerPhoen, setManagerPhoen] = useState<string>('');
  const [contractEndDate, setContractEndDate] = useState<string>('');
  const [representativeIndustry, setRepresentativeIndustry] = useState<string>('');
  const [totalEmployees, setTotalEmployees] = useState<string>('');
  const [privacyHandlers, setPrivacyHandlers] = useState<string>('');
  const [yearlyPrivacyHandle, setYearlyPrivacyHandle] = useState<string>('');
  const [annualPersonalInformation, setAnnualPersonalInformation] = useState<string>('<1000');
  const [systemUsageStatus, setSystemUsageStatus] = useState<string>('no');
  const [systemUsageStatusText, setSystemUsageStatusText] = useState<string>('');
  const [retrustStatus, setRetrustStatus] = useState<string>('no');
  const [retrustStatusText, setRetrustStatusText] = useState<string>('');
  const [thirdPartyStatus, setThirdPartyStatus] = useState<string>('no');
  const [thirdPartyStatusText, setThirdPartyStatusText] = useState<string>('');
  const [personInChargeName, setPersonInChargeName] = useState<string>('');
  const [personInChargeContact, setPersonInChargeContact] = useState<string>('');

  const [selectedItems, setSelectedItems] = useState([]);

  const [privacyItems, setPrivacyItems] = useState([]);
  React.useEffect(() => {
      
      let data = JSON.parse(consigneeData.status); 

      setCompanyName(data.companyName)
      setManagerName(data.managerName)
      setManagerPhoen(data.managerPhoen)
      setAddress(data.address)
      setContractContent(data.contractContent) 
      setContractEndDate(data.contractEndDate)
      setRepresentativeIndustry(data.representativeIndustry)
      setTotalEmployees(data.totalEmployees)
      setAnnualPersonalInformation(data.annualPersonalInformation)
      setYearlyPrivacyHandle(data.yearlyPrivacyHandle)
      setSystemUsageStatus(data.systemUsageStatus)
      setRetrustStatus(data.retrustStatus)
      setThirdPartyStatus(data.thirdPartyStatus)
      setSystemUsageStatusText(data.systemUsageStatusText)
      setRetrustStatusText(data.retrustStatusText)
      setThirdPartyStatusText(data.thirdPartyStatusText)
  
  }, []);
  
  return (
    <>
      <DashboardCard>
        <>
          <Box sx={{textAlign: 'center', borderBottom: 1, borderRadius:0, display: 'flex', justifyContent: 'center'}}>
            <Typography sx={{fontWeight: 'bold', fontSize: 18}}>
              {companyName}-대표 업종
            </Typography> 
          </Box>
          <Box sx={{borderBottom: 1, borderRadius:0, pb: 1}}>
            <Typography sx={{fontSize:15, fontWeight: 'bold', ml:1, mt:1}}>
              수탁사정보
            </Typography>
            
            <Box sx={{ml: 3, mt:1}}>
              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  위탁 업무
                </Typography>
                <Typography>
                  {contractContent}
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                 주소
                </Typography>
                <Typography>
                {address}
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  보안 담당자
                </Typography>
                <Typography>
                {managerName}
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  연락처
                </Typography>
                <Typography>
                  {managerPhoen}
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  이메일
                </Typography>
                <Typography>
                  test@test.com
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  개인정보취급자수
                </Typography>
                <Typography>
                  {privacyHandlers}명
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  개인정보처리량
                </Typography>
                <Typography>
                  연간 {yearlyPrivacyHandle}만건
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  개인정보처리시스템
                </Typography>
                <Typography>
                  시스템명
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  재위탁/제3자제공
                </Typography>
                <Typography>
                  재위탁사명/제3자제공 업체명
                </Typography>
              </Box>
              <Box sx={{display: 'flex', mt: '4px', alignItems: 'center'}}>
                <Typography sx={{width: 150}}>
                  개인정보 취급 항목
                </Typography>
                <Box sx={{borderRadius: 0, backgroundColor: 'red', p: '3px'}}>
                  1등급
                </Box>
                <Box sx={{borderRadius: 0, backgroundColor: '', p: '3px', ml: 1}}>
                  2등급
                </Box>
                <Box sx={{borderRadius: 0, backgroundColor: 'yellow', p: '3px', ml: 1}}>
                  3등급
                </Box>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography sx={{fontSize:15, fontWeight: 'bold', ml:1, mt:1}}>
              위탁사정보
            </Typography>
            
            <Box sx={{ml: 3, mt:1}}>
              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  현업 부서
                </Typography>
                <Typography>
                  부서명
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  보안 담당자
                </Typography>
                <Typography>
                  {totalEmployees}
                </Typography>
              </Box>

              <Box sx={{display: 'flex', mt: '4px'}}>
                <Typography sx={{width: 150}}>
                  이메일
                </Typography>
                <Typography>
                  test@test.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </>
      </DashboardCard>
    </>

  );
};

export default ConsigneeStatus;

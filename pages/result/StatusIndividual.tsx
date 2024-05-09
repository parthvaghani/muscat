import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect'; 
const axios = require('axios');
import { API_URL } from '@pages/constant';
import React, { useState } from 'react';
import {  Box, Button, Grid,  Typography, FormControlLabel, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@mui/material';  
import InnerSystemEnable from './components/InnerSystemEnable';
import RadialbarChart from './components/RadialBar';
import RetrustStatus from './components/RetrustStatus';
import ConsigneeWidget from './components/ConsigneeWidget';
import VerticalBarWidget from './components/VerticalBarWidget';
import HorizontalBarWidget from './components/HorizontalBarWidget';
import Image from "next/image";
import Go0 from "public/images/img/go0.png";
import Go1 from "public/images/img/go1.png";
import Go2 from "public/images/img/go2.png";
import Go3 from "public/images/img/go3.png";
import Go4 from "public/images/img/go4.png";
import Go5 from "public/images/img/go5.png";
import Go6 from "public/images/img/go6.png";
import Go7 from "public/images/img/go7.png";
import DetailOn from "public/images/img/detail_on.png";
import DetailOff from "public/images/img/detail_off.png";
import ConsigneeStatus from './components/ConsigneeStatus';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox';
import axiosPost from '@pages/axiosWrapper';
import CheckResult from './components/CheckResult';
import CheckStatus from './components/CheckStatus';

let goArray = [
  Go0,
  Go1,
  Go2,
  Go3,
  Go4,
  Go5,
  Go6,
  Go7,
]
const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '점검 및 결과',
  },
];
 

export default function StatusIndividual({consignor, consigneeData}: {consignor:string, consigneeData: any;} ) {
  const [type, setType] = React.useState('status');
  const [stage, setStage] = React.useState(0);
  const ar = [1, 2, 3, 4, 5, 6, 7];
  

  const [userType, setUserType] = React.useState(0); 

  const [totalCount1, setTotalCount1] = useState(0) //최초점검완료총개수
  const [totalCount2, setTotalCount2] = useState(0) //이행점검완료총개수
  const [totalCompCount1, setTotalCompCount1] = useState(0) //최초점검완료완료개수
  const [totalCompCount2, setTotalCompCount2] = useState(0) //이행점검완료완료개수
  const [exceptTotalCount, setExceptTotalCount] = useState(0) //점검제외개수
  const [exceptCount1, setExceptCount1] = useState(0) // PG사 점검제외개수
  const [exceptCount2, setExceptCount2] = useState(0) // 인증서 제출 점검제외개수
  const [exceptCount3, setExceptCount3] = useState(0) // 점검거부 점검제외개수 
  const [companyCount, setCompanyCount] = useState(0) //회사 개수 
  const [failedCheckCount1, setFailedCheckCount1] = useState(0)  //미흡건수1
  const [failedCheckCount2, setFailedCheckCount2] = useState(0)  //미흡건수2
   
  const [systemUsageStatusCount1, setSystemUsageStatusCount1] = useState(0) 
  const [systemUsageStatusCount2, setSystemUsageStatusCount2] = useState(0)  
  const [retrustCount1, setRetrustCount1] = useState(0) 
  const [retrustCount2, setRetrustCount2] = useState(0) 
 
  const [countYByArea, setCountYByArea] = useState({})
  const [countNByArea, setCountNByArea] = useState({})
  const [countNByDomain, setCountNByDomain] = useState({})
  const [countYByDomain, setCountYByDomain] = useState({}) 


  React.useEffect(() => {
    const str = sessionStorage.getItem('user')
    const type = JSON.parse(str).type
    setUserType(type); 
  }, [])

  

  React.useEffect(() => {
    let aa = (consigneeData.state - 1) * 3 + (consigneeData.sub_state - 1);
    aa += 2;
    if (aa == 2) {
      if (consigneeData.create_date) {
        if (consigneeData.status) aa = 2;
        else aa = 1;
      }
      else aa = 0;
    } 
    setStage(aa)


    // "first_check_data"의 "check_result"가 "N"인 개수 세기 
    if (consigneeData.first_check_data) {
      const firstCheckData = JSON.parse(consigneeData.first_check_data);
      const failedChecks = firstCheckData.filter((check:any) => check.check_result === "N");
      setFailedCheckCount1( failedChecks.length)
    }
    if (consigneeData.imp_check_data) {
      const firstCheckData = JSON.parse(consigneeData.imp_check_data);
      const failedChecks = firstCheckData.filter((check:any) => check.check_result === "N");
      setFailedCheckCount2( failedChecks.length)
    }

    const countResultYByDomain: Record<string, number> = {};
    if (countResultYByDomain.first_check_data) {
      const data = JSON.parse(consigneeData.first_check_data);
      data.forEach((item: any) => {
        // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
        if (item.check_result === "Y" && item.domain) {
          countResultYByDomain[item.domain] = (countResultYByDomain[item.domain] || 0) + 1;
        }
      }); 
    }

    const countResultByDomain: Record<string, number> = {};
    for (const [domain] of Object.entries(countResultYByDomain)) {
      // 해당 area에 대한 first_check_data의 총 개수를 계산 
      const data = JSON.parse(consigneeData.first_check_data);
      const areaCount = data.filter((item: any) => item.domain === domain).length;  
      // 해당 area에 대한 N의 백분율을 계산하여 저장
      countResultByDomain[domain] = Math.floor((countResultYByDomain[domain] * 100) / areaCount);
    }
 //////////////////////////////////
    const countResultNByDomain: Record<string, number> = {};
    if (countResultNByDomain.first_check_data) {
      const data = JSON.parse(consigneeData.imp_check_data);
      data.forEach((item: any) => {
        // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
        if (item.check_result === "Y" && item.domain) {
          countResultNByDomain[item.domain] = (countResultNByDomain[item.domain] || 0) + 1;
        }
      }); 
    }

    const countResultByDomain2: Record<string, number> = {};
    for (const [domain] of Object.entries(countResultNByDomain)) {
      // 해당 area에 대한 first_check_data의 총 개수를 계산 
      const data = JSON.parse(consigneeData.imp_check_data);
      const areaCount = data.filter((item: any) => item.domain === domain).length;  
      // 해당 area에 대한 N의 백분율을 계산하여 저장
      countResultByDomain2[domain] = Math.floor((countResultByDomain2[domain] * 100) / areaCount);
    }
      
    setCountNByArea(countResultByDomain)
    setCountYByArea(countResultByDomain2)

  }, [consigneeData]); 
  
 


  return (
    <Box  >
      <Grid container >
        <Grid item xs={1}>
          <Box sx={{backgroundColor: '#7F7F7F', textAlign: 'center', borderRadius: 0, color: 'white'}}>
            최초점검점수
          </Box>
          <Box sx={{backgroundColor: '#D9D9D9', textAlign: 'center', borderRadius: 0, borderColor: '#797979', border: 1, height: 'calc(20vh)', marginBottom: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
            <Typography sx={{color: 'red', fontSize: 20, marginRight: 1}}>-</Typography>
            <Typography sx={{fontSize: 20}}>점</Typography>
          </Box>
          <Box onClick={() => setType('status')} sx={{backgroundColor: type == 'status' ? '#FFFFFF' : '#D9D9D9', textAlign: 'center', borderRadius: 0, borderColor: '#A5A5A5', border: 1, borderBottom: 0, height: 'calc(20vh)', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
            <Typography sx={{fontSize: 16}}>일반 현황</Typography>
            
          </Box>
          <Box onClick={() => setType('check')} sx={{backgroundColor: type == 'check' ? '#FFFFFF' : '#D9D9D9', textAlign: 'center', borderRadius: 0, borderColor: '#A5A5A5', border: 1, height: 'calc(20vh)', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
            <Typography sx={{fontSize: 16}}>{consigneeData.state == 2 && consigneeData.sub_state == 2 ? '점검 결과' : '점검 수행'}</Typography> 
          </Box>
        </Grid>
        <Grid item xs={11} sx={{p:1}}>
        {type == 'status' ? (
          <Grid item xs={12} container>
            <Grid item xs={12} justifyContent={'center'} display={'flex'}>
              <Box sx={{width: 700}}>
                <Box>
                  점검 진행현황
                </Box>
                <Box> 
                  {ar.map((x, i)=>{
                    if (x <= stage)
                      return  (
                        <Image key={i} src={goArray[x]} alt={"SavingsImg"} width="100" />
                      );
                    else 
                      return  (
                        <Image key={i} src={goArray[0]} alt={"SavingsImg"} width="100" />
                      );
                  })}
                </Box>
                <Box display={'flex'}>
                  <Typography sx={{width: 100, textAlign: 'center'}}>점검 시작</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>자가점검중</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>검수 중</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>최초 점검 완료</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>보완자료 요청</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>보완자료 제출</Typography>
                  <Typography sx={{width: 100, textAlign: 'center'}}>이행 점검 완료</Typography>
                </Box>
              </Box>
            </Grid>


            {stage >= 1 &&
             <Grid item xs={6} style={{padding:8}} width={16}> 
            { consigneeData.status == null ?  <Typography sx={{fontSize: 24, color: '#2C2C2C', fontWeight: 'bold'}}>  수탁사 현황이 등록되지 않았습니다. </Typography>
             :     <ConsigneeStatus consigneeData={consigneeData}/>}
              </Grid>
            }
            {(stage >= 1 && stage <= 7) &&
            <Grid item xs={6} style={{padding:8, alignItems: 'center', justifyContent: 'center', display: 'flex'}} height={400}> 
              <Typography sx={{fontSize: 24, color: '#2F5597', fontWeight: 'bold'}}> &gt;&gt;&gt; 점검 진행중입니다. &gt;&gt;&gt; </Typography>
            </Grid>
            }

            {/* {stage == 7 && 
              <Grid item xs={6} style={{padding:8}}> 
               <CheckStatus numberOfFailedCheck1={failedCheckCount1} numberOfFailedCheck2={failedCheckCount2} companyCount={companyCount}></CheckStatus>
              </Grid>
            }
            {stage == 7 && 
              <Grid item xs={6} style={{padding:8}}> 
              </Grid>
            }
            {stage == 7 && 
              <Grid item xs={6} style={{padding:8}}> 
              </Grid>
            }
            {stage == 7 && 
              <Grid item xs={6} style={{padding:8}}>
                <RadialbarChart countYByArea={countYByDomain}  countNByArea={countNByDomain} title={'최초/이행 분야별 평균 점수'}></RadialbarChart>
              </Grid>
            }
            {stage == 7 && 
              <Grid item xs={6} style={{padding:8}}> 
              </Grid>
            }
            {stage == 7 && 
              <VerticalBarWidget/>
              
            
            }
            {stage == 7 && 
              <HorizontalBarWidget/>
            } */}
          </Grid>
        ) : <CheckResult consignor={consignor} consigneeData={consigneeData} userType={userType} />}
        
        </Grid>
      </Grid> 
    </Box>
  );
};

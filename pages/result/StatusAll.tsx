import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect'; 
const axios = require('axios');
import { API_URL } from '@pages/constant';
import React, { useEffect, useState } from 'react';
import { Box,  Fab,  Grid,  Link,  List,  ListItem,  ListItemText,  Typography} from '@mui/material';   
import CheckStatus from './components/CheckStatus';
import InnerSystemEnable from './components/InnerSystemEnable';
import RadialbarChart from './components/RadialBar';
import RetrustStatus from './components/RetrustStatus';
import ConsigneeWidget from './components/ConsigneeWidget'; 
import Go0 from "public/images/img/go0.png";
import Go1 from "public/images/img/go1.png";
import Go2 from "public/images/img/go2.png";
import Go3 from "public/images/img/go3.png";
import Go4 from "public/images/img/go4.png";
import Go5 from "public/images/img/go5.png";
import Go6 from "public/images/img/go6.png";
import Go7 from "public/images/img/go7.png";
import DashboardCard from '@src/components/shared/DashboardCard';
import { IconPlus } from '@tabler/icons-react'; 
 
const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '점검 및 결과',
  },
];

 
export default function StatusAll({consigneeList}: {  consigneeList: any;}) {
  const [totalCount1, setTotalCount1] = useState(0) //최초점검완료총개수
  const [totalCount2, setTotalCount2] = useState(0) //이행점검완료총개수
  const [totalCompCount1, setTotalCompCount1] = useState(0) //최초점검완료완료개수
  const [totalCompCount2, setTotalCompCount2] = useState(0) //이행점검완료완료개수
  const [exceptTotalCount, setExceptTotalCount] = useState(0) //점검제외개수
  const [exceptCount1, setExceptCount1] = useState(0) // PG사 점검제외개수
  const [exceptCount2, setExceptCount2] = useState(0) // 인증서 제출 점검제외개수
  const [exceptCount3, setExceptCount3] = useState(0) // 점검거부 점검제외개수 
  const [companyCount, setCompanyCount] = useState(0) //회사 개수 
  const [companySet, setCompanySet] = useState({}) //회사 명
  const [failedCheckCount1, setFailedCheckCount1] = useState(0)  //미흡건수1
  const [failedCheckCount2, setFailedCheckCount2] = useState(0)  //미흡건수2

  const [companyScoresPercentage, setCompanyScoresPercentage] = useState<[string, number][]>([]);//평균대비 우수/취약 수탁사
  const [systemUsageStatusCount1, setSystemUsageStatusCount1] = useState(0) //자체처리 시스템 사용함
  const [systemUsageStatusCount2, setSystemUsageStatusCount2] = useState(0)  //자체처리 시스템 사용안함
  const [retrustCount1, setRetrustCount1] = useState(0)  //재위탁 여부
  const [retrustCount2, setRetrustCount2] = useState(0) 

  const [firstScoreByArea, setFirstScoreByArea] = useState({}) //최초영역별 평균점수 
  const [impScoreByArea, setImpScoreByArea] = useState({}) //이행영역별 평균점수
  
  const [firstScoreByDomain, setFirstScoreByDomain] = useState({}) //최초분야별 평균점수
  const [impScoreByDomain, setImpScoreByDomain] = useState({}) //이행분야별 평균점수
  
  
  const [workNameScoresPercentage, setWorkNameScoresPercentage] = useState({})   //업종에 따른 평균점수
  const [countResultNByStatus, setCountNByStatus] = useState({})   //개인정보 처리량에 따른 평균점수

  const [countYByAnnualArea, setCountYByAnnualArea] = useState({}) //2023년도 영역별 평균점수 
  const [countNByAnnualArea, setCountNByAnnualArea] = useState({}) //2024년도 영역별 평균점수

  const [firstFailedItemByArea, setFirstFailedItemByArea] = useState({}) //전년도 미흡항목
  const [secondFailedItemByArea, setSecondFailedItemByArea] = useState({}) //금년도 미흡항목 
 
  useEffect(()=>{ 
    console.log('-----------------><----------------');
    console.log(consigneeList);
    setTotalCount1(consigneeList.filter((x:any) => x.state == 1).length)
    setTotalCount2(consigneeList.filter((x:any) => x.state == 2).length)
    setTotalCompCount1(consigneeList.filter((x:any) => x.state == 1 && x.sub_state == 3 ).length )//수정필요
    setTotalCompCount2(consigneeList.filter((x:any) => x.state == 2 && x.sub_state == 3).length)//수정필요
    setExceptTotalCount(consigneeList.filter((x:any) => x.state == 3).length)  
    setExceptCount1(consigneeList.filter((x:any) => x.state == 3 && x.except_type == 1).length) 
    setExceptCount2(consigneeList.filter((x:any) => x.state == 3 && x.except_type == 2).length) 
    setExceptCount3(consigneeList.filter((x:any) => x.state == 3 && x.except_type == 4).length) 

    const uniqueCompanyIds = new Set(consigneeList.map((item : any) => item.company_id)); 
    setCompanyCount(uniqueCompanyIds.size == 0 ? 1 : uniqueCompanyIds.size )// 

    const uniqueCompanyNames = new Set(consigneeList.map((item : any) => item.company_id)); 
    setCompanySet(uniqueCompanyNames )// 
    console.log(uniqueCompanyNames);

    // "first_check_data"의 "check_result"가 "N"인 개수 세기
    const numberOfFailedCheck1 = consigneeList.reduce((count:any, item:any) => {
      if (item.first_check_data) {
        const firstCheckData = JSON.parse(item.first_check_data);
        const failedChecks = firstCheckData.filter((check:any) => check.check_result === "N");
        return count + failedChecks.length;
      }
      return count;
    }, 0);
    setFailedCheckCount1(numberOfFailedCheck1)

    const numberOfFailedCheck2 = consigneeList.reduce((count:any, item:any) => {
      if (item.imp_check_data) {
        console.log(item.imp_check_data)
        const data = JSON.parse(item.imp_check_data);
        const failedChecks = data.filter((check:any) => check.check_result === "N");
        return count + failedChecks.length;
      }
      return count;
    }, 0);
    setFailedCheckCount2(numberOfFailedCheck2)  


    const countSystemUsageStatusYes = consigneeList.reduce((count:any, item:any) => {
      if (item.status) {
        const status = JSON.parse(item.status);
        console.log(status)
         if( status.systemUsageStatus === "yes")
             return count + 1; 
      }
      return count;
    }, 0);

     
    const countSystemUsageStatusNo = consigneeList.reduce((count:any, item:any) => {
      if (item.status) {
        const status = JSON.parse(item.status);
        console.log(status)
         if( status.systemUsageStatus === "no")
             return count + 1; 
      }
      return count;
    }, 0);
    
    setSystemUsageStatusCount1(countSystemUsageStatusYes) 
    setSystemUsageStatusCount2(countSystemUsageStatusNo) 

    const retrustCount1 = consigneeList.reduce((count:any, item:any) => {
      if (item.status) {
        const status = JSON.parse(item.status);
        if( status.retrustStatus === "yes")
          return count + 1;  
      }
      return count;
    }, 0);

     
    const retrustCount2 = consigneeList.reduce((count:any, item:any) => {
      if (item.status) {
        const status = JSON.parse(item.status);
        if( status.retrustStatus === "no")
           return count + 1;  
      }
      return count;
    }, 0);

    setRetrustCount1(retrustCount1);
    setRetrustCount2(retrustCount2);




    const totalCountByCompany: Record<string, number> = {};

    // 각 회사별로 프로젝트 개수를 계산합니다.
    consigneeList.forEach((item: any) => {
      const companyName = item.company_name;
      if (item.imp_check_data ) { 
        totalCountByCompany[companyName] = (totalCountByCompany[companyName] || 0) + 1;
      }else{
        totalCountByCompany[companyName] = (totalCountByCompany[companyName] || 0) ;
      }
    });
    console.log('@@@@@@@@@@@222222')
    console.log(totalCountByCompany)
    const companyScores: Record<string, number> = {};
  
    // 각 회사별로 점수를 계산합니다.
    consigneeList.forEach((item: any) => {
      const companyName = item.company_name;
      if (item.imp_check_data ) {
        const impCheckData = JSON.parse(item.imp_check_data); 
        const countY: number = impCheckData.filter((item:any) => item.result === "Y").length;  
        const totalCount: number = impCheckData.length || 1; 
        const score  = Math.floor((countY / totalCount) * 100);
        companyScores[companyName] = (companyScores[companyName] || 0) + score;
      }else{
        companyScores[companyName] = (companyScores[companyName] || 0) ;
      }
    });  
    const sortedCompanies: [string, number][] = Object.entries(companyScores)
      .sort((a, b) => b[1] - a[1]); // 점수를 기준으로 내림차순 정렬
  
    const combinedCompanies: [string, number][] = [
        ...sortedCompanies.slice(0, 5), // 상위 5개 항목 선택
        ...sortedCompanies.slice(-5) // 하위 5개 항목 선택
    ];
  
    // 결과 출력
    console.log("상위 5위 우수 및 하위 5위 수탁사:");
    console.log(combinedCompanies);
    // 수정된 결과를 set 함수를 사용하여 상태에 반영하도록 합니다.
    setCompanyScoresPercentage(combinedCompanies); 
    
    console.log(companyScores)
    //***************************888888888888888888888888*****************************/


  // 함수 호출하여 area별로 check_result가 U인 개수 출력 
  const firstCountByArea = consigneeList.reduce((acc:any, curr:any) => {
    if (curr.first_check_data) {
      const data = JSON.parse(curr.first_check_data);
      data.forEach((item: any) => {
        // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
       
        if (item.check_result === "Y" && item.area) {
          console.log(item.check_result); 
          acc[item.area] = (acc[item.area] || 0) + 1;
        }
      }); 
    }
    return acc;
  }, {} as Record<string, number>); // 초기값은 빈 객체로 설정 
  // 각 area별 N인 개수의 백분율을 계산하는 객체
  const firstScorePercentByArea: Record<string, number> = {};
  for (const [area] of Object.entries(firstCountByArea)) {
    // 해당 area에 대한 first_check_data의 총 개수를 계산
    const totalCountByArea = consigneeList.reduce((acc: number, curr: any) => {
      if (curr.first_check_data) {
        const data = JSON.parse(curr.first_check_data);
        const areaCount = data.filter((item: any) => item.area === area).length;
        acc += areaCount;
      }
      return acc;
    }, 0);
    
    // 해당 area에 대한 N의 백분율을 계산하여 저장
    firstScorePercentByArea[area] = Math.floor((firstCountByArea[area] * 100) / totalCountByArea);
  }
  setFirstScoreByArea(firstScorePercentByArea) 
/////////////****************//////////// */

// 각 area별로 N인 개수를 카운트하는 객체
const impCountByArea = consigneeList.reduce((acc: any, curr: any) => {
  if (curr.imp_check_data) {
    const data = JSON.parse(curr.imp_check_data);
    data.forEach((item: any) => {
      // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
      if (item.check_result === "Y" && item.area) {
        acc[item.area] = (acc[item.area] || 0) + 1;
      }
    });
  }
  return acc;
}, {} as Record<string, number>);

// 각 area별 N인 개수의 백분율을 계산하는 객체
const impScorePercentByArea: Record<string, number> = {};
for (const [area] of Object.entries(impCountByArea)) {
  // 해당 area에 대한 first_check_data의 총 개수를 계산
  const totalCountByArea = consigneeList.reduce((acc: number, curr: any) => {
    if (curr.imp_check_data) {
      const data = JSON.parse(curr.imp_check_data);
      const areaCount = data.filter((item: any) => item.area === area).length;
      acc += areaCount;
    }
    return acc;
  }, 0);
  
  // 해당 area에 대한 N의 백분율을 계산하여 저장
  impScorePercentByArea[area] = Math.floor((impCountByArea[area] * 100) / totalCountByArea);
  }  
  setImpScoreByArea(impScorePercentByArea)
  

  // 각 domain별로 N인 개수를 카운트하는 객체
  const countCheckResultNByDomain = consigneeList.reduce((acc: any, curr: any) => {
    if (curr.imp_check_data) {
      const data = JSON.parse(curr.imp_check_data);
      data.forEach((item: any) => {
        // 현재 요소의 domain을 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
        if (item.check_result === "Y" && item.domain) {
          acc[item.domain] = (acc[item.domain] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // 각 domain별 N인 개수의 백분율을 계산하는 객체
  const countResultNByDomain: Record<string, number> = {};
  for (const [domain] of Object.entries(countCheckResultNByDomain)) {
    // 해당 domain에 대한 first_check_data의 총 개수를 계산
    const totalCountByDomain = consigneeList.reduce((acc: number, curr: any) => {
      if (curr.imp_check_data) {
        const data = JSON.parse(curr.imp_check_data);
        const domainCount = data.filter((item: any) => item.domain === domain).length;
        acc += domainCount;
      }
      return acc;
    }, 0);
    
    // 해당 domain에 대한 N의 백분율을 계산하여 저장
    countResultNByDomain[domain] = Math.floor((countCheckResultNByDomain[domain] * 100) / totalCountByDomain);
  }

  // 각 domain별로 Y인 개수를 카운트하는 객체
  const countCheckResultYByDomain = consigneeList.reduce((acc: any, curr: any) => {
    if (curr.first_check_data) {
      const data = JSON.parse(curr.first_check_data);
      data.forEach((item: any) => {
        // 현재 요소의 domain을 키로 사용하여 그룹화하고, check_result가 Y인 경우 카운트 증가
        if (item.check_result === "Y" && item.domain) {
          acc[item.domain] = (acc[item.domain] || 0) + 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // 각 domain별 Y인 개수의 백분율을 계산하는 객체
  const countResultYByDomain: Record<string, number> = {};
  for (const [domain] of Object.entries(countCheckResultYByDomain)) {
    // 해당 domain에 대한 first_check_data의 총 개수를 계산
    const totalCountByDomain = consigneeList.reduce((acc: number, curr: any) => {
      if (curr.first_check_data) {
        const data = JSON.parse(curr.first_check_data);
        const domainCount = data.filter((item: any) => item.domain === domain).length;
        acc += domainCount;
      }
      return acc;
    }, 0);
    
    // 해당 domain에 대한 Y의 백분율을 계산하여 저장
    countResultYByDomain[domain] = Math.floor((countCheckResultYByDomain[domain] * 100) / totalCountByDomain);
  }

  // 수정된 결과를 set 함수를 사용하여 상태에 반영하도록 합니다.
  setImpScoreByDomain(countResultNByDomain);
  setFirstScoreByDomain(countResultYByDomain);





  const totalCountByWorkName: Record<string, number> = {};

// 각 work_name별로 프로젝트 개수를 계산합니다.
consigneeList.forEach((item: any) => {
  const workName = item.work_name;
  if (item.imp_check_data) {
    const data = JSON.parse(item.imp_check_data);
    const countY: number = data.filter((item:any) => item.result === "Y").length;  
    const totalCount: number = data.length || 1; 
    const score  = Math.floor((countY / totalCount) * 100);
    totalCountByWorkName[workName] = (totalCountByWorkName[workName] || 0) + score;
  } else {
    totalCountByWorkName[workName] = (totalCountByWorkName[workName] || 0);
  }
}); 

// 수정된 결과를 set 함수를 사용하여 상태에 반영하도록 합니다.
setWorkNameScoresPercentage(totalCountByWorkName);

 



// 각 status.annualPersonalInformation별로 N인 개수를 카운트하는 객체
const countCheckResultNByStatus: Record<string, number> = consigneeList.reduce((acc: any, curr: any) => {
  if (curr.imp_check_data) {
    const data = JSON.parse(curr.imp_check_data);
    data.forEach((item: any) => {
      // 현재 요소의 status.annualPersonalInformation를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
      if (item.check_result === "Y" && item.status) {
        const status = JSON.parse(item.status).annualPersonalInformationdms;
        acc[status] = (acc[status] || 0) + 1;
      }
    });
  }
  return acc;
}, {} as Record<string, number>);

// 각 status.annualPersonalInformation별 N인 개수의 백분율을 계산하는 객체
const countResultNByStatus: Record<string, number> = {};
for (const [status, count] of Object.entries(countCheckResultNByStatus)) {
  // 해당 status.annualPersonalInformation에 대한 imp_check_data의 총 개수를 계산
  const totalCountByStatus = consigneeList.reduce((acc: number, curr: any) => {
    if (curr.imp_check_data) {
      const data = JSON.parse(curr.imp_check_data);
      const statusCount = data.filter((item: any) => {
        const itemStatus = JSON.parse(item.status).annualPersonalInformationdms;
        return itemStatus === status;
      }).length;
      acc += statusCount;
    }
    return acc;
  }, 0);
  
  // 해당 status.annualPersonalInformation에 대한 N의 백분율을 계산하여 저장
  countResultNByStatus[status] = Math.floor((count * 100) / totalCountByStatus);
}

// 수정된 결과를 set 함수를 사용하여 상태에 반영하도록 합니다.
setCountNByStatus(countResultNByStatus);
console.log("status.annualPersonalInformation별로 check_result가 N인 개수:", countResultNByStatus);



//전년도 대비 점검 영역별 점수 추이
    const countCheckResultYByAnnualArea = consigneeList.reduce((acc:any, curr:any) => {
      if (curr.imp_check_data) {
        const data = JSON.parse(curr.imp_check_data);
        data.forEach((item: any) => {
          // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
          if (item.result === "Y" && item.area) {
            acc[item.area] = (acc[item.area] || 0) + 1;
          }
        }); 
      }
      return acc;
    }, {} as Record<string, number>); // 초기값은 빈 객체로 설정 
    // 각 area별 N인 개수의 백분율을 계산하는 객체
    const countResultYByAnnualArea: Record<string, number> = {};
    for (const [area] of Object.entries(countCheckResultYByAnnualArea)) {
      // 해당 area에 대한 imp_check_data 총 개수를 계산
      const totalCountByArea = consigneeList.reduce((acc: number, curr: any) => {
        if (curr.imp_check_data) {
          const data = JSON.parse(curr.imp_check_data);
          const areaCount = data.filter((item: any) => item.area === area).length;
          acc += areaCount;
        }
        return acc;
      }, 0);
      
      // 해당 area에 대한 N의 백분율을 계산하여 저장
      countResultYByAnnualArea[area] = Math.floor((countCheckResultYByAnnualArea[area] * 100) / totalCountByArea);
    }
    setCountYByAnnualArea(countResultYByAnnualArea) 
    //.. 2024년도
    const countCheckResultNByAnnualArea = consigneeList.reduce((acc:any, curr:any) => {
      if (curr.imp_check_data) {
        const data = JSON.parse(curr.imp_check_data);
        data.forEach((item: any) => {
          // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
          if (item.result === "Y" && item.area) {
            acc[item.area] = (acc[item.area] || 0) + 1;
          }
        }); 
      }
      return acc;
    }, {} as Record<string, number>); // 초기값은 빈 객체로 설정 
    // 각 area별 N인 개수의 백분율을 계산하는 객체
    const countResultNByAnnualArea: Record<string, number> = {};
    for (const [area] of Object.entries(countCheckResultNByAnnualArea)) {
      // 해당 area에 대한 imp_check_data 총 개수를 계산
      const totalCountByArea = consigneeList.reduce((acc: number, curr: any) => {
        if (curr.imp_check_data) {
          const data = JSON.parse(curr.imp_check_data);
          const areaCount = data.filter((item: any) => item.area === area).length;
          acc += areaCount;
        }
        return acc;
      }, 0);
      
      // 해당 area에 대한 N의 백분율을 계산하여 저장
      countResultNByAnnualArea[area] = Math.floor((countCheckResultNByAnnualArea[area] * 100) / totalCountByArea);
    }
    setCountNByAnnualArea(countResultNByAnnualArea) 








    
    // // 각 area별로 N인 개수를 카운트하는 객체
    // const firstFailedItemByArea = consigneeList.reduce((acc: any, curr: any) => {
    //   if (curr.imp_check_data) {
    //     const data = JSON.parse(curr.imp_check_data);
    //     data.forEach((item: any) => {
    //       // 현재 요소의 area를 키로 사용하여 그룹화하고, check_result가 N인 경우 카운트 증가
    //       if (item.check_result === "Y" && item.area) {
    //         acc[item.area] = (acc[item.area] || 0) + 1;
    //       }
    //     });
    //   }
    //   return acc;
    // }, {} as Record<string, number>);

    // // 각 area별 N인 개수의 백분율을 계산하는 객체
    // const impScorePercentByArea: Record<string, number> = {};
    // for (const [area] of Object.entries(impCountByArea)) {
    //   // 해당 area에 대한 first_check_data의 총 개수를 계산
    //   const totalCountByArea = consigneeList.reduce((acc: number, curr: any) => {
    //     if (curr.imp_check_data) {
    //       const data = JSON.parse(curr.imp_check_data);
    //       const areaCount = data.filter((item: any) => item.area === area).length;
    //       acc += areaCount;
    //     }
    //     return acc;
    //   }, 0);
      
    //   // 해당 area에 대한 N의 백분율을 계산하여 저장
    //   impScorePercentByArea[area] = Math.floor((impCountByArea[area] * 100) / totalCountByArea);
    //   }  
    //   setImpScoreByArea(impScorePercentByArea)


  },[consigneeList])
  return (
    <PageContainer>
      <Grid container>
        <Grid xs={1}>
          <Box sx={{backgroundColor: '#7F7F7F', textAlign: 'center', borderRadius: 0, color: 'white'}}>
            이행점검 평균점수
          </Box>
          <Box sx={{backgroundColor: '#D9D9D9', textAlign: 'center', borderRadius: 0, borderColor: '#797979', border: 1, height: 'calc(20vh)', marginBottom: 1, alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
            <Typography sx={{color: 'red', fontSize: 20, marginRight: 1}}>77</Typography>
            <Typography sx={{fontSize: 20}}>점</Typography>
          </Box>
          {/* <Box sx={{backgroundColor: '#D9D9D9', textAlign: 'center', borderRadius: 0, borderColor: '#A5A5A5', border: 1, borderBottom: 0, height: 'calc(40vh)', alignItems: 'center', justifyContent: 'center', display: 'flex'}}>
          </Box> */}
        </Grid>
        <Grid xs={10} container>
          <Grid item xs={12} justifyContent={'center'} alignItems={'baseline'} display={'flex'} border={'1px solid black'} ml={1} mr={1} p={1} borderRadius={1}>
            <Typography>
                총 점검대상
            </Typography>
            <Typography sx={{color: '#4472C4', fontSize: 20, ml: '5px', fontWeight: 'bold'}}>
                {totalCount1+totalCount2}건
            </Typography>
            <Typography>
                중 최초점검 완료 
            </Typography>
            <Typography sx={{color: '#4472C4', fontSize: 20, ml: '5px', fontWeight: 'bold'}}>
                {totalCompCount1}건
            </Typography>
            <Typography>
                , 이행점검 완료
            </Typography>
            <Typography sx={{color: '#4472C4', fontSize: 20, ml: '5px', fontWeight: 'bold'}}>
                {totalCompCount2}건
            </Typography>
            <Typography>
                ,점검제외
            </Typography>
            <Typography sx={{color: 'red', fontSize: 20, ml: '5px', fontWeight: 'bold'}}>
                {exceptTotalCount}건
            </Typography>
            <Typography>
                (PG사
            </Typography>
            <Typography sx={{color: 'red', fontSize: 14, ml: '5px'}}>
                {exceptCount1}건
            </Typography>
            <Typography>
                /인증서 제출 
            </Typography>
            <Typography sx={{color: 'red', fontSize: 14, ml: '5px'}}>
            {exceptCount2}건
            </Typography>
            <Typography>
                /점검 거부
            </Typography>
            <Typography sx={{color: 'red', fontSize: 14, ml: '5px'}}>
            {exceptCount3}건
            </Typography>
            <Typography>
           )
            </Typography>
          </Grid>
          <Grid item xs={6} style={{padding:8}} width={16}> 
            <CheckStatus numberOfFailedCheck1={failedCheckCount1} numberOfFailedCheck2={failedCheckCount2} companyCount={companyCount}></CheckStatus>
          </Grid>
          
          <Grid item xs={6} style={{padding:8}}>
            <ConsigneeWidget scoresPercentage={companyScoresPercentage}  title={"평균 대비 우수/취약 수탁사 "}   ></ConsigneeWidget>
          </Grid>
          <Grid item xs={6} style={{padding:8}}>
            <InnerSystemEnable  systemUsageStatusCount1={systemUsageStatusCount1}  systemUsageStatusCount2={systemUsageStatusCount2}></InnerSystemEnable>
          </Grid>
          <Grid item xs={6} style={{padding:8}}>
            <RetrustStatus retrustCount1={retrustCount1} retrustCount2={retrustCount2}></RetrustStatus>
          </Grid>
          <Grid item xs={6} style={{padding:8}}>
            <RadialbarChart countYByArea={firstScoreByArea}  countNByArea={impScoreByArea} title={'최초/이행 영역별 평균 점수'}></RadialbarChart>
          </Grid>
          <Grid item xs={6} style={{padding:8}}> 
            <RadialbarChart countYByArea={firstScoreByDomain}  countNByArea={impScoreByDomain} title={'최초/이행 분야별 평균 점수'}></RadialbarChart>
          </Grid>
          <Grid item xs={5} style={{padding:8}}> 
            <ConsigneeWidget scoresPercentage={Object.entries(workNameScoresPercentage)}  title={'업종에 따른 평균 점수'} ></ConsigneeWidget>
          </Grid> 
          <Grid item xs={5} style={{padding:8}}> 
            <ConsigneeWidget scoresPercentage={Object.entries(countResultNByStatus)}  title={'개인정보 처리량에 따른 평균 점수'} ></ConsigneeWidget>
            <ConsigneeWidget scoresPercentage={Object.entries(countYByAnnualArea)}  title={'전년도 대비 점검 영역별 점수 추이'} ></ConsigneeWidget>
          </Grid> 
          <Grid item xs={4} lg={4}>
              <DashboardCard
                title="2024년도 미흡항목 Top5"
                action={
                  <Fab color="secondary" size="small" component={Link}  href="/noticelist">
                    <IconPlus width={24} />
                  </Fab>
                } 
              >
                <Box></Box>
                {/* <List style={{ display: 'block' }}>
                    {notice.map((note: any, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            <Box display={'flex'} justifyContent={'space-between'}>
                              <Typography variant="subtitle1" component="span" color="textPrimary" sx={{maxWidth:150}} >
                                {note.title}
                              </Typography>
                              <Typography variant="body2" component="span" color="textSecondary" style={{   marginLeft: 8 }}>
                                {note.create_by}
                              </Typography>
                            </Box>
                          } 
                        />
                      </ListItem>
                    ))}
                  </List> */}
              </DashboardCard>
            </Grid>
        </Grid>
        
      </Grid>
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
       
    </PageContainer>
  );
};
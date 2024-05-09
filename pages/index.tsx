import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/router';
import React from "react";
import {
  Typography,
  Box,
  Grid,
  LinearProgress, 
  Paper,
  Collapse,
  IconButton, 
  Divider,
  List,
  ListItem, 
  ListItemText,
  Fab,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Avatar,
} from '@mui/material';

import PageContainer from "../src/components/container/PageContainer";
  
import TopPerformers from "../src/components/dashboards/modern/TopPerformers";
import Welcome from "../src/layouts/full/shared/welcome/Welcome";  

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { blue, yellow } from '@mui/material/colors';
import AppCard from '@src/components/shared/AppCard';
import DashboardWidgetCard from '@src/components/shared/DashboardWidgetCard';
import DashboardCard from '@src/components/shared/DashboardCard';
import { IconPlus } from '@tabler/icons-react';
import { InquiryType } from '@src/types/apps/inquiry';
import ChildCard from '@src/components/shared/ChildCard';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';
import { NoticeType } from '@src/types/apps/notice';
import Link from '@src/components/shared/Link';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { Person, Send } from '@mui/icons-material';
interface StatusProps {
  label: string;
  count: number;
  bgcolor: string;
  onClick: () => void; // 클릭 시 실행될 함수
}
const StatusItem: React.FC<StatusProps> = ({ label, count, bgcolor, onClick }) => {
  return (
    <Grid container alignItems="center" style={{ backgroundColor: bgcolor }} onClick={onClick}>
      <Grid item xs={6} style={{ padding: 8 }}>
        <Typography variant="subtitle1">{label}</Typography>
      </Grid>
      <Divider
        orientation="vertical"
        flexItem
        sx={{
          borderColor: 'grey',
          borderWidth: 0.1,
          borderStyle: 'dashed'
        }}
      />
      <Grid item xs={5} style={{ padding: 8 }}>
        <Typography variant="h6" style={{ textAlign: 'right' }}>{`${count} 건`}</Typography>
      </Grid>
    </Grid>
  );
};





export default function MainPage() {
  const router = useRouter(); 
  const [isLoading, setLoading] = useState(true);
  const [inqs, setInqs] = React.useState<InquiryType[]>([]); 
  const [notice, setNotice] = React.useState<NoticeType[]>([]); 
  const [approveCount, setApproveCount] = useState(0);
  const [projects, setProjects] = useState([]); 
  const [admins, setAdmins] = useState([])
  const [admin, setAdmin] = useState(0) 
  const [project_id, setProject] = useState(1)

  const [totalCount, setTotalCount] = useState(0) //총개수
  const [totalCompCount1, setTotalCompCount1] = useState(0) //최초점검완료완료개수
  const [totalCompCount2, setTotalCompCount2] = useState(0) //이행점검완료완료개수
  const [issueCount1, setIssueCount1] = useState(0) 
  const [issueCount2, setIssueCount2] = useState(0) 
  const [delayCount1, setDelayCount1] = useState(0) 
  const [delayCount2, setDelayCount2] = useState(0) 
  const [exceptCount1, setExceptCount1] = useState(0) 
  const [exceptCount2, setExceptCount2] = useState(0) 
  const [prepareCount1, setPrepareCount1] = useState(0) 
  const [prepareCount2, setPrepareCount2] = useState(0) 
  const [checkingCount1, setCheckingCount1] = useState(0) 
  const [checkingCount2, setCheckingCount2] = useState(0) 
  const [completeCount1, setCompleteCount1] = useState(0) 
  const [completeCount2, setCompleteCount2] = useState(0) 

  const [issueDetail, setIssueDetail] = useState([]) 
  const [delayDetail, setDelayDetail] = useState([]) 
  const [checkingDetail, setCheckingDetail] = useState([]) 
  const [scheduleCheckDetail, setScheduleCheckDetail] = useState([]) 
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);
  const [projectDetail, setProjectDetail] = useState({
    id: 0,
    create_date: '',
    self_check_date: '',
    imp_check_date: '',
    delay: {
      create: [],
      self_check: [],
      imp_check: []
    },
    set: false,
  })
  const [selectConsignee, setSelectConsignee] = useState<any>();
  const [userData, setUserData] = React.useState({
    type: 0,
    user_id: 0,
    name: ''
  });

  const [issue_type, setIssueType] = React.useState(0);
  const [delay_type, setDelayType] = React.useState(0);
  const [checking_type, setCheckingType] = React.useState(0);
  const [schedule_type, setScheduleType] = React.useState(0);
  const [newMemo, setNewMemo] = React.useState('');
  const [selectedMemo, setSelectedMemo] = React.useState<any[]>([]); 



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
  const sendMemo = async ( ) => {
    if(!selectConsignee) return; 
    try {  
      const response1 = await axiosPost(`${API_URL}/memo_details/Register`, { 
        memo_id: selectConsignee.issue_id,
        author: selectConsignee.checker_name,
        text: newMemo
      });
      var response_issue = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: selectConsignee.id,  
        issue_date : new Date().toDateString()
      }); 
      if (response_issue.data.result === 'success') { 
        setNewMemo('');
        setDetailsDialogOpen(false);
      }  
    } catch (error) {
      // 오류 처리
    } 
  }
  
 
  useEffect(() => {
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str);
    setUserData(data)
    const type = data.type
    if (type == 1) {
      router.replace('/consignee_main')
    }
    fetchAdmins(); 
    fetchInqa();
   
    fetchNotices();
    fetchApproveCount();
    setLoading(false);

  }, []);
  useEffect(() => { 
    fetchDetail(); 
  }, [project_id]);
  const fetchAdmins = async() => {
    const response = await axiosPost(`${API_URL}/project/Users`,{});
    let data = response.data
    console.log(data)
    setAdmins(data.admin)
    if (data.admin.length > 0){
      console.log(data.admin[0].user_id)
      setAdmin(data.admin[0].user_id)
      fetchProjects(data.admin[0].user_id);
    } 
  }
  const fetchProjects = async(adm : number) => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      admin_id: adm
    });
    setProjects(response.data)
  }
  const fetchDetail = async() => {
    let response;
    // if (userData.type == 1) {
    //   response = await axiosPost(`${API_URL}/project/Detail`, {
    //     project_id: project_id,
    //     consignee_id: userData.user_id
    //   });  
    // }
    // else if (userData.type == 2) {
    //   response = await axiosPost(`${API_URL}/project/Detail`, {
    //     project_id: project_id, 
    //   }); 
    // }
    // else 
    
    {
      response = await axiosPost(`${API_URL}/project_detail/List`, {
        project_id: project_id,
        // admin_id: admin,
      }); 
    }

    let delay = response.data.delay

    if (delay)
      delay = JSON.parse(delay);
    else
      delay = {
        create: [],
        self_check: [],
        imp_check: []
      }

    setProjectDetail({...response.data, delay: delay, set: true})

    setTotalCount(response.data.length)
    
    setIssueCount1(response.data.filter((x:any) => x.state == 1 && x.issue_id != null ).length)//수정필요
    setIssueCount2(response.data.filter((x:any) => x.state == 2 && x.issue_id != null ).length)//수정필요
    setDelayCount1(response.data.filter((x:any) => x.state == 1 && x.delay != null).length)//수정필요
    setDelayCount2(response.data.filter((x:any) => x.state == 2 && x.delay != null).length)//수정필요
    setExceptCount1(response.data.filter((x:any) => x.state == 3).length)
    setExceptCount2(response.data.filter((x:any) => x.state == 3).length)
    setPrepareCount1(response.data.filter((x:any) => x.state == 1 && x.sub_state == 1 && x.issue_id == null ).length)
    setPrepareCount2(response.data.filter((x:any) => x.state == 2 && x.sub_state == 1 && x.issue_id == null ).length)
    setCheckingCount1(response.data.filter((x:any) => x.state == 1 && x.sub_state == 2 && x.issue_id == null ).length)
    setCheckingCount2(response.data.filter((x:any) => x.state == 2 && x.sub_state == 2 && x.issue_id == null ).length)
    setCompleteCount1(response.data.filter((x:any) => x.state == 1 && x.sub_state == 3 && x.issue_id == null ).length )
    setCompleteCount2(response.data.filter((x:any) => x.state == 2 && x.sub_state == 3 && x.issue_id == null ).length )

    setTotalCompCount1(response.data.filter((x:any) => x.state == 1 && x.sub_state == 3 && x.issue_id == null ).length + response.data.filter((x:any) => x.state == 3).length) 
    setTotalCompCount2(response.data.filter((x:any) => x.state == 2 && x.sub_state == 3 && x.issue_id == null ).length + response.data.filter((x:any) => x.state == 3).length)

    setIssueDetail( response.data.filter((x:any) => x.issue_id != "") ) 
    console.log( response.data.filter((x:any) => x.issue_id != "") )
    // setDelayDetail(  )
    setCheckingDetail(response.data.filter((x:any) => (x.state == 1 && x.sub_state == 3) || (x.state == 2 && x.sub_state == 3)))
    setScheduleCheckDetail(response.data.filter((x:any) => x.state < 3 && x.sub_state < 3))  
  }

  const fetchApproveCount = async() => {
    const response = await axiosPost(`${API_URL}/user/ApprovalList`,{});
    setApproveCount(response.data.filter((x:any) => x.approval == 0).length);
  }
  const fetchInqa = async () => { 
    try {
      const response = await axiosPost(`${API_URL}/inquiry/List`,{});
      if (response.status === 200) {
        // Handle successful response (status code 200)
        const { data } = response;
        // Assuming the data structure matches the Model for success
        // You can access individual fields like data.id, data.title, etc.
        
        setInqs(data.slice(0, Math.min(2, data.length)  )); 
      } else if (response.status === 400) {
        // Handle failed response (status code 400)
        const { result, reason, error_message } = response.data;
        // You can use the error information to display an appropriate message
        console.error(`API request failed: ${reason} - ${error_message}`);
      }
    } catch (error:any) {
      // Handle any other errors (e.g., network issues, invalid URL, etc.)
      console.error('Error fetching data from API:', error.message);
    }
  };
  const fetchProjectsByConsignee = async (id:any, notices:any) => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      consignee_id: id, 
    }); 
    const projects = response.data;   
    const noticeFilter = notices.filter((x:any) => projects.some((project:any) => project.project_id === x.project_id || '전체' === x.project_name));
    console.log(noticeFilter) 
    setNotice(noticeFilter.slice(0, Math.min(2, noticeFilter.length)  ));  
  };
  const fetchProjectsByConsignor = async (id:any, notices:any) => { 
    const response = await axiosPost(`${API_URL}/project/List`, { 
      consignor_id: id
    }); 
    const projects = response.data;   
    const noticeFilter = notices.filter((x:any) => projects.some((project:any) => project.project_id === x.project_id || '전체' === x.project_name));
    setNotice(noticeFilter.slice(0, Math.min(2, noticeFilter.length)  ));  
  };
  const fetchNotices = async() => {
    const response = await axiosPost(`${API_URL}/notice/List` ,{});
    
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str); 
    if (data.type == 1) {
      fetchProjectsByConsignee(data.user_id, response.data)
    } else if (data.type == 2 ) {
      fetchProjectsByConsignor(data.user_id, response.data)
    } else{ 
      setNotice(response.data.slice(0, Math.min(2, response.data.length)  ));   
    }
  }

  const IssueCard = () => {
   
    const [open, setOpen] = React.useState(true);
    return (
      <Paper
        elevation={3}
        sx={{
          maxWidth: 300,  
          borderRadius: '16px', // 라운드 외곽선 반경 설정
          overflow: 'hidden', // 자식 요소가 반경을 넘어가지 않도록 설정
          border: '1px solid #aaaaaa', // 외곽선 색상과 두께 설정
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            이슈사항
          </Typography>
          <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
            {issueDetail.length} 건
          </Typography>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </div>
        <Divider /> 
          <Collapse in={open} timeout="auto" unmountOnExit> 
          <StatusItem label="계약종료 확인필요" count={issueDetail.filter((x:any) => x.issue_type == 0).length} bgcolor= {issue_type==0? "lightblue": "lightgrey"}  onClick={() => setIssueType(0)} />
          <Divider  flexItem />
          <StatusItem label="담당자 연락불가" count={issueDetail.filter((x:any) => x.issue_type == 1).length}  bgcolor={issue_type==1? "lightblue": "lightgrey"} onClick={() => setIssueType(1)}/>
          <Divider  flexItem />
          <StatusItem label="점검거부" count={issueDetail.filter((x:any) => x.issue_type == 2).length}  bgcolor={issue_type==2? "lightblue": "lightgrey"}  onClick={() => setIssueType(2)}/>
          <Divider  flexItem />
          <StatusItem label="기타" count={issueDetail.filter((x:any) => x.issue_type == 3).length}  bgcolor={issue_type==3? "lightblue": "lightgrey"}  onClick={() => setIssueType(3)}/>
          <Typography variant="h6" sx={{mt:1}}>
            총 {issueDetail.filter((x:any) => x.issue_type == issue_type).length} 건
          </Typography>
          <List >
            {issueDetail.filter((x:any) => x.issue_type == issue_type).map((item, index) => (
              <ListItem key={index} button onClick={ async()=>{
               
                const response = await axiosPost(`${API_URL}/memo_details/List`,{memo_id : item.issue_id});
                setSelectedMemo(response.data); 
                setSelectConsignee(item);
                setDetailsDialogOpen(true);
              }}> 
                <ListItemText primary={item.company_name} secondary={item.create_date} /> 
                <Typography color="error" variant="caption" style={{ marginLeft: 'auto' }}>
                  { item.issue_date==new Date().toDateString() ? '!New' : ''}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Collapse> 
      </Paper>
    );
  };
  
const DelayCard: React.FC<{ delayCount1: number, delayCount2: number }> = ({ delayCount1, delayCount2 }) => {
  
  const [open, setOpen] = React.useState(true);
  
  return (
    <Paper
      elevation={3}
      sx={{
        maxWidth: 300,  
        borderRadius: '16px', // 라운드 외곽선 반경 설정
        overflow: 'hidden', // 자식 요소가 반경을 넘어가지 않도록 설정
        border: '1px solid #aaaaaa', // 외곽선 색상과 두께 설정
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
          지연
        </Typography>
        <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
          {delayCount1+delayCount2} 건
        </Typography>
        <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </div>
      <Divider /> 
        <Collapse in={open} timeout="auto" unmountOnExit> 
        <StatusItem label="계정 미생성" count={0} bgcolor={delay_type==0? "lightblue": "lightgrey"}  onClick={() => setDelayType(0)} />
        <Divider  flexItem />
        <StatusItem label="자가점검 미제출" count={0} bgcolor={delay_type==1? "lightblue": "lightgrey"}  onClick={() => setDelayType(1)} />
        <Divider  flexItem />
        <StatusItem label="보완자료 미제출" count={0} bgcolor={delay_type==2? "lightblue": "lightgrey"}  onClick={() => setDelayType(2)} />

        <Typography variant="h6" sx={{mt:1}}>
          총 0 건
        </Typography>
          <List>
            {/* {listItems.map((item, index) => (
              <CustomListItem key={index} {...item} />
            ))} */}
          </List>
      </Collapse> 
    </Paper>
  );
};



      const   CheckingCard: React.FC = () => {
        
        const [open, setOpen] = React.useState(true);
        return (
          <Paper
            elevation={3}
            sx={{
              maxWidth: 300,  
              borderRadius: '16px', // 라운드 외곽선 반경 설정
              overflow: 'hidden', // 자식 요소가 반경을 넘어가지 않도록 설정
              border: '1px solid #aaaaaa', // 외곽선 색상과 두께 설정
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
              <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                검수중
              </Typography>
              <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
              {checkingDetail.length} 건
              </Typography>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </div>
            <Divider /> 
              <Collapse in={open} timeout="auto" unmountOnExit> 
              <StatusItem label="최초 검수" count={checkingDetail.filter((x:any) => x.state == 1).length} bgcolor={checking_type==0? "lightblue": "lightgrey"}  onClick={() => setCheckingType(0)} />
              <Divider  flexItem />
              <StatusItem label="이행 검수" count={checkingDetail.filter((x:any) => x.state == 1).length} bgcolor={checking_type==1? "lightblue": "lightgrey"}  onClick={() => setCheckingType(1)} /> 

              <Typography variant="h6" sx={{mt:1}}>
                총 {checkingDetail.filter((x:any) => x.state == checking_type+1).length} 건
              </Typography>
              <List >
                  {checkingDetail.filter((x:any) => x.state == checking_type+1).map((item, index) => (
                    <ListItem key={index} button onClick={ async()=>{
                    
                      const response = await axiosPost(`${API_URL}/memo_details/List`,{memo_id : item.issue_id});
                      setSelectedMemo(response.data); 
                      setSelectConsignee(item);
                      setDetailsDialogOpen(true);
                    }}> 
                      <ListItemText primary={item.company_name} secondary={item.create_date} /> 
                      <Typography color="error" variant="caption" style={{ marginLeft: 'auto' }}>
                        { item.self_check_date==new Date().toDateString() ? '!New' : ''}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
            </Collapse> 
          </Paper>
        );
      }; 


      const ScheduleCheckCard: React.FC = () => {
      
        const [open, setOpen] = React.useState(true);
        return (
          <Paper
            elevation={3}
            sx={{
              maxWidth: 300,  
              borderRadius: '16px', // 라운드 외곽선 반경 설정
              overflow: 'hidden', // 자식 요소가 반경을 넘어가지 않도록 설정
              border: '1px solid #aaaaaa', // 외곽선 색상과 두께 설정
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: 8 }}>
              <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                일정 체크
              </Typography>
              <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
              {scheduleCheckDetail.length} 건
              </Typography>
              <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </div>
            <Divider /> 
              <Collapse in={open} timeout="auto" unmountOnExit> 
              <StatusItem label="현장 점검 일정 수립" count={scheduleCheckDetail.filter((x:any) => x.state == 1 &&  x.sub_state == 1).length} bgcolor={schedule_type==0? "lightblue": "lightgrey"}  onClick={() => setScheduleType(0)}/>
              <Divider  flexItem />
              <StatusItem label="계정생성" count={scheduleCheckDetail.filter((x:any) => x.state == 1 &&  x.sub_state == 2).length} bgcolor={schedule_type==1? "lightblue": "lightgrey"}  onClick={() => setScheduleType(1)}/>
              <Divider  flexItem />
              <StatusItem label="자가점검 제출" count={scheduleCheckDetail.filter((x:any) => x.state == 2 &&  x.sub_state == 1).length} bgcolor={schedule_type==2? "lightblue": "lightgrey"}  onClick={() => setScheduleType(2)}/>
              <Divider  flexItem />
              <StatusItem label="보완자료 제출" count={scheduleCheckDetail.filter((x:any) => x.state == 2 &&  x.sub_state == 2).length} bgcolor={schedule_type==3? "lightblue": "lightgrey"} onClick={() => setScheduleType(3)} />
              <Typography variant="h6" sx={{mt:1}}>
                총 {scheduleCheckDetail.filter((x:any) =>
                   schedule_type==0? x.state == 1 &&  x.sub_state == 1
                   : schedule_type==1? x.state == 1 &&  x.sub_state == 2
                   : schedule_type==2? x.state == 2 &&  x.sub_state == 1
                   :  x.state == 2 &&  x.sub_state == 2
                   ).length} 건
              </Typography>
              <List >
                  {scheduleCheckDetail.filter((x:any) =>
                   schedule_type==0? x.state == 1 &&  x.sub_state == 1
                   : schedule_type==1? x.state == 1 &&  x.sub_state == 2
                   : schedule_type==2? x.state == 2 &&  x.sub_state == 1
                   :  x.state == 2 &&  x.sub_state == 2
                   ).map((item, index) => (
                    <ListItem key={index} button onClick={ async()=>{ 
                      const response = await axiosPost(`${API_URL}/memo_details/List`,{memo_id : item.issue_id});
                      setSelectedMemo(response.data); 
                      setSelectConsignee(item);
                      let data = JSON.parse(item.status);  
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
                      setDetailsDialogOpen(true);
                    }}> 
                      <ListItemText primary={item.company_name} secondary={item.create_date} /> 
                      <Typography color="error" variant="caption" style={{ marginLeft: 'auto' }}>
                        { item.self_check_date==new Date().toDateString() ? '!New' : ''}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
            </Collapse> 
          </Paper>
        );
      };


      const TopCard: React.FC<{ bgcolor:any,title : any, count: number }> = ({ bgcolor,title,count }) => {
        return (<Grid item xs={12} sm={8} lg={4} >
          <Box bgcolor={bgcolor + ".light"} textAlign="center" padding={1}> 
              <Typography
                color={bgcolor + ".main"}
                variant="subtitle1"
                fontWeight={600}
              >
                {title}
              </Typography>
              <Typography
                color={bgcolor + ".main"}
                variant="h4"
                fontWeight={600}
              >
                {count}
              </Typography> 
          </Box>
        </Grid> );
      }
  return (
    <PageContainer>
      <Box>
      <Box display={'flex'} sx={{margin:1}} alignItems="center"> 
          <Typography sx={{mr:1}} >담당자 명</Typography>
          <CustomSelect
            id="account-type-select"
            sx={{mr:4}}
            value={admin} 
            onChange={(event:any) => {
              setAdmin(event.target.value);
              fetchProjects(event.target.value);
            }}
          >
            {admins.map((x, i) => {
                return (
                <MenuItem key={i} value={x.user_id}>{x.name}</MenuItem>
              );
            })
            }
          </CustomSelect>
        <Typography sx={{mr:1}} >프로젝트 명</Typography>
        <CustomSelect
          id="account-type-select"
          sx={{mr:2, width: 200}}
          value={project_id} 
          onChange={(event:any) => {
            console.log('hi')
            setProject(event.target.value)
          }}
        >
          {projects.map((x, i) => { 
            return (
              <MenuItem key={i} value={x.project_id}>{x.name}</MenuItem>
            );
          })}
        </CustomSelect> 
      </Box>
       
        <Grid container spacing={3}>
          {/* column */}
            <Grid item xs={6} lg={6}>    
            <Box display={'flex'} justifyContent={'space-between'}>
              <Typography variant="h5" component="span" color="textPrimary"  >
                최초 점검 완료   
                <span style={{ color: 'blue', marginLeft:20 }}>{totalCompCount1}</span>/{totalCount}
              </Typography>
              <Typography variant="h5" component="span" color="textSecondary" style={{ marginLeft: 8 }}>
                {totalCount === 0 ? 0 : (totalCompCount1 / totalCount) * 100}%
              </Typography>

            </Box> 
              <LinearProgress variant="determinate" value={totalCount == 0 ? 0 : (totalCompCount1 / totalCount)*100} sx={{ height: '50px', borderRadius: '10px', marginTop: '10px' }} />
              <Grid container spacing={2} mt={1}> 
                <TopCard  title={"이슈 사항"} count={issueCount1} bgcolor={"error"} />
                <TopCard  title={"지연"} count={delayCount1} bgcolor={"warning"} />
                <TopCard  title={"점검 제외"} count={exceptCount1} bgcolor={"secondary"} />
                <TopCard  title={"자가점검 제출 대기"} count={prepareCount1} bgcolor={"error"} />
                <TopCard  title={"검수 중"} count={checkingCount1} bgcolor={"success"} />
                <TopCard  title={"검수 완료"} count={completeCount1} bgcolor={"info"} />
              </Grid>
            </Grid>
            <Grid item xs={6} lg={6}>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Typography variant="h5" component="span" color="textPrimary">
                    이행 점검 완료  <span style={{ color: 'blue', marginLeft:20 }}>{totalCompCount2}</span>/{totalCount}
                  </Typography>
                  <Typography variant="h5" component="span" color="textSecondary" style={{   marginLeft: 8 }}>
                  {totalCount == 0 ? 0 : (totalCompCount2 / totalCount)*100}% 
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={totalCount == 0 ? 0 : (totalCompCount2 / totalCount)*100} sx={{ height: '50px', borderRadius: '10px', marginTop: '10px' }} />
     
                <Grid container spacing={2} mt={1}> 
                  <TopCard  title={"이슈 사항"} count={issueCount2} bgcolor={"error"} />
                  <TopCard  title={"지연"} count={delayCount2} bgcolor={"warning"} />
                  <TopCard  title={"점검 제외"} count={exceptCount2} bgcolor={"secondary"} />
                  <TopCard  title={"자가점검 제출 대기"} count={prepareCount2} bgcolor={"error"} />
                  <TopCard  title={"검수 중"} count={checkingCount2} bgcolor={"success"} />
                  <TopCard  title={"검수 완료"} count={completeCount2} bgcolor={"info"} />
                </Grid>
            </Grid>
            <Grid item xs={3} lg={3}   > 
              <IssueCard  />
            </Grid>
            <Grid item xs={3} lg={3}   > 
              <DelayCard delayCount1={delayCount1} delayCount2={delayCount2}/>
            </Grid>
            <Grid item xs={3} lg={3}   > 
              <CheckingCard/>
            </Grid>
            <Grid item xs={3} lg={3}   > 
              <ScheduleCheckCard/>
            </Grid>
        </Grid>
        <Box sx={{height:10}}></Box>
        <Grid container spacing={3}>
          {/* column */}
            <Grid item xs={4} lg={4}>
            <DashboardCard
                title="문의 내역"
                action={
                  <Fab color="secondary" size="small" component={Link}  href="/inquiry">
                    <IconPlus width={24} />
                  </Fab>
                } 
              >
                <List style={{ display: 'block' }}>
                    {inqs.map((inq: InquiryType, index) => (
                      <ListItem key={index}>
                        <ListItemText
                          primary={
                            <Box display={'flex'} justifyContent={'space-between'}>
                              <Typography variant="subtitle1" component="span" color="textPrimary" sx={{maxWidth:150}} >
                                {inq.title}
                              </Typography>
                              <Typography variant="body2" component="span" color="textSecondary" style={{   marginLeft: 8 }}>
                                {inq.created_date}
                              </Typography>
                            </Box>
                          } 
                        />
                      </ListItem>
                    ))}
                  </List>
              </DashboardCard> 
            </Grid>
            <Grid item xs={4} lg={4}>
              <DashboardCard
                title="공지사항"
                action={
                  <Fab color="secondary" size="small" component={Link}  href="/noticelist">
                    <IconPlus width={24} />
                  </Fab>
                } 
              >
                <List style={{ display: 'block' }}>
                    {notice.map((note: NoticeType, index) => (
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
                  </List>
              </DashboardCard>
            </Grid>
            <Grid item xs={2} lg={2}>
              <ChildCard
                title="회원가입요청" 
              >
                 <Typography display={'flex'} justifyContent={'center'} fontSize={30} underline={'always'} component={Link}  href="/account/account-accept">{approveCount}</Typography>
              </ChildCard>
            </Grid>
            <Grid item xs={2} lg={2}>
              <ChildCard
                title="주소변경">
                <Typography display={'flex'} justifyContent={'center'} fontSize={30} underline={'always'} component={Link}  href="/">{approveCount}</Typography>        
              </ChildCard>  
            </Grid>
        </Grid>  


        <Dialog  open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
              
              <DialogContent> 
              <Grid container spacing={2}>
                {/* 그리드 컨테이너를 사용하여 2행 2열의 그리드를 생성 */}
                <Box display={'flex'} >
                <Box>
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
                </Box>
                <Box m={1} >
                  <List style={{ display: 'block' }}>
                        {selectedMemo.map((item: any, index) => (
                          <ListItem key={index}>
                            <ListItemText
                              primary={
                                <Box display={'flex'} alignItems={'center'}> 
                                <Avatar sx={{mr:1}}>  <Person />   </Avatar> 
                                  <Typography variant="subtitle1" component="span" color="textPrimary" sx={{ textDecoration: 'underline' }}>
                                    {item.author}
                                  </Typography>
                                  <Typography variant="body2" component="span" color="textSecondary" style={{ textDecoration: 'underline' , marginLeft: 8 }}>
                                    {item.date}
                                  </Typography>
                                </Box>
                              }
                              secondary={<Typography variant="body1" component="span" color="textSecondary" style={{ marginLeft: 8 }}>
                              {item.text}
                            </Typography>}
                            />
                          </ListItem>
                        ))}
                      </List>
                      <TextField
                        label="메모 작성"
                        variant="outlined"
                        fullWidth
                        value={newMemo}
                        onChange={(e) => setNewMemo(e.target.value)}
                        margin="normal"
                        InputProps={{
                          endAdornment: (
                            <IconButton onClick={sendMemo} color="primary">
                              <Send/>
                            </IconButton>
                          )
                        }}
                      />   
                  </Box>
                  </Box>
              </Grid> 
                

              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
        <Welcome />
      </Box>
    </PageContainer>
  );
};


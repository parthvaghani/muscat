import { Grid, InputAdornment, Button, MenuItem, Divider, Typography, RadioGroup, FormControlLabel, Tabs, Tab, Autocomplete,  TextField, Dialog, DialogActions, DialogContent, DialogContentText,  DialogTitle } from '@mui/material';
import { useRouter } from 'next/router'; 
import React, { useEffect, useState } from 'react';
import CustomFormLabel from '@src/components/forms/theme-elements/CustomFormLabel';
import CustomTextField from '@src/components/forms/theme-elements/CustomTextField';
import CustomOutlinedInput from '@src/components/forms/theme-elements/CustomOutlinedInput';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import CustomRadio from '@src/components/forms/theme-elements/CustomRadio';
import { Paper,InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import AddIcon from '@mui/icons-material/Add';
import { Select,  InputLabel, FormControl, Chip,  Box } from '@mui/material';
import { API_URL } from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';

interface PrivacyItem {
  id: number;
  personal_category: string;
  description: string;
}

interface Props {
  project: any;
  setNoStatus: any;
}

const StatusLayout = ({project, setNoStatus}: Props) => {
  const [companyName, setCompanyName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');
  const [contractContent, setContractContent] = useState<string>('');
  const [contractStartDate, setContractStartDate] = useState<string>('');
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
  const fetchPrivacyItems = async () => {
    try {
      const response = await axiosPost(`${API_URL}/personal_info/List`, {
        project_id: project
      });
      if (response.status === 200) {
        let len = response.data.length
        let newItems = []
        
        let items = response.data
        for (let i = 0; i < len;) {
          let row_data = [];
          for (let j = 0; j < items[i].merged2; j++) {
            row_data.push({id: items[i+ j].id, name: items[i + j].item})
          }

          newItems.push({
            intermediate_grade: items[i].intermediate_grade,
            data: row_data
          })
          i += items[i].merged2
        }

        console.log(newItems)
        setPrivacyItems(newItems); 
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const [userData, setUserData] = useState({
    type: 0,
    user_id: 0,
    name: '',
    company_name: '',
    company_id: 0
  })

  const [userDetail, setUserDetail] = useState(null)

  const fetchUserDetail = async() => {
    let str = sessionStorage.getItem('user')
    let data = JSON.parse(str);
    setUserData(data)

    let response = await axiosPost(`${API_URL}/user/Detail`, {
      id: data.user_id
    })

    setUserDetail(response.data)

    str = sessionStorage.getItem('consignee_status')

    if (str) {
      let data = JSON.parse(str);

      setContractContent(data.contractContent)
      setContractStartDate(data.contractStartDate)
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
      setSelectedItems(data.selectedItems)
    }
  }

  useEffect(() => {
    fetchUserDetail();
    fetchPrivacyItems();
  }, []);

  useEffect(() => {
    if (project)
      fetchPrivacyItems();
  }, [project]);

  const handleDelete = (itemToDelete: PrivacyItem) => () => {
    setSelectedItems((items) => items.filter((item) => item.id !== itemToDelete.id));
  };

  const onItemClick = (id: any, name: any) => {
    if (selectedItems.findIndex((x) => x.id == id) == -1)
    {
      setSelectedItems([...selectedItems, {id: id, name: name}]);  
    }
    else {
      setSelectedItems((items) => items.filter((item) => item.id !== id));
    }

  }

  const router = useRouter();
  const handleModify = () => {
    let data = {
      contractContent: contractContent,
      contractStartDate: contractStartDate,
      contractEndDate: contractEndDate,
      representativeIndustry: representativeIndustry,
      totalEmployees: totalEmployees,
      annualPersonalInformation: annualPersonalInformation,
      yearlyPrivacyHandle: yearlyPrivacyHandle,
      systemUsageStatus: systemUsageStatus,
      retrustStatus: retrustStatus,
      thirdPartyStatus: thirdPartyStatus,
      systemUsageStatusText: systemUsageStatusText,
      retrustStatusText: retrustStatusText,
      thirdPartyStatusText: thirdPartyStatusText,
      selectedItems: selectedItems
    }

    sessionStorage.setItem('consignee_status', JSON.stringify(data))
    router.push('account/account-my')
  }

  const handleSubmit = async() => {
    console.log(contractContent)
    console.log(contractStartDate)
    console.log(contractEndDate)
    console.log(representativeIndustry)
    console.log(totalEmployees)
    console.log(annualPersonalInformation)
    if (
      contractContent &&
      contractStartDate && contractEndDate && representativeIndustry &&
      totalEmployees && annualPersonalInformation
    ) {
      let data = {
        companyName: userDetail.company_name,
        registerNum: userDetail.register_num,
        address: userDetail.company_address,
        managerName: userDetail.manager_name,
        managerPhoen: userDetail.manager_phone,
        contractContent: contractContent,
        contractStartDate: contractStartDate,
        contractEndDate: contractEndDate,
        representativeIndustry: representativeIndustry,
        totalEmployees: totalEmployees,
        annualPersonalInformation: annualPersonalInformation,
        yearlyPrivacyHandle: yearlyPrivacyHandle,
        systemUsageStatus: systemUsageStatus,
        retrustStatus: retrustStatus,
        thirdPartyStatus: thirdPartyStatus,
        systemUsageStatusText: systemUsageStatusText,
        retrustStatusText: retrustStatusText,
        thirdPartyStatusText: thirdPartyStatusText,
        selectedItems: selectedItems
      }

      const response = await axiosPost(`${API_URL}/project_detail/SetStatus`, {
        project_id: project,
        company_id: userData.company_id,
        status: JSON.stringify(data)
      });

      let dd = response.data.data;
      let ii = response.data.id;
      if (response.data.result == 'SUCCESS') {
        
        sessionStorage.setItem('consignee_status', '')
        setModalMsg1('정확히 저장되었습니다.')
        setShowModal1(true)

        let aa: { id: any; self_check_result: string; attachment: string; attachment_name: string; check_result: string; additional: string; modify_time: string; result: string; lock: string; current_status: string; modify_request: string; check_suggestion: string; }[] = [];

        dd.map((x: any) => {
          aa.push({
            id: x.id,
            self_check_result: 'N',
            attachment: 'N',
            attachment_name: '',
            check_result: 'N',
            additional: 'N',
            modify_time: "",
            result: 'N',
            lock: 'X',
            current_status: '',
            modify_request: '',
            check_suggestion: ''
          })
        });

        const response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: ii,
          first_check_consignee_temp_data: JSON.stringify(aa)
        });
      }
      else {
        setModalMsg1('저장이 실패하였습니다.\n' + response.data.error_message)
        setShowModal1(true)
      }
    } else {
      setModalMsg1('필요한 정보를 모두 입력하십시요.')
      setShowModal1(true)
    }
  };

  const onAdd = () => {
    setShowModal(true)
  }

  const [showModal, setShowModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')
  const onClose = () => {
    setShowModal(false)
  }

  const [showModal1, setShowModal1] = React.useState(false)
  const [modalMsg1, setModalMsg1] = React.useState('')
  const onClose1 = () => {
    setShowModal1(false)
    if (modalMsg1 == '정확히 저장되었습니다.')
      setNoStatus(false)
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="contained" sx={{ mr: 2 }} onClick={handleModify}>
            수정
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            저장
          </Button>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            업체명*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <InputLabel>{userDetail?.company_name}</InputLabel>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            사업자 등록번호*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <InputLabel>{userDetail?.register_num}</InputLabel>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
        <CustomFormLabel sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            주소*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <InputLabel>{userDetail?.company_address}</InputLabel>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-message" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            계약내용*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={8}>
          <CustomTextField
            id="bl-message"
            placeholder=" "
            multiline
            fullWidth
            value={contractContent}
            onChange={(e:any) => setContractContent(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="fs-date" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            계약기간
          </CustomFormLabel>
        </Grid>
        <Grid item xs={3} sm={3}>
          <CustomTextField
            type="date"
            id="fs-date"
            sx={{width:200}}
            value={contractStartDate}
            onChange={(e:any) => setContractStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={3} sm={5}>
          <CustomTextField
            type="date"
            id="fs-date" 
            sx={{width:200}}
            value={contractEndDate}
            onChange={(e:any) => setContractEndDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-work" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            대표 업종*
          </CustomFormLabel>
        </Grid>
        <Grid item sm={9}>
          <CustomOutlinedInput
            id="bl-work"
             sx={{width:200}}
            value={representativeIndustry}
            onChange={(e:any) => setRepresentativeIndustry(e.target.value)}
          />
        </Grid>
        <Grid item sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-people" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            전체 직원 수*
          </CustomFormLabel>
        </Grid>
        <Grid item sm={9}>
          <CustomOutlinedInput
            id="bl-people"
            sx={{width:200}}
            value={totalEmployees}
            onChange={(e:any) => setTotalEmployees(e.target.value)}
            startAdornment={<InputAdornment position="start">총</InputAdornment>}
            endAdornment={<InputAdornment position="end">명</InputAdornment>}
            inputProps={{ style: { textAlign: 'end' } }} 
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-priv" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            개인정보취급자 수*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <CustomOutlinedInput
            id="bl-priv"
            sx={{width:200}}
            value={privacyHandlers}
            onChange={(e:any) => setPrivacyHandlers(e.target.value)}
            endAdornment={<InputAdornment position="end">명</InputAdornment>}
            inputProps={{ style: { textAlign: 'end' } }} 
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="start">
          <CustomFormLabel htmlFor="privacy-item-select-label" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            연간 개인정보 처리량*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <RadioGroup row name="delivery-opt" value={annualPersonalInformation} onChange={(event) => setAnnualPersonalInformation(event.target.value)}>
            <FormControlLabel value="<1000" control={<CustomRadio />} label="1천명 이하" />
            <FormControlLabel value=">1000" control={<CustomRadio />} label="1천명 이상" />
            <FormControlLabel value=">10000" control={<CustomRadio />} label="1만명 이상" />
            <FormControlLabel value=">50000" control={<CustomRadio />} label="5만명 이상" />
            <FormControlLabel value=">100000" control={<CustomRadio />} label="10만명 이상" />
            <FormControlLabel value=">1000000" control={<CustomRadio />} label="100만명 이상" />
          </RadioGroup>
          <CustomOutlinedInput
            id="bl-priv"
            sx={{width:200}}
            value={yearlyPrivacyHandle}
            onChange={(e:any) => setYearlyPrivacyHandle(e.target.value)}
            startAdornment={<InputAdornment position="start">연간</InputAdornment>}
            endAdornment={<InputAdornment position="end">명</InputAdornment>}
            inputProps={{ style: { textAlign: 'end' } }} 
          />
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="start">
          <CustomFormLabel htmlFor="privacy-item-select-label" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            개인정보취급 항목*
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Button size={"small"} sx={{width: 40, height: 45, p:0, alignItems: 'center', justifyContent: 'center'}} onClick={onAdd}>
            <AddIcon/>
          </Button>
          
          <Box mt={1}>
            {selectedItems.map((item, index) => (
              <Chip
                key={item.id}
                sx={{ml:1, mb:1}}
                label={item.name}
                onDelete={handleDelete(item)}
              />
            ))} 
          </Box>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-inner" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            자체처리시스템 사용 현황
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9} display="flex" alignItems="center" justifyContent="start">
          <RadioGroup row name="system-opt" value={systemUsageStatus} onChange={(event) => setSystemUsageStatus(event.target.value)}>
            <FormControlLabel value="no" control={<CustomRadio />} label="미사용" />
            <FormControlLabel value="yes" control={<CustomRadio />} label="사용" />
          </RadioGroup>
          {systemUsageStatus === 'yes' && (
            <CustomTextField id="bl-inner" placeholder="시스템 명" sx={{width:600}} value={systemUsageStatusText} onChange={(e:any) => setSystemUsageStatusText(e.target.value)}/>
          )}
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-re" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            재위탁 현황
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9} display="flex" alignItems="center" justifyContent="start">
          <RadioGroup row name="reconsign-opt" value={retrustStatus} onChange={(event) => setRetrustStatus(event.target.value)}>
            <FormControlLabel value="no" control={<CustomRadio />} label="미사용" />
            <FormControlLabel value="yes" control={<CustomRadio />} label="사용" />
          </RadioGroup>
          {retrustStatus === 'yes' && (
            <CustomTextField id="bl-re" sx={{width:600}} placeholder="재위탁사 명(위탁업무)"  value={retrustStatusText} onChange={(e:any) => setRetrustStatusText(e.target.value)}/>
          )}
          
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-thid" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            제3자제공 현황
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9} display="flex" alignItems="center" justifyContent="start">
          <RadioGroup row name="thirdparty-opt" value={thirdPartyStatus} onChange={(event) => setThirdPartyStatus(event.target.value)}>
            <FormControlLabel value="no" control={<CustomRadio />} label="미사용" />
            <FormControlLabel value="yes" control={<CustomRadio />} label="사용" />
          </RadioGroup>
          {thirdPartyStatus === 'yes' && (
            <CustomTextField id="bl-thid" placeholder="제3자제공 업체 명(제공내역)" sx={{width:600}}  value={thirdPartyStatusText} onChange={(e:any) => setThirdPartyStatusText(e.target.value)}/>
          )}
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ mx: '-24px' }} />
          <Typography variant="h6" mt={2}>
            수탁사 담당자 정보
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-name" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            담당자명
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
          <InputLabel>{userDetail?.manager_name}</InputLabel>
        </Grid>
        <Grid item xs={12} sm={3} display="flex" alignItems="center">
          <CustomFormLabel htmlFor="bl-phone" sx={{ mt: 0, mb: { xs: '-10px', sm: 0 } }}>
            담당자 연락처
          </CustomFormLabel>
        </Grid>
        <Grid item xs={12} sm={9}>
        <InputLabel>{userDetail?.manager_phone}</InputLabel>
        </Grid>
      </Grid>
      <Dialog open={showModal} onClose={onClose} BackdropProps={{ style: { backgroundColor: "transparent" } }}
      >
        <DialogTitle>개인정보 취급 항목</DialogTitle>
        <DialogContent sx={{width:450}} >
          <>
            <DialogContentText sx={{wordWrap:'break-word', whiteSpace:'break-spaces', textAlign: 'center', fontSize: 19, mb:2}}>취급하는 개인정보 항목을 클릭해주세요.</DialogContentText>
            {privacyItems.map((x, i) => {
              return (
                <Grid container spacing={0} key={i}>
                  <Grid item xs={6} sm={6} display="flex" alignItems="center" sx={{border: 1, borderTop: i ? 0: 1}}>
                    {x.intermediate_grade}
                  </Grid>
                  <Grid item xs={6} sm={6} display="flex-wrap" alignItems="center" sx={{border: 1, borderLeft: 0, borderTop: i ? 0: 1}}>
                    {x.data.map((a: any, ind: any) => {
                      let selected = (selectedItems.findIndex((b) => b.id == a.id) != -1)
                      return (
                        <Typography key={ind} onClick={() => {onItemClick(a.id, a.name)}} sx={{color: selected ? 'blue' : 'black'}}>
                          {a.name}
                        </Typography>
                      )
                    })}
                    
                  </Grid>
                </Grid>
              );
            })}
          </>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { onClose(); }}>OK</Button>
        </DialogActions>
      </Dialog> 

      <Dialog open={showModal1} onClose={onClose1}>
          <DialogTitle></DialogTitle>
          <DialogContent sx={{width:300}} >
            <DialogContentText sx={{wordWrap:'break-word', whiteSpace:'break-spaces', textAlign: 'center'}}>{modalMsg1}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { onClose1(); }}>OK</Button>
          </DialogActions>
        </Dialog> 
    </div>
  );
};

export default StatusLayout;
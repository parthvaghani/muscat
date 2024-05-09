import React, { useState } from 'react';
import dynamic from "next/dynamic";
import { Dialog,Input, DialogActions, DialogContent, DialogContentText,  DialogTitle, Typography, Box, Button, FormControlLabel, MenuItem, TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, TextareaAutosize, TextField, Checkbox, Grid, IconButton, InputLabel } from '@mui/material';
import {   Row, Table } from 'antd';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';
import Image from "next/image";
import DetailOn from "public/images/img/detail_on.png";
import DetailOff from "public/images/img/detail_off.png";
import LockOn from "public/images/img/lock_on.png";
import LockOff from "public/images/img/lock_off.png";
import { API_URL } from '@pages/constant';
import { Send } from '@mui/icons-material';
 
const CheckResult = ({consignor,  userType , consigneeData}:  { consignor: string,  userType: number , consigneeData : any;}) => { 
  const [checkAll, setCheckAll] = React.useState('Y'); 
  const [checkExcept, setCheckExcept] = React.useState(false);
  const [exceptType, setExceptType] = React.useState(0);
  const [exceptReason, setExceptReason] = React.useState('');
  const [showModal, setShowModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [checkDataArray, setCheckDataArray] = React.useState([]);
  const [attachment, setAttachment] = useState('');
  const [project_attachment, setProjectAttachment] = useState('');
  const [request_content, setRequestContent] = useState('');
  
  const exceptList = [{
    id: 1,
    name: 'PG사',
  }, {
    id: 2,
    name: '인증서 제출',
  }, {
    id: 3,
    name: '계약 종료',
  }, {
    id: 4,
    name: '점검 거부',
  }, {
    id: 5,
    name: '직접 입력',
  }]
  const [detailsDialogOpen, setDetailsDialogOpen] = React.useState(false);

  const handleFileChange = async(e:any, id:any) => {
    console.log('selectedFile.file')
    const selectedFile = e.target.files[0];
    console.log(selectedFile.name)
    // 파일 선택이 완료된 후 추가 작업 수행
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    e.target.value = null;
    fetch(`${API_URL}/checkinfo/Upload`, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then(data => {
      if (data.result == 'FAIL') {
        setModalMsg(data.reason);
        setShowModal(true)
        
      }
      else if (data.result == 'SUCCESS') {
        setModalMsg('정확히 업로드되었습니다.');
        setShowModal(true) 
        setAttachment(selectedFile.name);
        let newData: any[] = [];
        checkDataArray.map((x) => {
          if (x.id == id) {
            x.attachment = selectedFile.name  ;
          }
          newData.push(x)
        }) 
        setCheckDataArray(newData) 
      }
    })
    .catch(error => {
      console.error("Failed to register the notice:", error);
    });
  };

  const handleFileChange2 = async(e:any) => { 
    const selectedFile = e.target.files[0]; 
    // 파일 선택이 완료된 후 추가 작업 수행
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    e.target.value = null;
    fetch(`${API_URL}/project_detail/Upload`, {
      method: 'POST',
      body: formData
    })
    .then((response) => response.json())
    .then(data => {
      if (data.result == 'FAIL') {
        setModalMsg(data.reason);
        setShowModal(true) 
      }
      else if (data.result == 'SUCCESS') {
        setModalMsg('정확히 업로드되었습니다.');
        setShowModal(true) 
        setProjectAttachment(selectedFile.name); 
      }
    })
    .catch(error => {
      console.error("Failed to register the notice:", error);
    });
  };

  const onIssue = () => {
    setDetailsDialogOpen(true);
  }
  const onCheckAll = () =>{
    const updatedCheckDataArray = checkDataArray.map(item => ({
      ...item,
      self_check_result: checkAll,
      check_result: checkAll,
      additional: checkAll,
      result: checkAll,
    }));
    setCheckDataArray(updatedCheckDataArray);    
    
  }
  const onClose = () => {
    setShowModal(false)
  }
  const [checklistData, setChecklistData] = React.useState([]);

  // 각 체크박스의 초기 상태를 저장하는 상태 변수
  const [checkboxes, setCheckboxes] = useState<{
    [key: string]: boolean;
  }>({
    adminLogin: true,
    system: false,
    general: false,
    etc: false
  });

  // 체크박스의 상태를 변경하는 핸들러 함수
  const handleCheckboxChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    // 현재 선택된 옵션이면 해당 옵션을 해제하고 아니면 해당 옵션을 선택합니다.
    const isChecked = event.target.checked;
    setCheckboxes((prevCheckboxes) => ({
      ...{
        adminLogin: false,
        system: false,
        general: false,
        etc: false
      },
      [name]:true
    }));
  };
  

  // 체크박스 데이터 배열
  const checkboxesData = [
    { name: 'adminLogin', label: '계약종료 확인 필요' },
    { name: 'system', label: '담당자 연락 불가' },
    { name: 'general', label: '점검 거부' },
    { name: 'etc', label: '기타' }
  ];

  const [newMemo, setNewMemo] = React.useState('');
 
  const sendMemo = async () => { 
    try { 
      
      const checkedLabels = Object.keys(checkboxes)
      .filter(key => checkboxes[key]) // true로 설정된 항목만 필터링
      .map(key => checkboxesData.find(item => item.name === key)?.label); // 해당 항목의 label을 매핑
     
      const response = await axiosPost(`${API_URL}/memos/Register`, { 
        reason: checkedLabels[0],
        consignor_name: consignor,
        consignee_name: consigneeData.company_name,
        date: '',
      });
      const response1 = await axiosPost(`${API_URL}/memo_details/Register`, { 
        memo_id: response.data.id,
        author: consigneeData.checker_name,
        text: newMemo
      });
      var response_issue = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        issue_id: response.data.id  ,
        issue_type: Object.keys(checkboxes).filter(key => checkboxes[key])[0],
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
  

  const fetchChecklist = async( ) => {
    let response = await axiosPost(`${API_URL}/checkinfo/ListByProject`, {
      project_id: consigneeData.project_id
    }); 
     setChecklistData(response.data);
  }
  React.useEffect(() => {
    console.log(consigneeData)
    if (consigneeData.project_id)
      fetchChecklist(); 
  }, [consigneeData]);

  React.useEffect(() => {     
    if(userType == 1 && consigneeData.state == 1 && consigneeData.sub_state == 1){ //- 자가점검 중 :: 수탁사에만 해당
      let newData: any[] = []; 
      checklistData.map((x: any) => {
        let d = JSON.parse(consigneeData.first_check_consignee_temp_data).find((a:any) => a.id == x.id); 
        x = {...x, ...d};
        console.log(x)
        newData.push(x)
      })
      setCheckDataArray(newData);   
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 2 ){  //- 검수중  
      console.log(JSON.parse(consigneeData.first_check_data))
      setCheckDataArray(JSON.parse(consigneeData.first_check_data)); 
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 3 ){  //- 최초점검완료단계  
      if(userType != 1) {  
        setCheckDataArray(JSON.parse(consigneeData.first_check_admin_temp_data)); 
      } 
    }else if( consigneeData.state == 2 && consigneeData.sub_state == 1 ){  //- 보완자료요청, 이행점검대기단계 
      if(userType == 1) {  //수탁사인 경우
        setCheckDataArray(JSON.parse(consigneeData.imp_check_consignee_temp_data)); 
      }else{ //어드민인 경우
        setCheckDataArray(JSON.parse(consigneeData.imp_check_data)); 
      } 
    }else{
      setCheckDataArray(JSON.parse(consigneeData.imp_check_data)); 
    } 
  }, [checklistData]);
  const onDownload = () => {
    
      let newData: any[] = []; 
      checklistData.map((x: any) => {
        let d = checkDataArray.find((a:any) => a.id == x.id); 
        x = {...x, ...d};
        console.log(x)
        newData.push(x)
      })
      const json = JSON.stringify(newData);
      console.log(json);
      downloadFile(json, 'checklist_results.json', 'application/json');
  }
  function downloadFile(data: any, filename: string, type: string) {
    const blob = new Blob([data], { type: type });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  const onSave = async() => {   //임시저장
    const currentDate = new Date().toLocaleDateString();  
    checkDataArray.forEach(item => {
      item.modify_time = currentDate;  
    });
    var response ;
    if(checkExcept==true){ //점검제외
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        state: 3,
        except_type: exceptType,
        except_reason: exceptReason
      });
    }
    else if(consigneeData.state == 1 && consigneeData.sub_state == 1){ //- 자가점검 중 :: 수탁사에만 해당
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        request_content: request_content,
        project_attachment : project_attachment,
        first_check_consginee_temp_data: JSON.stringify(checkDataArray)
      });
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 2 ){  //- 검수중  
      if(userType == 1) {  //수탁사인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id,  
          request_content: request_content,
          project_attachment : project_attachment,
          first_check_consignee_temp_data: JSON.stringify(checkDataArray),
        });
      }else{ //어드민인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id,  
          request_content: request_content,
          project_attachment : project_attachment,
          first_check_admin_temp_data: JSON.stringify(checkDataArray),
        });
      } 
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 3 ){  //- 최초점검완료단계  
      if(userType != 1) {  
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id,  
          request_content: request_content,
          project_attachment : project_attachment,
          first_check_admin_temp_data: JSON.stringify(checkDataArray),
        });
      } 
    }else if( consigneeData.state == 2 && consigneeData.sub_state == 1 ){  //- 보완자료요청, 이행점검대기단계 
      if(userType == 1) {  //수탁사인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id,  
          request_content: request_content,
          project_attachment : project_attachment,
          imp_check_consignee_temp_data: JSON.stringify(checkDataArray),
        });
      }else{ //어드민인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id,  
          request_content: request_content,
          project_attachment : project_attachment,
          imp_check_data: JSON.stringify(checkDataArray),
        });
      } 
    }else{
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        request_content: request_content,
        project_attachment : project_attachment,
        imp_check_data: JSON.stringify(checkDataArray)
      });
    }
    
    
    if (response.data.result == 'SUCCESS') { 
      setModalMsg('정확히 저장되었습니다.')
      setShowModal(true)
    }
    else {
      setModalMsg(response.data.error_message)
      setShowModal(true)
    }  
    setCheckDataArray(checkDataArray);
  }
  const onRequest = async() => {   //보완요청
    const currentDate = new Date().toLocaleDateString();  
    checkDataArray.forEach(item => {
      item.modify_time = currentDate;  
    });
    var response ;
    if(checkExcept==true){ //점검제외
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        state: 3,
        except_type: exceptType,
        except_reason: exceptReason
      });
    }
    else if( consigneeData.state == 1 && consigneeData.sub_state == 2 ){  //- 검수중  
       //어드민인 경우
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id,  
        request_content: request_content,
        project_attachment : project_attachment,
        first_check_consignee_temp_data: JSON.stringify(checkDataArray),
        first_check_data: JSON.stringify(checkDataArray),
      }); 
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 3 ){  //- 최초점검완료단계  
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id,  
        request_content: request_content,
        project_attachment : project_attachment,
        imp_check_consignee_temp_data: JSON.stringify(checkDataArray),
        imp_check_data: JSON.stringify(checkDataArray),
      });
    }else if( consigneeData.state == 2 && consigneeData.sub_state == 1 ){  //- 보완자료요청, 이행점검대기단계 
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id,
        request_content: request_content,
        project_attachment : project_attachment,
        imp_check_consignee_temp_data: JSON.stringify(checkDataArray),
        imp_check_data: JSON.stringify(checkDataArray),
        turn:1,
      });
    }else{ 
    }
    
    
    if (response.data.result == 'SUCCESS') { 
      setModalMsg('정확히 저장되었습니다.')
      setShowModal(true)
    }
    else {
      setModalMsg(response.data.error_message)
      setShowModal(true)
    }  
    setCheckDataArray(checkDataArray);
  }
  const consigneeSubmit = async() => {
    const currentDate = new Date().toLocaleDateString();  
    checkDataArray.forEach(item => {
      item.modify_time = currentDate;  
    });
    var response ;
    if(checkExcept==true){ //점검제외
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        state: 3,
        except_type: exceptType,
        except_reason: exceptReason
      });
    }
    else if(consigneeData.state == 1 && consigneeData.sub_state == 1){ //- 자가점검 중 :: 수탁사에만 해당
      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        first_check_consginee_temp_data: JSON.stringify(checkDataArray),
        first_check_data: JSON.stringify(checkDataArray),
        turn:0, 
        state:1,
        sub_state: 2, 
        request_content: request_content,
        project_attachment : project_attachment,
      });  
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 2 ){  //- 검수중  
      let firstCheckScore = 0;
      checkDataArray.forEach((item: any) => {
        if (item.check_result === "Y") {
          firstCheckScore++;
        }
      }); 
      const totalItems = checkDataArray.length;
      firstCheckScore = (firstCheckScore / totalItems) * 100;
      let first_check_miss_count  = checkDataArray.filter((item: any) => item['check_result'] === 'N').length;

      if(userType == 1) {  //수탁사인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id, 
          first_check_admin_temp_data: JSON.stringify(checkDataArray),
          first_check_data: JSON.stringify(checkDataArray),
          turn:0, 
          state:1,
          sub_state: 3,
          first_check_score: firstCheckScore, 
          first_check_miss_count: first_check_miss_count,
          request_content: request_content,
          project_attachment : project_attachment,
        });
      }else{ //어드민인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id, 
          first_check_admin_temp_data: JSON.stringify(checkDataArray),
          first_check_data: JSON.stringify(checkDataArray),
          turn:0, 
          state:1,
          sub_state: 3,
          first_check_score: firstCheckScore, 
          first_check_miss_count: first_check_miss_count,
          request_content: request_content,
          project_attachment : project_attachment,
        });
      } 
    }else if( consigneeData.state == 1 && consigneeData.sub_state == 3 ){  //- 최초점검완료단계  
      if(userType != 1) {  
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id, 
          imp_check_data: JSON.stringify(checkDataArray),
          imp_check_consignee_temp_data: JSON.stringify(checkDataArray),
          turn:2, 
          state:2,
          sub_state: 1,
          request_content: request_content,
          project_attachment : project_attachment,
        });
      } 
    }else if( consigneeData.state == 2 && consigneeData.sub_state == 1 ){  //- 보완자료요청, 이행점검대기단계 
      if(userType == 1) {  //수탁사인 경우
        response = await axiosPost(`${API_URL}/project_detail/Update`, {
          id: consigneeData.id, 
          imp_check_data: JSON.stringify(checkDataArray),
          imp_check_admin_temp_data: JSON.stringify(checkDataArray),
          turn:0, 
          state:2,
          sub_state: 2,
          request_content: request_content,
          project_attachment : project_attachment,
        });
      }
    }else{
      let imp_check_score = 0;
      checkDataArray.forEach((item: any) => {
        if (item.result === "N") {
          imp_check_score++;
        }
      }); 
      const totalItems = checkDataArray.length;
      imp_check_score = (imp_check_score / totalItems) * 100;
      let imp_check_miss_count  = checkDataArray.filter((item: any) => item['result'] === 'N').length;

      response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: consigneeData.id, 
        imp_check_data: JSON.stringify(checkDataArray),
        imp_check_admin_temp_data: JSON.stringify(checkDataArray),
        turn:3, 
        state:2,
        sub_state: 3,
        imp_check_score : imp_check_score,
        imp_check_miss_count : imp_check_miss_count,
        request_content: request_content,
        project_attachment : project_attachment,
      });
    } 
     
    if (response.data.result == 'SUCCESS') {
      setModalMsg('정확히 제출되었습니다.')
      setShowModal(true)
    }
  }
  return(  
      <Box>
         <Box display={'flex'} justifyContent={'flex-end'} > 
         <Typography sx={{mr:3}}>{consigneeData.company_name}상세점검결과</Typography>  
         <Typography>점검일{consigneeData.first_check_date}</Typography></Box>
      {((userType == 0 || userType == 3 )&& !(consigneeData.sub_state == 1 && consigneeData.state == 1) ) ? ( //어드민이면서 자가점검이 아닐 경우에만 현시
        <>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:160, ml:1}}
            >
              수탁사 입력 활성화
            </Button> 

            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:90, ml:1}}
              onClick={onDownload}
            >
              다운로드
            </Button> 
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={onSave}
            >
              임시 저장
            </Button> 
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={onRequest}
            >
              보완 요청
            </Button> 
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={consigneeSubmit}
            >
               { (consigneeData.sub_state == 2 && consigneeData.state == 2)  ? '최종 저장' : '검수 완료'}
            </Button> 
          </Box>

          <Box sx={{display: 'flex', mt: 1}}>
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:150, ml:1, height: 40}}
              onClick={onIssue}
            >
              이슈 업체 등록
            </Button> 

            
            <Box sx={{ml: 'auto', border: 1, borderRadius: 0}}>
              <Box sx={{borderRadius: 0, borderBottom: 1, display: 'flex', justifyContent: 'center', p: 1}}>
                <FormControlLabel
                  sx={{mr:2}}
                  control={
                    <CustomCheckbox
                      color="success"
                      checked={checkExcept}
                      onChange={(e:any) => {setCheckExcept(e.target.checked);}}
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                  }
                  label="결과 제외"
                />

                <CustomSelect
                  labelId="month-dd"
                  id="month-dd"
                  size="small" 
                  value={exceptType}
                  sx={{width:150, mr:2}}
                  onChange = {(e:any) => {
                    setExceptType(e.target.value);
                  }}
                >
                  {exceptList.map((x, index) => {
                    return (
                      <MenuItem value={x.id} key = {index}>{x.name}</MenuItem>
                    );
                  })
                  }
                </CustomSelect>
              </Box>
              <Box sx={{p: 1}}>
                <FormControlLabel
                  sx={{mr:2}}
                  control={
                    <CustomCheckbox
                      color="success"
                      checked={checkAll=='Y'}
                      onChange={(e:any) => {setCheckAll('Y');}}
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                  }
                  label="Y"
                />
                <FormControlLabel
                  sx={{mr:2}}
                  control={
                    <CustomCheckbox
                      color="success"
                      checked={checkAll=='N'}
                      onChange={(e:any) => {setCheckAll('N');}}
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                  }
                  label="N"
                />
                <FormControlLabel
                  sx={{mr:2}}
                  control={
                    <CustomCheckbox
                      color="success"
                      checked={checkAll=='N/A'}
                      onChange={(e:any) => {setCheckAll('N/A');}}
                      inputProps={{ 'aria-label': 'checkbox with default color' }}
                    />
                  }
                  label="N/A"
                />

                <Button
                  variant={'contained'}
                  color={"primary"}
                  sx={{width:90, ml: 'auto'}}
                  onClick={onCheckAll}
                >
                  일괄적용
                </Button> 
              </Box>
            </Box>
            
          </Box>
        </>
          ) : (userType == 1) ? (
        <>
          <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>

            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={onSave}
            >
              임시 저장
            </Button> 
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={onDownload}
            >
              다운로드
            </Button> 
            <Button
              variant={'contained'}
              color={"primary"}
              sx={{width:100, ml:1}}
              onClick={consigneeSubmit}
            >
              제출
            </Button> 
          </Box>

          
        </>
      ) : (
        <></>
      )}

      <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
         <Typography sx={{mt: 1}}>전달사항:</Typography>
          <TextField  
            sx={{width:500}}
            variant="outlined" 
            value={request_content==''  ?  consigneeData.request_content : request_content}
          
            onChange={(e:any) => {  
              setRequestContent(e.target.value)
            }}
            required
          />
          
            <Row align={'middle'}>
            <InputLabel htmlFor="file-upload" style={{textAlign:'center', width:80, borderBottom: '1px solid black' }} component="label">
              파일 업로드
            </InputLabel>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange2}
              inputProps={{
                'aria-label': '첨부파일',
              }}
              style={{ display: 'none' }}
            />
            </Row>
            <a href={`${API_URL}/project_detail/Attachment?file_name=${
            encodeURIComponent(project_attachment != '' ? project_attachment : consigneeData.project_attachment)}`}>
              { (project_attachment != '' ? project_attachment : consigneeData.project_attachment)}
            </a>
            
      </Box>
   
          
      { !((userType == 0 || userType == 3 )&&consigneeData.sub_state == 1 && consigneeData.state == 1)  ?
        <TableContainer component={Paper}>
          <TableHead >
            <TableRow sx={{backgroundColor:'success'}}> 
              <TableCell style={{ textAlign: 'center'}}>영역</TableCell>
              <TableCell style={{ textAlign: 'center'}}>분야</TableCell>
              <TableCell style={{ textAlign: 'center'}}>항목</TableCell>
              <TableCell style={{ textAlign: 'center'}}>세부 점검 항목</TableCell>
              <TableCell style={{ textAlign: 'center'}}>점검결과</TableCell>
              <TableCell style={{ textAlign: 'center'}}>중적첨부</TableCell> 
              <TableCell style={{ textAlign: 'center'}}>검수결과</TableCell> 
              <TableCell style={{ textAlign: 'center'}}>보완조치</TableCell> 
              <TableCell style={{ textAlign: 'center'}}>최종결과</TableCell> 
              <TableCell style={{ textAlign: 'center'}}>최근 수정 날짜</TableCell> 
              {(userType == 0 || userType == 3) && <TableCell style={{ textAlign: 'center'}}>Lock</TableCell> }
              <TableCell style={{ textAlign: 'center'}}>상세</TableCell> 
            </TableRow>
          </TableHead> 
            <TableBody> 
              {checklistData.map((row:any, rowIndex) => (
                
                <TableRow key={row.id}>
                  {Object.keys(row).map((key, colIndex) => {  
                    return colIndex == 2 &&  row.merged1 !== 0 ?
                      (
                      <TableCell
                        key={colIndex}
                        style={{ textAlign: 'center', cursor: 'pointer' }}
                        rowSpan={row.merged1 > 0 ? row.merged1 : 1} 
                        sx={{width:200, pa:0}}
                      >

                          <TextareaAutosize 
                            value={row.area} 
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none" // 입력 비활성화
                            }} 
                          /> 
                      </TableCell>
                    )
                    : colIndex == 3 &&  row.merged2 !== 0 ?
                    (
                      <TableCell
                        key={colIndex}
                        style={{ textAlign: 'center', cursor: 'pointer'}}
                        rowSpan={row.merged2 > 0 ? row.merged2 : 1} 
                        sx={{width:250}}
                      >
                          <TextareaAutosize 
                            value={row.domain} 
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none" // 입력 비활성화
                            }} 
                          />  
                      </TableCell>
                    )
                    : colIndex == 4  ?
                    (
                      <TableCell
                        key={colIndex}
                        style={{ textAlign: 'center', cursor: 'pointer'}}
                        
                        sx={{width:250}}
                      >
                          <TextareaAutosize 
                          value={row.item} 
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        />
                      </TableCell>
                    ): colIndex == 5  ?
                      <TableCell
                        key={colIndex}
                        style={{ cursor: 'pointer'}}
                        sx={{width:700}}
                      >
                          <TextareaAutosize 
                            value={row.detail_item} 
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none" // 입력 비활성화
                            }} 
                          />
                          {expandedRow === rowIndex && (
                            <>
                              <Button
                                variant={'contained'}
                                color={"primary"}
                                size={'small'}
                                sx={{width:80}}
                              >
                                설명
                              </Button> 
                              <Typography sx={{mt: 1}}>현황</Typography>
                              <TextField  
                                fullWidth
                                variant="outlined" 
                                value={row.current_status}
                              
                                onChange={(e:any) => {
                                  let newData: any[] = [];
                                  checklistData.map((x) => {
                                    if (x.id == row.id) {
                                      x.current_status = e.target.value;
                                    }
                                    newData.push(x)
                                  })

                                  setChecklistData(newData)
                                }}
                                required
                              /> 
                              <Typography sx={{mt: 1}}>보완 요청 사항</Typography>
                              <TextField  
                                fullWidth
                                variant="outlined" 
                                value={row.modify_request}
                              
                                required
                              /> 
                              <Typography sx={{mt: 1}}>점검 결과 의견</Typography>
                              <TextField  
                                fullWidth
                                variant="outlined" 
                                value={row.check_suggestion}
                              
                                
                                required
                              /> 
                            </>
                          )}
                      </TableCell>
                     
                    : null;
                  })} 

                     <TableCell 
                        style={{ textAlign: 'center', cursor: 'pointer'}} 
                        sx={{width:100}}
                      >
                        {(expandedRow === rowIndex && 
                        !(consigneeData.sub_state == 2 && consigneeData.state == 2 && userType == 1 && 
                          (checkDataArray.filter((x:any)=> x.id == row.id).length==0? false
                           :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'Y'))) ? (
                          <CustomSelect
                            id="account-type-select"
                            sx={{ width: 70 }}
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].self_check_result} 
                            onChange={(event:any) => {
                              let newData: any[] = [];
                              checkDataArray.map((x) => {
                                if (x.id == row.id) {
                                  x.self_check_result = event.target.value;
                                }
                                newData.push(x)
                              })
                              setCheckDataArray(newData)
                            }} 
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                            <MenuItem value={'N/A'}>N/A</MenuItem>
                          </CustomSelect>
                        ) : (
                          <TextareaAutosize
                            value={checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? '' : checkDataArray.filter((x:any) => x.id === row.id)[0].self_check_result}
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none",  
                              outline: "none",
                              pointerEvents: "none", // 입력 비활성화
                              color: checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? 'black' : checkDataArray.filter((x:any) => x.id === row.id)[0].self_check_result === 'Y' ? 'blue' : checkDataArray.filter((x:any) => x.id === row.id)[0].self_check_result === 'N' ? 'red' : 'black'
                            }} 
                          />

                        )}
                          
                      </TableCell>
                      
                   <TableCell 
                        style={{ textAlign: 'center', cursor: 'pointer'}} 
                        sx={{width:100}}
                      > 
                      
                      
                      {/* {selectedFile ? (
                        <Chip
                          style={{ marginLeft: 2 }}
                          label={selectedFile.file.name}
                          onDelete={handleDelete}
                        />
                      ): (
                        <>
                        {editAttachment && <Chip
                          style={{ marginLeft: 2 }}
                          label={editAttachment}
                          onDelete={handleAttachmentDelete}
                        />}
                        </>
                      )} */} 
                      
                      {(expandedRow === rowIndex && 
                        !(consigneeData.sub_state == 2 && consigneeData.state == 2 && userType == 1 && 
                          (checkDataArray.filter((x:any)=> x.id == row.id).length==0? false
                           :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'Y'))) ? (
                        <Box>
                          <Box sx={{mb:2}}>
                            <a href={`${API_URL}/checkinfo/Attachment?file_name=${
                              encodeURIComponent(row.filename)}`}>
                                {row.filename}
                            </a> 
                          </Box>
                          
                          <a href={`${API_URL}/checkinfo/Attachment2?file_name=${encodeURIComponent(checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].attachment)}`}>{checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].attachment}</a>
                         <Row align={'middle'}>
                         <InputLabel htmlFor="file-upload" style={{textAlign:'center', width:80, borderBottom: '1px solid black' }} component="label">
                           파일 업로드
                         </InputLabel>
                         <Input
                           id="file-upload"
                           type="file"
                           onChange={(event:any) => handleFileChange(event, row.id)}
                           inputProps={{
                             'aria-label': '첨부파일',
                           }}
                           style={{ display: 'none' }}
                         />
                         </Row>
                          <CustomSelect
                            id="account-type-select"
                            sx={{ width: 70 }}
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].attachment=='' ? 'N' : 'Y'} 
                            onChange={(event:any) => {
                              let newData: any[] = [];
                              checkDataArray.map((x) => {
                                if (x.id == row.id) {
                                  x.attachment = event.target.value=='Y'? attachment : '' ;
                                }
                                newData.push(x)
                              }) 
                              setCheckDataArray(newData) 
                            }} 
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                          </CustomSelect>
                          </Box>
                        ) : (
                          <TextareaAutosize 
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].attachment=='' ? 'N' : 'Y'} 
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              color:checkDataArray.filter((x:any)=> x.id == row.id).length==0?'black':checkDataArray.filter((x:any)=> x.id == row.id)[0].attachment=='' ? 'black' : 'blue',
                              pointerEvents: "none" // 입력 비활성화
                            }} 
                          />
                        )
                    }
                  </TableCell>
                    
                  <TableCell 
                      style={{ textAlign: 'center', cursor: 'pointer'}}
                      
                      sx={{width:100}}
                    >
                        {(expandedRow === rowIndex && 
                        !(consigneeData.sub_state == 2 && consigneeData.state == 2 && userType == 1 && 
                          (checkDataArray.filter((x:any)=> x.id == row.id).length==0? false
                           :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'Y'))) ? (
                          <CustomSelect
                            id="account-type-select"
                            sx={{ width: 70 }}
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].check_result} 
                            onChange={(event:any) => {
                              let newData: any[] = [];
                              checkDataArray.map((x) => {
                                if (x.id == row.id) {
                                  x.check_result = event.target.value;
                                }
                                newData.push(x)
                              })

                              setCheckDataArray(newData)
                              
                            }} 
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                            <MenuItem value={'N/A'}>N/A</MenuItem>
                          </CustomSelect>
                        ) : (
                          <TextareaAutosize 
                            value={checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? '' : checkDataArray.filter((x:any) => x.id === row.id)[0].check_result}
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none", // 입력 비활성화
                              color: checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? 'black' : checkDataArray.filter((x:any) => x.id === row.id)[0].check_result === 'Y' ? 'blue' : checkDataArray.filter((x:any) => x.id === row.id)[0].check_result === 'N' ? 'red' : 'black'
                            }} 
                          />

                        )}
                        
                  </TableCell>
                    
                  <TableCell 
                      style={{ textAlign: 'center', cursor: 'pointer'}}
                      
                      sx={{width:100}}
                    > 
                        {(expandedRow === rowIndex && 
                        !(consigneeData.sub_state == 2 && consigneeData.state == 2 && userType == 1 && 
                          (checkDataArray.filter((x:any)=> x.id == row.id).length==0? false
                           :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'Y'))) ? (
                          <CustomSelect
                            id="account-type-select"
                            sx={{ width: 70 }}
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].additional} 
                            onChange={(event:any) => {
                              let newData: any[] = [];
                              checkDataArray.map((x) => {
                                if (x.id == row.id) {
                                  x.additional = event.target.value;
                                }
                                newData.push(x)
                              })
                              setCheckDataArray(newData)
                            }}
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                            <MenuItem value={'N/A'}>N/A</MenuItem>
                          </CustomSelect>
                        ) : (
                          <TextareaAutosize
                            value={checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? '' : checkDataArray.filter((x:any) => x.id === row.id)[0].additional}
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none", // 입력 비활성화
                              color: checkDataArray.filter((x:any) => x.id === row.id).length === 0 
                                ? 'black' // checkDataArray에 해당 id가 없는 경우 검은색으로
                                : checkDataArray.filter((x:any) => x.id === row.id)[0].additional === 'Y' 
                                  ? 'blue' // additional 값이 'Y'인 경우 푸른색으로
                                  : checkDataArray.filter((x:any) => x.id === row.id)[0].additional === 'N' 
                                    ? 'red' // additional 값이 'N'인 경우 빨간색으로
                                    : 'black' // 그 외의 경우 검은색으로
                            }} 
                          />
                        )}
                  </TableCell>
                    
                  <TableCell 
                      style={{ textAlign: 'center', cursor: 'pointer'}} 
                      sx={{width:100}}
                    >
                        {(expandedRow === rowIndex && 
                        !(consigneeData.sub_state == 2 && consigneeData.state == 2 && userType == 1 && 
                          (checkDataArray.filter((x:any)=> x.id == row.id).length==0? false
                           :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'Y'))) ? (
                          <CustomSelect
                            id="account-type-select"
                            sx={{ width: 70 }}
                            value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].result} 
                            onChange={(event:any) => {
                              let newData: any[] = [];
                              checkDataArray.map((x) => {
                                if (x.id == row.id) {
                                  x.result = event.target.value;
                                }
                                newData.push(x)
                              }) 
                              setCheckDataArray(newData) 
                            }} 
                          >
                            <MenuItem value={'Y'}>Y</MenuItem>
                            <MenuItem value={'N'}>N</MenuItem>
                            <MenuItem value={'N/A'}>N/A</MenuItem>
                          </CustomSelect>
                        ) : (
                          <TextareaAutosize
                            value={checkDataArray.filter((x:any) => x.id === row.id).length === 0 ? '' : checkDataArray.filter((x:any) => x.id === row.id)[0].result}
                            style={{ 
                              width: "100%", 
                              minHeight: 32, 
                              resize: "none", 
                              border: "none", 
                              outline: "none",
                              pointerEvents: "none", // 입력 비활성화
                              color: checkDataArray.filter((x:any) => x.id === row.id).length === 0 
                                ? 'black' // checkDataArray에 해당 id가 없는 경우 검은색으로
                                : checkDataArray.filter((x:any) => x.id === row.id)[0].result === 'Y' 
                                  ? 'blue' // result 값이 'Y'인 경우 푸른색으로
                                  : checkDataArray.filter((x:any) => x.id === row.id)[0].result === 'N' 
                                    ? 'red' // result 값이 'N'인 경우 빨간색으로
                                    : 'black' // 그 외의 경우 검은색으로
                            }} 
                          />

                        )}
                  </TableCell>
                    
                  <TableCell 
                      style={{ textAlign: 'center', cursor: 'pointer'}} 
                      sx={{width:120}}
                    >
                     
                        <TextareaAutosize 
                          value={checkDataArray.filter((x:any)=> x.id == row.id).length==0?'':checkDataArray.filter((x:any)=> x.id == row.id)[0].modify_time} 
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        /> 
                  </TableCell>

                  {(userType == 0 || userType == 3) && <TableCell 
                  style={{ textAlign: 'center', cursor: 'pointer'}}
                  onClick={() => { 
                    let newData: any[] = [];
                    checkDataArray.map((x) => {
                      if (x.id == row.id) {
                        if(x.lock == "N")
                          x.lock = "O";
                        else x.lock = "N";
                      }
                      newData.push(x)
                    }) 
                    setCheckDataArray(newData)
                  }}
                  sx={{width:80}}
                  > 
                    {(checkDataArray.filter((x:any)=> x.id == row.id).length==0? false :checkDataArray.filter((x:any)=> x.id == row.id)[0].lock == 'N') ? (
                      <Image src={LockOff} alt={"SavingsImg"} width="25" />
                    ): (
                      <Image src={LockOn} alt={"SavingsImg"} width="25" />
                    )}
                  </TableCell>}
                    
                  <TableCell 
                  style={{ textAlign: 'center', cursor: 'pointer'}}
                  onClick={() => {
                    setExpandedRow(expandedRow === rowIndex ? null : rowIndex);
                  }}
                  sx={{width:80}}
                  > 
                    {expandedRow === rowIndex ? (
                      <Image src={DetailOff} alt={"SavingsImg"} width="25" />
                    ): (
                      <Image src={DetailOn} alt={"SavingsImg"} width="25" />
                    )}
                  </TableCell>
                  
                </TableRow>

              ))}
            </TableBody>
           
        </TableContainer> : <Typography>자가점검중</Typography>
      }
      <Dialog open={showModal} onClose={onClose}>
        <DialogTitle></DialogTitle>
        <DialogContent sx={{width:300}} >
          <DialogContentText>{modalMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { onClose(); }}>OK</Button>
        </DialogActions>
      </Dialog> 

      <Dialog  open={detailsDialogOpen} onClose={() => setDetailsDialogOpen(false)} maxWidth="sm" fullWidth>
              <DialogTitle  sx={{ textAlign: 'center',   }} >이슈 사유</DialogTitle>
              <DialogContent> 
              <Grid container spacing={2}>
                {/* 그리드 컨테이너를 사용하여 2행 2열의 그리드를 생성 */}
                {checkboxesData.map((checkbox, index) => (
                  <Grid key={index} item xs={6}>
                    {/* 각 그리드 아이템은 xs={6}로 설정하여 2열로 표시 */}
                    <Typography>
                      <Checkbox
                        checked={checkboxes[checkbox.name]}
                        onChange={handleCheckboxChange(checkbox.name)}
                        name={checkbox.name}
                      />
                      {checkbox.label}
                    </Typography>
                  </Grid>
                ))}
              </Grid> 
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
                        <Send />
                      </IconButton>
                    )
                  }}
                />   

              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailsDialogOpen(false)}>Close</Button>
              </DialogActions>
            </Dialog>
    </Box>
      
  );
};

export default CheckResult;

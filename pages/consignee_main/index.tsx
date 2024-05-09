import { useEffect, useState } from 'react'; 
import React from "react";
import {
  Typography,
  Box,
  Grid,
  LinearProgress,
  Avatar,
  Chip,
  Paper,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  MenuItem,
  TableHead,
  TableRow,
  Stack,
  Card,
  Icon,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog, DialogActions, DialogContent, DialogContentText,  DialogTitle
} from '@mui/material';

import PageContainer from "@src/components/container/PageContainer";
import Status from "./component/Status"
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
const axios = require('axios');
import { API_URL } from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';

export default function Modern() {
  const [projectList, setProjectList] = useState([])
  const [project, setProject] = useState(0)
  const [noStatus, setNoStatus] = useState(false)
  const [userData, setUserData] = useState({
    type: 0,
    user_id: 0,
    name: '',
    company_name: '',
  })

  const fetchProject = async() => {
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str);
    setUserData(data)

    const response = await axiosPost(`${API_URL}/project/List`, {
      consignee_id: data.user_id
    });
    setProjectList(response.data)
  }

  useEffect(() => {
    fetchProject()
  }, []);

  const [status, setStatus] = useState('')

  const fetchDetail = async () => {
    let response = await axiosPost(`${API_URL}/project_detail/Status`, {
      project_id: project,
      consignee_id: userData.user_id
    });

    setStatus(response.data)

    if (response.data.status) {
      setNoStatus(false)
    }
    else {
      setModalMsg('"' + userData.company_name + '"담당자님, 환영합니다!\n 점검 진행에 앞서 일반 현황 정보를 입력해주세요.')
      setShowModal(true)
      setNoStatus(true)
    }
  }

  useEffect(() => {
    if (project)
      fetchDetail()
    else
      setNoStatus(false)
  }, [project])

  const [showModal, setShowModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')
  const onClose = () => {
    setShowModal(false)
  }

  return (
    <PageContainer>
      <Box>
        <Box sx={{display: 'flex', alignItems: 'center'}}>
          <Typography sx={{mr:1}}>
            프로젝트명:
          </Typography>
          <CustomSelect
            labelId="month-dd"
            id="month-dd"
            size="small" 
            value={project}
            sx={{width:150, mr:2}}
            onChange = {(e:any) => {
              setProject(e.target.value);
            }}
          >
            {projectList.map((x, index) => {
              return (
                <MenuItem value={x.project_id} key = {index}>{x.name}</MenuItem>
              );
            })
            }
          </CustomSelect>
        </Box>


        {noStatus && <Status project={project} setNoStatus={setNoStatus}/>}
        <Dialog open={showModal} onClose={onClose}>
          <DialogTitle></DialogTitle>
          <DialogContent sx={{width:370}} >
            <DialogContentText sx={{wordWrap:'break-word', whiteSpace:'break-spaces', textAlign: 'center', fontSize: 19}}>{modalMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { onClose(); }}>OK</Button>
          </DialogActions>
        </Dialog> 
        
      </Box>
    </PageContainer>
  );
};


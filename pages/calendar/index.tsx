import React, { useState, useEffect, useCallback } from 'react';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText, 
  TextField,
  Typography, 
  Box,
  FormControlLabel,
} from '@mui/material';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/ko'; // 한국어 로케일
import Events from '@src/EventData';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import koLocale from 'date-fns/locale/ko';

import PageContainer from '@src/components/container/PageContainer';
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import BlankCard from '@src/components/shared/BlankCard'; 
import MenuItem from '@mui/material/MenuItem';
import { Label } from '@mui/icons-material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox';
const axios = require('axios');
import { API_URL } from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';

moment.locale('ko'); // 한국어로 설정
const localizer = momentLocalizer(moment);

type EvType = {
  title: string;
  allDay?: boolean;
  start?: Date;
  end?: Date;
  color?: string;
};

export default function BigCalendar() {
  const [calevents, setCalEvents] = React.useState<any>(Events);
  const [open, setOpen] = React.useState<boolean>(false);
  const [checkOpen, setCheckOpen] = React.useState<boolean>(false);
  const [checkMode, setCheckMode] = React.useState('register');
  const [checkDate, setCheckDate] = React.useState(new Date());
  const [checkTitle, setCheckTitle] = React.useState('');
  const [checkAddress, setCheckAddress] = React.useState('');
  const [checkManager, setCheckManager] = React.useState('');
  const [checkManagerPhone, setCheckManagerPhone] = React.useState('');
  const [toggle, setToggle] = React.useState(false);
  const [checkSchedule, setCheckSchedule] = React.useState<any>([]);
  const [title, setTitle] = React.useState<string>('');
  const [start, setStart] = React.useState<any | null>();
  const [end, setEnd] = React.useState<any | null>();
  const [editIndex, setEditIndex] = React.useState(-1)
  const [initialEnd, setInitialEnd] = React.useState<any | null>();

  const [admins, setAdmins] = useState([])
  const [admin, setAdmin] = useState(0)

  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(0)

  const [consignees, setConsignees] = useState([])
  const [consignee, setConsignee] = useState(0)

  const [delayType, setDelayType] = useState('create')
  const [checkAll, setCheckAll] = React.useState(false)

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

  const [schedule, setSchedule] = useState({
    create_from: '',
    create_to: '',
    self_check_from: '',
    self_check_to: '',
    imp_check_from: '',
    imp_check_to: ''
  })

  useEffect(() => {
    if (open) {
      if (delayType == 'create') {
        setStart(schedule.create_from)
        
        let len = projectDetail.delay.create.length;
        if (len == 0) {
          setEnd(schedule.create_to)
          setInitialEnd(schedule.create_to)
        }
        else {
          setEnd(projectDetail.delay.create[len - 1])
          setInitialEnd(projectDetail.delay.create[len - 1])
        }
      }

      if (delayType == 'self_check') {
        setStart(schedule.self_check_from)
        
        let len = projectDetail.delay.self_check.length;
        if (len == 0) {
          setEnd(schedule.self_check_to)
          setInitialEnd(schedule.self_check_to)
        }
        else {
          setEnd(projectDetail.delay.self_check[len - 1])
          setInitialEnd(projectDetail.delay.self_check[len - 1])
        }
      }

      if (delayType == 'imp_check') {
        setStart(schedule.imp_check_from)
        
        let len = projectDetail.delay.imp_check.length;
        if (len == 0) {
          setEnd(schedule.imp_check_to)
          setInitialEnd(schedule.imp_check_to)
        }
        else {
          setEnd(projectDetail.delay.imp_check[len - 1])
          setInitialEnd(projectDetail.delay.imp_check[len - 1])
        }
      }
    }
  }, [open, delayType]);

  useEffect(() => {
    let newEvents = [];

    if (!checkAll)
    {
      if (projectDetail.set) {
        let delay = projectDetail.delay;
        let len;

        len = delay.create.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let eventStart, eventEnd;
            let startDate;

            if (i == 0) 
              startDate = schedule.create_to;
            else
              startDate = delay.create[i - 1]

            let afterCreate = new Date(startDate);
            afterCreate.setDate(afterCreate.getDate() + 1)
            eventStart = getDateStr(afterCreate);
              
            eventEnd = delay.create[i]

            newEvents.push({
              title: `계정생성 기간 연기(${i + 1}차)`,
              allDay: true,
              start: eventStart,
              end: eventEnd,
              color: 'create',
              delayType: 'create',
              delayIndex: i
            })
          }
        }

        len = delay.self_check.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let eventStart, eventEnd;
            let startDate;

            if (i == 0) 
              startDate = schedule.self_check_to;
            else
              startDate = delay.self_check[i - 1]

            let afterCreate = new Date(startDate);
            afterCreate.setDate(afterCreate.getDate() + 1)
            eventStart = getDateStr(afterCreate);
              
            eventEnd = delay.self_check[i]

            newEvents.push({
              title: `자가점검 제출 기간 연기(${i + 1}차)`,
              allDay: true,
              start: eventStart,
              end: eventEnd,
              color: 'self-check',
              delayType: 'self_check',
              delayIndex: i
            })
          }
        }

        len = delay.imp_check.length
        if (len > 0) {
          for (let i = 0; i < len; i++) {
            let eventStart, eventEnd;
            let startDate;

            if (i == 0) 
              startDate = schedule.imp_check_to;
            else
              startDate = delay.imp_check[i - 1]

            let afterCreate = new Date(startDate);
            afterCreate.setDate(afterCreate.getDate() + 1)
            eventStart = getDateStr(afterCreate);
              
            eventEnd = delay.imp_check[i]

            newEvents.push({
              title: `이행점검 보완제출 기간 연기(${i + 1}차)`,
              allDay: true,
              start: eventStart,
              end: eventEnd,
              color: 'imp-check',
              delayType: 'imp_check',
              delayIndex: i
            })
          }
        }

        if (projectDetail.create_date) {
          newEvents.push({
            title: '계정 생성',
            allDay: true,
            start: new Date(projectDetail.create_date),
            end: new Date(projectDetail.create_date),
            color: 'default',
          })
        }

        if (projectDetail.self_check_date) {
          newEvents.push({
            title: '자가 점검 제출',
            allDay: true,
            start: new Date(projectDetail.self_check_date),
            end: new Date(projectDetail.self_check_date),
            color: 'default',
          })
        }

        if (projectDetail.imp_check_date) {
          newEvents.push({
            title: '이행 점검 보완 제출',
            allDay: true,
            start: new Date(projectDetail.imp_check_date),
            end: new Date(projectDetail.imp_check_date),
            color: 'default',
          })
        }

        
      }

      
    }
    if ((checkAll || userData.type == 1) && project) {
      console.log(checkSchedule)
      checkSchedule.map((x:any, i: Number) => {
        newEvents.push({
          title: '현장점검-' + x.user_name,
          allDay: true,
          start: new Date(x.data.time),
          end: new Date(x.data.time),
          color: 'check',
          index: i,
        })
      })
    }

    newEvents.push({
      title: '계정 생성 기간',
      allDay: true,
      start: new Date(schedule.create_from),
      end: new Date(schedule.create_from),
      color: 'transparent',
    })
    
    newEvents.push({
      title: '계정 생성 마감',
      allDay: true,
      start: new Date(schedule.create_to),
      end: new Date(schedule.create_to),
      color: 'transparent',
    })

    newEvents.push({
      title: '자가점검 제출 기간',
      allDay: true,
      start: new Date(schedule.self_check_from),
      end: new Date(schedule.self_check_from),
      color: 'transparent',
    })

    newEvents.push({
      title: '자가점검 마감',
      allDay: true,
      start: new Date(schedule.self_check_to),
      end: new Date(schedule.self_check_to),
      color: 'transparent',
    })

    let first_check = new Date(schedule.self_check_to);
    first_check.setDate(first_check.getDate() + 1)

    if (getDateStr(first_check) > schedule.self_check_to && getDateStr(first_check) < schedule.imp_check_from) {
      newEvents.push({
        title: '1차 검수 기간',
        allDay: true,
        start: first_check,
        end: first_check,
        color: 'transparent',
      })
    }

    newEvents.push({
      title: '이행점검 보완제출 기간',
      allDay: true,
      start: new Date(schedule.imp_check_from),
      end: new Date(schedule.imp_check_from),
      color: 'transparent',
    })

    newEvents.push({
      title: '이행점검 보완제출 마감',
      allDay: true,
      start: new Date(schedule.imp_check_to),
      end: new Date(schedule.imp_check_to),
      color: 'transparent',
    })

    setCalEvents(newEvents)
    setToggle(!toggle)
  }, [schedule, projectDetail, checkAll, checkSchedule])

  const fetchDetail = async() => {
    let response;
    if (userData.type == 1) {
      response = await axiosPost(`${API_URL}/project/Detail`, {
        project_id: project,
        consignee_id: userData.user_id
      }); 
    }
    else if (userData.type == 2) {
      response = await axiosPost(`${API_URL}/project/Detail`, {
        project_id: project,
        company_id: consignee
      }); 
    }
    else {
      response = await axiosPost(`${API_URL}/project/Detail`, {
        project_id: project,
        admin_id: admin,
        company_id: consignee
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
  }

  useEffect(() => {
    if (consignee) {
      fetchDetail()
    }
    else {
      setProjectDetail({...projectDetail, set: false})
    }
  }, [consignee])

  const fetchSchedule = () => {
    if (project) {
      let data = projects.find((x) => x.project_id == project);
      setSchedule({
        create_from: data.create_from,
        create_to: data.create_to,
        self_check_from: data.self_check_from,
        self_check_to: data.self_check_to,
        imp_check_from: data.imp_check_from,
        imp_check_to: data.imp_check_to
      })
    }
    else {
      setSchedule({
        create_from: '',
        create_to: '',
        self_check_from: '',
        self_check_to: '',
        imp_check_from: '',
        imp_check_to: ''
      })
    }
  }

  useEffect(() => {
    fetchSchedule()
    if (userData.type != 1)
      fetchConsignee()
    fetchCheckSchedule()
    if (userData.type == 1)
      fetchDetail()
  }, [project])

  const fetchCheckSchedule = async() => {
    if (project) {
      let response;
      if (userData.type == 1) {
        response = await axiosPost(`${API_URL}/project_detail/CheckSchedule`, {
          project_id: project,
          consignee_id: userData.user_id
        });  
      }
      else if (userData.type == 2) {
        response = await axiosPost(`${API_URL}/project_detail/CheckSchedule`, {
          project_id: project
        });  
      }
      else {
        response = await axiosPost(`${API_URL}/project_detail/CheckSchedule`, {
          project_id: project,
          admin_id: admin
        });  
      }

      let data = response.data
      let newData: { id:any; company_id: any; project_id: any; checker_id: any; user_name: any; admin_name:any; data: { time: any; address: any; manager: any; phone: any; }; }[] = []
      
      data.map((x:any) => {
        if (x.check_schedule) {
          let checks = JSON.parse(x.check_schedule)

          checks.map((ch:any) => {
            newData.push({
              id: x.id,
              company_id: x.company_id,
              project_id: x.project_id,
              checker_id: x.checker_id,
              user_name: x.user_name,
              admin_name: x.admin_name,
              data: {
                time: ch.time,
                address: ch.address,
                manager: ch.manager,
                phone: ch.phone
              } 
            })
          })
        }
      })

      setCheckSchedule(newData)
    }
    else {
      setCheckSchedule([])
    }
  }

  const fetchConsignee = async() => {
    if (project) {
      let response;
      if (admin) {
        response = await axiosPost(`${API_URL}/project/ConsigneeByAdmin`, {
          project_id: project,
          admin_id: admin
        });  
      }
      else {
        response = await axiosPost(`${API_URL}/project/ConsigneeByAdmin`, {
          project_id: project,
        });
      }

      setConsignees(response.data)
    }
    else {
      setConsignees([])
    }
    setConsignee(0)
  }

  const fetchProjects = async() => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      admin_id: admin
    });
    setProjects(response.data)
  }

  const fetchProjectsByConsignee = async(id:any) => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      consignee_id: id
    });
    setProjects(response.data)
  }

  const fetchProjectsByConsignor = async(id:any) => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      consignor_id: id
    });
    setProjects(response.data)
  }

  const fetchAdmins = async() => {
    const response = await axiosPost(`${API_URL}/project/Users`,{});
    let data = response.data

    setAdmins(data.admin)
    if (data.admin.length > 0)
      setAdmin(data.admin[0].user_id)
  }

  const [userData, setUserData] = React.useState({
    type: 0,
    user_id: 0,
    name: ''
  });

  useEffect(() => {
    if (userData.user_id) {
      if (userData.type == 3) {
        fetchAdmins();
      }
      else if (userData.type == 0) {
        let newAdmins = [{
          user_id: userData.user_id,
          name: userData.name,
        }]

        setAdmins(newAdmins);
        setAdmin(userData.user_id);
      }
      else if (userData.type == 1) {
        setAdmins([])
        setAdmin(0)
      }
    }
  }, [userData])

  useEffect(() => {
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str);

    if (admin) {
      fetchProjects()
    }
    else {
      setProjects([])

      if (data.type == 1) {
        fetchProjectsByConsignee(data.user_id)
      }

      if (data.type == 2) {
        fetchProjectsByConsignor(data.user_id)
      }
    }
    setProject(0)
  }, [admin])

  useEffect(() => {
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str);
    setUserData(data)
  }, []);

  const [delDelayType, setDelDelayType] = React.useState('');
  const [delDelayIndex, setDelDelayIndex] = React.useState(-1);

  const editEvent = (event: any) => {
    console.log(event)
    if (event.index) {
      let data = checkSchedule[event.index]

      console.log(data)
  
      setCheckOpen(true)
      setCheckMode('view')
      setCheckTitle(data.user_name + " - " + data.admin_name)
      setCheckDate(data.data.time)
      setCheckAddress(data.data.address)
      setCheckManager(data.data.manager)
      setCheckManagerPhone(data.data.phone)
      setEditIndex(event.index)  
    }
    else if (event.delayType) {
      setDelDelayType(event.delayType)
      setDelDelayIndex(event.delayIndex)
      setDeleteModal(true)
    }
  };

  const addNewEventAlert = (slotInfo: EvType) => {
    if (checkAll && project && consignee && (userData.type == 0 || userData.type == 3)) {

      let cc = consignees.find((x) => x.company_id == consignee)
      let aa = admins.find((x) => x.user_id == admin)

      console.log(consignees)

      setCheckMode('register');
      setCheckTitle(cc.name + " - " + aa.name)
      setCheckDate(slotInfo.start)
      setCheckAddress(cc.company_address)
      setCheckManager(cc.manager_name)
      setCheckManagerPhone(cc.manager_phone)

      setCheckOpen(true);
    }
  };

  const eventColors = (event: EvType) => {
    if (event.color) {
      return { className: `event-${event.color}` };
    }

    return { className: `event-default` };
  };

  
  const getDateStr = (d: Date) => {
    let date = new Date(d)
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);

    return `${year}-${month}-${day}`;
  }

  const getDateTimeStr = (d: Date) => {
    let date = new Date(d)
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);

    return `${year}-${month}-${day} ${hour}:${minute}:00`;
  }

  const dayPropGetter = useCallback(
    (date:Date) => {
      const dateStr = getDateStr(date)

      if (dateStr >= schedule.create_from && dateStr <= schedule.create_to)  {
        return {
          style: {
            backgroundImage: 'linear-gradient(to bottom right, #ffff85, #ffffda)'
          }
        };  
      }
      else if (dateStr >= schedule.self_check_from && dateStr <= schedule.self_check_to)  {
        return {
          style: {
            backgroundImage: 'linear-gradient(to bottom right, #ffc7b1, #fbe5d6)'
          }
        };  
      }
      else if (dateStr >= schedule.imp_check_from && dateStr <= schedule.imp_check_to)  {
        return {
          style: {
            backgroundImage: 'linear-gradient(to bottom right, #c4e3b6, #e6f2e0)'
          }
        };  
      }
      else if (dateStr > schedule.self_check_to && dateStr < schedule.imp_check_from)  {
        return {
          style: {
            backgroundImage: 'linear-gradient(to bottom right, #b6b3b3, #e8e7e7)'
          }
        };  
      }
    },
    [schedule]
  )

  const [showModal, setShowModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')
  const onClose = () => {
    setShowModal(false)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCheckClose = () => {
    setCheckOpen(false)
  }

  const handleStartChange = (newValue: any) => {
    setStart(newValue);
  };
  const handleEndChange = (newValue: any) => {
    setEnd(newValue);
  };

  const onDelay = async () => {
    if (getDateStr(end) <= initialEnd) {
      setModalMsg('연기된 날짜를 정확히 입력하세요.');
      setShowModal(true);
      return;
    }

    let newDelay = projectDetail.delay;
    if (delayType == 'create') {
      newDelay.create.push(end);
    }
    if (delayType == 'self_check') {
      newDelay.self_check.push(end);
    }
    if (delayType == 'imp_check') {
      newDelay.imp_check.push(end);
    }

    const response = await axiosPost(`${API_URL}/project_detail/Update`, {
      id: projectDetail.id,
      delay: JSON.stringify(newDelay)
    });

    if (response.data.result == 'SUCCESS') {
      setOpen(false)
      setProjectDetail({...projectDetail, delay: newDelay});
      setModalMsg('정확히 저장되었습니다.')
      setShowModal(true)
    }
    else {
      setModalMsg(response.data.error_message)
      setShowModal(true)
    }
  }

  const onSaveCheck = async () => {
    if (checkMode == 'register') {
      let newData = {
        time: getDateTimeStr(checkDate),
        address: checkAddress,
        manager: checkManager,
        phone: checkManagerPhone
      }

      console.log(checkSchedule)
      console.log(consignee)
      console.log(project)
      console.log(admin)
  
      let res = [];
      for (let i = 0; i < checkSchedule.length; i++) {
        if (checkSchedule[i].company_id == consignee && checkSchedule[i].project_id == project && checkSchedule[i].checker_id == admin) {
          res.push(checkSchedule[i].data)
        }
      }
  
      res.push(newData)
  
      const response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: projectDetail.id,
        check_schedule: JSON.stringify(res)
      });
  
      if (response.data.result == 'SUCCESS') {
        setCheckOpen(false)
  
        let newSchedule = checkSchedule.map((x:any) => x);
        let cc = consignees.find((x) => x.company_id == consignee)
        let aa = admins.find((x) => x.user_id == admin)
        newSchedule.push({
          id: projectDetail.id,
          admin_name: aa.name,
          company_id: consignee,
          project_id: project,
          checker_id: admin,
          user_name: cc.name,
          data: newData
        })
        setCheckSchedule(newSchedule)
        setToggle(!toggle)
        setModalMsg('정확히 저장되었습니다.')
        setShowModal(true)
      }
      else {
        setModalMsg(response.data.error_message)
        setShowModal(true)
      }
    }
    else {
      let newSchedule = checkSchedule.map((x:any) => x);
      newSchedule[editIndex].data = {
        time: getDateTimeStr(checkDate),
        address: checkAddress,
        manager: checkManager,
        phone: checkManagerPhone
      }

      let res = [];
      for (let i = 0; i < newSchedule.length; i++) {
        if (newSchedule[i].user_id == newSchedule[editIndex].user_id && newSchedule[i].project_id == newSchedule[editIndex].project_id && newSchedule[i].checker_id == newSchedule[editIndex].checker_id) {
          res.push(newSchedule[i].data)
        }
      }
  
      const response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: newSchedule[editIndex].id,
        check_schedule: JSON.stringify(res)
      });
  
      if (response.data.result == 'SUCCESS') {
        setCheckOpen(false)
  
        setCheckSchedule(newSchedule)
        setModalMsg('정확히 저장되었습니다.')
        setShowModal(true)
      }
      else {
        setModalMsg(response.data.error_message)
        setShowModal(true)
      }  
    }
  }

  const onEditCheck = async () => {
    setCheckMode('edit')
  }

  const getKoreanDateTime = (date: any) => {
    let dd = new Date(date)
    const year = dd.getFullYear();
    const month = dd.getMonth() + 1;
    const day = dd.getDate();
    const hour = dd.getHours();
    const minute = dd.getMinutes();
    const d = dd.getDay();
    const day_names=['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

    return `${year}년 ${month}월 ${day}일(${day_names[d]}) ${hour}시 ${minute}분`;
  }

  const [deleteModal, setDeleteModal] = React.useState(false)

  const onDelete = () => {
    setDeleteModal(true)
  }

  const onCloseDeleteModal = () => {
    setDeleteModal(false)
  }

  const handleDelete = async() => {
    let newDelay = projectDetail.delay;
    if (delayType == 'create') {
      newDelay.create.splice(delDelayIndex, 1);
    }
    if (delayType == 'self_check') {
      newDelay.self_check.splice(delDelayIndex, 1);
    }
    if (delayType == 'imp_check') {
      newDelay.imp_check.splice(delDelayIndex, 1);
    }

    const response = await axiosPost(`${API_URL}/project_detail/Update`, {
      id: projectDetail.id,
      delay: JSON.stringify(newDelay)
    });

    if (response.data.result == 'SUCCESS') {
      setDeleteModal(false)
      setProjectDetail({...projectDetail, delay: newDelay});
      setModalMsg('정확히 저장되었습니다.')
      setShowModal(true)
    }
    else {
      setDeleteModal(false)
      setModalMsg(response.data.error_message)
      setShowModal(true)
    }
  }

  return (
    <PageContainer>
      <Breadcrumb title="일정관리"   />
      <Box display={'flex'} sx={{margin:1}} alignItems="center">
        {(userData.type == 3 || userData.type == 0) && (
          <>
            <Typography sx={{mr:1}} >담당자 명</Typography>
            <CustomSelect
              id="account-type-select"
              sx={{mr:4}}
              value={admin} 
              onChange={(event:any) => {
                setAdmin(event.target.value)}}
            >
              {admins.map((x, i) => {
                  return (
                  <MenuItem key={i} value={x.user_id}>{x.name}</MenuItem>
                );
              })
              }
            </CustomSelect>
          </>
        )}

        <Typography sx={{mr:1}} >프로젝트 명</Typography>
        <CustomSelect
          id="account-type-select"
          sx={{mr:2, width: 200}}
          value={project} 
          onChange={(event:any) => {
            setProject(event.target.value)}}
        >
          {projects.map((x, i) => {
            return (
              <MenuItem key={i} value={x.project_id}>{x.name}</MenuItem>
            );
          })}
        </CustomSelect>
        {userData.type != 1 && (
            <FormControlLabel
            sx={{mr:2}}
            control={
              <CustomCheckbox
                color="success"
                checked={checkAll}
                onChange={(e:any) => {setCheckAll(e.target.checked);}}
                inputProps={{ 'aria-label': 'checkbox with default color' }}
              />
            }
            label="모든 수탁사 현장점검 일정"
          />        
        )}
        
        {userData.type != 1 && (
          <>
            <Typography sx={{mr:1}} >수탁사</Typography>
            <CustomSelect
              id="account-type-select" 
              value={consignee} 
              sx={{width: 150}}
              onChange={(event:any) => {
                setConsignee(event.target.value)}}
            >
              {consignees.map((x, i) => {
                return (
                  <MenuItem key={i} value={x.company_id}>{x.name}</MenuItem>
                );
              })}
            </CustomSelect>

          </>
        )}

        {(consignee > 0) && (
          <Button
            onClick={() => {
              setOpen(true)
            }}
            variant="contained"
            color="primary" 
            sx={{width:100, ml:2}}
          >
            일정연기
          </Button> )
        }
      </Box>
      
      <BlankCard>
      
        {/* ------------------------------------------- */}
        {/* Calendar */}
        {/* ------------------------------------------- */}
        <Calendar
          selectable
          events={calevents}
          views={['month', 'week']}
          defaultView="month"
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date()}
          localizer={localizer}
          style={{ height: 'calc(100vh)' }} // 스타일 속성 값에 닫는 괄호를 추가했습니다.
          onSelectEvent={(event) => editEvent(event)}
          onSelectSlot={(slotInfo: any) => addNewEventAlert(slotInfo)}
          eventPropGetter={(event: any) => eventColors(event)}
          dayPropGetter={dayPropGetter}
          messages={{
            allDay: '종일',
            previous: '이전',
            next: '다음',
            today: '오늘',
            month: '월',
            week: '주',
            day: '일',
            agenda: '일정',
            date: '날짜',
            time: '시간',
            event: '일정', // 여기에 더 많은 번역을 추가할 수 있습니다.
            noEventsInRange: '이 기간에 일정가 없습니다.',
            // 다른 문자열들도 필요에 따라 추가 및 번역
          }}
        />

        

      </BlankCard>
      {/* ------------------------------------------- */}
      {/* Add Calendar Event Dialog */}
      {/* ------------------------------------------- */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
        <form>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              일정 연기
            </Typography>

            <CustomSelect
              value={delayType} 
              sx={{mb:3}}
              onChange={(event:any) => {
                setDelayType(event.target.value)}}
            >
              <MenuItem value={'create'}>계정 생성 기간</MenuItem>
              <MenuItem value={'self_check'}>자가점검 제출 기간</MenuItem>
              <MenuItem value={'imp_check'}>이행점검 보완제출 기간</MenuItem>
            </CustomSelect>
            {/* ------------------------------------------- */}
            {/* Selection of Start and end date */}
            {/* ------------------------------------------- */}
            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Box sx={{flex: 1}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}> 
                  <DatePicker
                    label="시작 날짜"
                    inputFormat="yyyy-MM-dd"
                    value={start}
                    onChange={handleStartChange}
                    disabled={true}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={Boolean(params.error)}
                        helperText={params.error ? '시작 날짜가 올바르지 않습니다.' : ''}
                      />
                    )}
                  /> 
                  </LocalizationProvider>    
              </Box>
              <Box sx={{ml:1, mr: 1}}>~</Box>
              <Box sx={{flex: 1}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}> 
                  <DatePicker
                    label="종료 날짜"
                    inputFormat="yyyy-MM-dd"
                    value={end}
                    onChange={handleEndChange}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={start && end && start > end}
                        helperText={start && end && start > end ? '종료 날짜는 시작 날짜보다 늦어야 합니다.' : ''}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            </Box>

          </DialogContent>
          {/* ------------------------------------------- */}
          {/* Action for dialog */}
          {/* ------------------------------------------- */}
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleClose}>취소</Button>

            
            <Button variant="contained" onClick={onDelay}>
              연기
            </Button>
          </DialogActions>
          {/* ------------------------------------------- */}
          {/* End Calendar */}
          {/* ------------------------------------------- */}
        </form>
      </Dialog>
      <Dialog open={showModal} onClose={onClose}>
        <DialogTitle></DialogTitle>
        <DialogContent sx={{width:300}} >
          <DialogContentText>{modalMsg}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { onClose(); }}>OK</Button>
        </DialogActions>
      </Dialog> 
      {/* ------------------------------------------- */}
      <Dialog open={checkOpen} onClose={handleCheckClose} fullWidth maxWidth="xs">
        <form>
          <DialogContent>
            {/* ------------------------------------------- */}
            {/* Add Edit title */}
            {/* ------------------------------------------- */}
            <Typography variant="h4" sx={{ mb: 2 }}>
              {checkMode == 'register' ? '현장점검 일정수립' : (checkMode == 'view' ? '현장점검 일정확인' : '현장점검 일정수정')}
            </Typography>

            
            <Typography variant="h6" sx={{ mb: 2 }}>
              {checkTitle}
            </Typography>

            {checkMode == 'view' ? (
              <Typography sx={{ mb: 2 }}>
                {getKoreanDateTime(checkDate)}
              </Typography>
            ) : (
              <Box sx={{mb:2}}>
                <LocalizationProvider dateAdapter={AdapterDateFns} locale={koLocale}> 
                  <DateTimePicker
                    label="점검 날짜"
                    inputFormat="yyyy-MM-dd HH:mm"
                    value={checkDate}
                    onChange={(val) => {setCheckDate(val)}}
                    renderInput={(params: any) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={Boolean(params.error)}
                        helperText={params.error ? '날짜가 올바르지 않습니다.' : ''}
                      />
                    )}
                  /> 
                </LocalizationProvider>  
              </Box>
            )}
  

            <Box sx={{display: 'flex', alignItems: 'center', mb:1}}>
              <Box sx={{width: 60}}>
                <Typography>
                  주소:
                </Typography>
              </Box>
              <Box sx={{flex: 1, display: 'flex'}}>
                {checkMode == 'view' ? (
                  <Typography>
                    {checkAddress}
                </Typography>
                ) : (
                <TextField
                  placeholder=""
                  size="small"
                  onChange={(e:any) => {setCheckAddress(e.target.value)}}
                  value={checkAddress}
                  sx={{flex: 1, mr:1}}
                />
                )}
              </Box>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', mb:1}}>
              <Box sx={{width: 60}}>
                <Typography>
                  담당자:
                </Typography>
              </Box>
              <Box sx={{flex: 1, display: 'flex'}}>
                {checkMode == 'view' ? (
                  <Typography>
                    {checkManager}
                </Typography>
                ) : (
                <TextField
                  placeholder=""
                  size="small"
                  onChange={(e:any) => {setCheckManager(e.target.value)}}
                  value={checkManager}
                  sx={{flex: 1, mr:1}}
                />
                )}
              </Box>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center'}}>
              <Box sx={{width: 60}}>
                <Typography>
                  연락처:
                </Typography>
              </Box>
              <Box sx={{flex: 1, display: 'flex'}}>
                {checkMode == 'view' ? (
                  <Typography>
                    {checkManagerPhone}
                </Typography>
                ) : (
                <TextField
                  placeholder=""
                  size="small"
                  onChange={(e:any) => {setCheckManagerPhone(e.target.value)}}
                  value={checkManagerPhone}
                  sx={{flex: 1, mr:1}}
                />
                )}
              </Box>
            </Box>

          </DialogContent>

          {checkMode != 'view' && 
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCheckClose}>취소</Button>

              <Button variant="contained" onClick={onSaveCheck}>
              저장
            </Button>
            
          </DialogActions>
          }

          {(checkMode == 'view' && (userData.type == 0 || userData.type == 3)) && 
          <DialogActions sx={{ p: 3 }}>

              <Button variant="contained" onClick={onEditCheck}>
              수정
              </Button>
            
          </DialogActions>
          }
        </form>
      </Dialog>

      <Dialog open={deleteModal} onClose={onCloseDeleteModal}>
          <DialogTitle>삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 일정연기부분을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseDeleteModal}>취소</Button>
            <Button onClick={handleDelete} color="error">삭제</Button>
          </DialogActions>
        </Dialog>
    </PageContainer>
  );
};



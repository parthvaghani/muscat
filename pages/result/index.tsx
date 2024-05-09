import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect'; 
const axios = require('axios');
import { API_URL } from '@pages/constant';
import React from 'react';
import { Box, Button, Grid, InputAdornment, MenuItem, TextField , Typography} from '@mui/material';  
import { IconSearch } from '@tabler/icons-react';
import CheckStatus from './components/CheckStatus';
import InnerSystemEnable from './components/InnerSystemEnable';
import RadialbarChart from './components/RadialBar';
import RetrustStatus from './components/RetrustStatus';
import ConsigneeWidget from './components/ConsigneeWidget';
import VerticalBarWidget from './components/VerticalBarWidget';
import HorizontalBarWidget from './components/HorizontalBarWidget';
import StatusAll from './StatusAll'
import Image from "next/image";
import StatusIndividual from './StatusIndividual';
import axiosPost from '@pages/axiosWrapper';
const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '점검 및 결과',
  },
];

export default function EcomProductList() {
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [year, setYear] = React.useState(0);
  const [years, setYears] = React.useState([]); 
  const [project_id, setProjectId] = React.useState(0);
  const [projectList, setProjectList] = React.useState([]);
  const [consignor, setConsignor] = React.useState(0);
  const [consignorList, setConsignorList] = React.useState([]);
  const [consignee, setConsignee] = React.useState(0);
  const [consigneeList, setConsigneeList] = React.useState([]);
  const [checklistData, setChecklistData] = React.useState([]);
 
  async function fetchProjectList() {
    try {
      const response = await axiosPost(`${API_URL}/project/List`, {
        year: year,
      });
      // setRows(response.data)
      setProjectList(response.data)
      if(response.data.length > 0)
         setProjectId(response.data[0].id)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async function fetchYears() {
    try {
      const response = await axiosPost(`${API_URL}/project/SearchItem`,{});
      setYears(response.data.years) 

      if (response.data.years.length)
        setYear(response.data.years[0])
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchConsignees() {
    try {
      const response = await axiosPost(`${API_URL}/project_detail/List`, {
        project_id: project_id
      });

      setConsigneeList(response.data)
      setConsignee(-1);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  React.useEffect(() => {
    fetchYears()
    
  }, []);

  React.useEffect(() => {
    fetchProjectList();
  }, [year])

  React.useEffect(() => {
    fetchConsignees();

    const project_data = projectList.find((x) => x.id == project_id);
    if (project_data) {
      setConsignorList([{
        id: project_data.company_id,
        name: project_data.company_name,
      }])  

      setConsignor(project_data.company_id)
    }
  }, [project_id])

  const [consigneeData, setConsigneeData] = React.useState(null);
  const [type, setType] = React.useState('none')
  const handleSearch = (event: any) => {
    if (year != 0 && project_id != 0 && consignor != 0) {
      if (consignee == -1) {
        setType('all');
      }
      else {
        setType('individual');
        let aa = consigneeList.find((x) => x.company_id == consignee)

        console.log(aa)
        setConsigneeData(consigneeList.find((x) => x.company_id == consignee))
      }
    }
  };
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="점검 및 결과" items={BCrumb} />
      <Box
          sx={{mb: 2, display: 'flex', alignItems: 'center'}}
        > 
          <Typography align='center' sx={{mr: 1}}>
            연도:
          </Typography> 
         <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={year}
          sx={{width:100, mr:2}}
          onChange = {(e:any) => {
            setYear(e.target.value);
          }}
        >
          {years.map((x, index) => {
            return (
              <MenuItem value={x} key = {index}>{x}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Typography align='center' sx={{mr: 1}}>
          프로젝트:
        </Typography> 
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={project_id}
          sx={{width:200, mr:2}}
          onChange = {(e:any) => {
            setProjectId(e.target.value);
          }}
        >
          {projectList.map((x:any, index: number) => {
            return (
              <MenuItem value={x.id} key = {index}>{x.name}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Typography align='center' sx={{mr: 1}}>
          위탁사:
        </Typography> 
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={consignor}
          sx={{width:200, mr:2}}
          onChange = {(e:any) => {
            setConsignor(e.target.value);
          }}
        >
          {consignorList.map((x:any, index: number) => {
            return (
              <MenuItem value={x.id} key = {index}>{x.name}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Typography align='center' sx={{mr: 1}}>
          수탁사:
        </Typography> 
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={consignee}
          sx={{width:200, mr:2}}
          onChange = {(e:any) => {
            setConsignee(e.target.value);
          }}
        >
          <MenuItem value={-1} key = {1000000}>전체</MenuItem>
          {consigneeList.map((x:any, index: number) => {
            return (
              <MenuItem value={x.company_id} key = {index}>{x.company_name}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Button
          variant={"contained"}
          color={"primary"}
          sx={{width:90, ml:1}}
          onClick = {handleSearch}
        >
          <IconSearch size="1.3rem" />
          조회
        </Button> 
      </Box>

      {
        type == 'individual' && <StatusIndividual consignor={consignorList.filter((x:any, index: number) => {
          return x.company_id == consignor;
        }).length > 0 ? consignorList.filter((x:any, index: number) => {
          return x.company_id == consignor;
        })[0].company_nam : '' } consigneeData={consigneeData}/>
      }
      {
        type == 'all' && <StatusAll consigneeList={consigneeList}  />
      }
       
    </PageContainer>
  );
};


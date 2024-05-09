/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { alpha } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow, 
  Toolbar,
  Typography, 
  TextField,
  InputAdornment,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar, 
} from '@mui/material';
import IconButton from '@mui/material/IconButton'; 
import { Cancel, Person } from '@mui/icons-material'; 
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import BlankCard from '@src/components/shared/BlankCard';
import { Stack } from '@mui/system';  
import DashboardCard from '@src/components/shared/DashboardCard';
import axios from "axios";
import {API_URL} from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';
import { IconSearch } from '@tabler/icons-react';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect'; 

const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '메모 발신 이력',
  },
]; 
 
 
export default function MemoTable() {
  const fetchMemos = async() => {
    const response = await axiosPost(`${API_URL}/memos/List`,{});
    setFilterDatas(response.data)
    setTotalDatas(response.data)
  }

  const fetchMemoDetails = async(memo_id : string) => {
    const response = await axiosPost(`${API_URL}/memo_details/List`,{memo_id : memo_id});
    setShowDetail(true);
    setSelectedMemo(response.data); 
  }
 
  const handleSearch1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.value == '전체'){
      setFilterDatas(totalDatas);
    }else{
      const datas = totalDatas.filter((row:any) => {
        return row.reason!.toString().toLowerCase().includes(event.target.value)
        && row.consignor_name!.toString().toLowerCase().includes(search2)
        && row.consignee_name!.toString().toLowerCase().includes(search3);
      });
      setFilterDatas(datas);
    }

    setSearch1(event.target.value);
    
  };
  const handleSearch2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const datas = totalDatas.filter((row:any) => {
      return row.reason!.toString().toLowerCase().includes(search1=='전체' ? '' : search1 )
      && row.consignor_name!.toString().toLowerCase().includes(event.target.value)
      && row.consignee_name!.toString().toLowerCase().includes(search3);
    });
    setSearch2(event.target.value);
    setFilterDatas(datas);
  };
  const handleSearch3 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const datas = totalDatas.filter((row:any) => {
      return row.reason!.toString().toLowerCase().includes(search1=='전체' ? '' : search1)
      && row.consignor_name!.toString().toLowerCase().includes(search2)
      && row.consignee_name!.toString().toLowerCase().includes(event.target.value);
    });
    setSearch3(event.target.value);
    setFilterDatas(datas);
  };
  React.useEffect(() => {
    fetchMemos(); 
  }, []);
  
  const [search1, setSearch1] = React.useState('전체'); 
  const [search2, setSearch2] = React.useState(''); 
  const [search3, setSearch3] = React.useState(''); 
  const [filterDatas, setFilterDatas] = React.useState([]); 
  const [totalDatas, setTotalDatas] = React.useState([]); 
  const [page, setPage] = React.useState(0); 
  const [rowsPerPage, setRowsPerPage] = React.useState(10); 
  const search_items = ['전체', '계약종료 확인 필요', '담당자 연락 불가', '점검 거부', '기타']; 
 
  const [showDetailInfo, setShowDetail] = React.useState(false);
  const [selectedMemo, setSelectedMemo] = React.useState<any[]>([]); 
  const handleShow = (event: React.MouseEvent<unknown>, data: any) => { 
    fetchMemoDetails ("1"); 
    
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
 

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filterDatas.length) : 0;

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="메모 발신 이력" items={BCrumb} />
       <Box sx={{ display:'flex', gap:3 }}>
        <BlankCard >
         
          <Box mb={2} sx={{ mb: 2 }}> 
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              bgcolor: (theme : any) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity), 
            }}
          >  
           <Typography sx={{ mr:1 }} color="inherit"  component="div">
                발신사유:
            </Typography>
            <CustomSelect
              labelId="month-dd"
              id="month-dd"
              size="small"
              value={search1}
              sx={{  width: 170,background:'white',  mr: 2 }}
              onChange={handleSearch1}
            >
              {search_items.map((x, index) => (
                <MenuItem value={x} key={index}>
                  {x}
                </MenuItem>
              ))}
            </CustomSelect>
            <Typography sx={{ mr:1  }} color="inherit"  component="div">
                위탁사 명:
            </Typography>
            <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="1.1rem" />
                    </InputAdornment>
                  ),
                  style: { backgroundColor: 'white' } 
                }} 
                size="small"
                sx={{mr:3}}
                onChange={handleSearch2}
                value={search2}
              /> 
            <Typography sx={{ mr:1 }} color="inherit"  component="div">
                수탁사 명:
            </Typography>
            <TextField
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconSearch size="1.1rem" />
                    </InputAdornment>
                  ),
                  style: { backgroundColor: 'white' } 
                }} 
                size="small"
                sx={{mr:3 }}
                onChange={handleSearch3}
                value={search3}
              /> 
          </Toolbar>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={  'medium'}
              > 
               <TableHead >
                <TableRow sx={{backgroundColor:'success'}}> 
                  <TableCell style={{ textAlign: 'center'}}>No</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>발신 사유</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>위탁사 명</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>수탁사 명</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>발신일</TableCell>
                  <TableCell style={{ textAlign: 'center'}}>상세</TableCell> 
                </TableRow>
              </TableHead>
                
                <TableBody> 
                {filterDatas
                    .map((row: any, index) => {
                      return (
                        <TableRow > 
                          <TableCell style={{ textAlign: 'center'}}> 
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                {row.id}
                              </Typography> 
                            </Box> 
                          </TableCell >
                          <TableCell style={{ textAlign: 'center'}}> 
                            <Box>
                              <Typography variant="h6" fontWeight="600">
                                {row.reason}
                              </Typography> 
                            </Box> 
                          </TableCell >
                          <TableCell style={{ textAlign: 'center'}}>
                            <Typography color="textSecondary" variant="subtitle2" fontWeight="400">
                              {row.consignor_name}
                            </Typography>
                          </TableCell> 
                          <TableCell style={{ textAlign: 'center'}}>
                            <Typography color="textSecondary" variant="subtitle2" fontWeight="400">
                              {row.consignee_name}
                            </Typography>
                          </TableCell>
                          <TableCell style={{ textAlign: 'center'}}> 
                              <Typography color="textSecondary" variant="body1">
                                {row.date}
                              </Typography> 
                          </TableCell>
                         
                          <TableCell style={{ textAlign: 'center'}}> 
                            <Button variant="text" color="error" sx={{  ml: 1 }} onClick={(event) => {handleShow(event,row)}}>
                            상세
                            </Button>
                          </TableCell>
                           
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (  53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filterDatas.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />     
          </Box>  
        </BlankCard> 
        {showDetailInfo && (
          <DashboardCard
            title="메모 상세 내용"
            action={
              <Box>
                <IconButton onClick={() => setShowDetail(false)} sx={{ mr: 1 }}>
                  <Cancel />
                </IconButton> 
              </Box>
            }
          >
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
            </Box>
            
          </DashboardCard>
        )} 
        </Box> 
    </PageContainer>
  );
};


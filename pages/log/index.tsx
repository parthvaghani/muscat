import React, { useState, useEffect } from 'react';
import axiosPost from '@pages/axiosWrapper';
import { Box, Button, Checkbox, Collapse, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, MenuItem, InputAdornment, Divider } from '@mui/material';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import { API_URL } from '@pages/constant';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { Row } from 'antd';
 

interface LogItem {
  category: string;
  api_name: string;
  ip_address: string;
  user_name: string;
  user_email: string;
  user_type: string;
  log_type: string;
  log_request: string;
  log_response: string;
  reg_date: string;
}

export default function LogPage() {
  const [logItems, setLogItems] = useState<LogItem[]>([]);
  const [totalItems, setTotalItems] = useState<LogItem[]>([]);
  const [searchItem, setSearchItem] = useState<string>('전체');
  const [searchName, setSearchName] = useState<string>('');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [filterOptions, setFilterOptions] = useState({
    userLogin: false,
    adminLogin: false,
    system: false,
    general: false,
    permission: false,
    accessLog: false
  });
  const selectRef = React.useRef(null);
  const handleCancelFilter = () => {
    if (selectRef.current) {
      selectRef.current.click(); // 드롭다운을 닫기 위해 CustomSelect를 클릭합니다.
    }
  };
  
  // 모든 필터 해제 버튼 클릭 시 모든 필터 옵션을 true로 설정
  const handleResetFilter = () => {
    setFilterOptions({
      userLogin: false,
      adminLogin: false,
      system: false,
      general: false,
      permission: false,
      accessLog: false
    });
  };

  const search_items = ['전체', 'API', '이름', '이메일', '접속 IP', '작업'];

  const fetchLogItems = async () => {
    try {
      const response = await axiosPost(`${API_URL}/system_log/List`, {});
      if (response.status === 200) {
        setTotalItems(response.data);
      } else {
        console.error('Failed to fetch log items');
      }
    } catch (error) {
      console.error('Error fetching log items:', error);
    }
  };

  useEffect(() => {
    fetchLogItems();
  }, []);

  const handleFilter = () => {
    let filteredItems = totalItems.filter((item: LogItem) => {
      if (!filterOptions.userLogin && item.log_type === '사용자 로그인') return false;
      if (!filterOptions.adminLogin && item.log_type === '관리자 로그인') return false;
      if (!filterOptions.system && item.log_type === '시스템') return false;
      if (!filterOptions.general && item.log_type === '일반') return false;
      if (!filterOptions.permission && item.log_type === '권한') return false;
      if (!filterOptions.accessLog && item.log_type === '접속기록') return false;
      return true;
    });

    if (searchItem === '전체') {
      setLogItems(filteredItems);
    } else if (searchItem === 'API') {
      setLogItems(filteredItems.filter((x: LogItem) => x.api_name.includes(searchName)));
    } else if (searchItem === '이름') {
      setLogItems(filteredItems.filter((x: LogItem) => x.user_name.includes(searchName)));
    } else if (searchItem === '이메일') {
      setLogItems(filteredItems.filter((x: LogItem) => x.user_email.includes(searchName)));
    } else if (searchItem === '접속 IP') {
      setLogItems(filteredItems.filter((x: LogItem) => x.ip_address.includes(searchName)));
    } else {
      setLogItems(filteredItems.filter((x: LogItem) => x.log_type.includes(searchName)));
    }
  };

  const handleFilterOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({ ...filterOptions, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Breadcrumb title="로그" items={[{ to: '/', title: '메인' }, { title: '로그' }]} />
        <TableContainer component={Paper}>
          <Box display="flex" alignItems="center">
            <CustomSelect
              labelId="month-dd"
              id="month-dd"
              size="small"
              value={searchItem}
              sx={{ width: 100, mr: 2 }}
              onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                setSearchItem(e.target.value as string);
              }}
            >
              {search_items.map((x, index) => (
                <MenuItem value={x} key={index}>
                  {x}
                </MenuItem>
              ))}
            </CustomSelect>
            <TextField
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size="1.1rem" />
                  </InputAdornment>
                )
              }}
              placeholder="검색"
              size="small"
              onChange={(e) => {
                setSearchName(e.target.value);
              }}
              value={searchName}
            />
            <CustomSelect
              labelId="filter-dd"
              id="filter-dd" 
              size="small"
              sx={{ width: 200, ml: 2 }}
              value="필터"
              ref={selectRef} 
            > 
            <MenuItem value="필터" hidden>
              필터
            </MenuItem>
              <Box>
                <Typography>구분</Typography>
                <Box display="flex" alignItems="center">
                  <Box display="block">
                    <Typography>
                      <Checkbox
                        checked={filterOptions.userLogin}
                        onChange={handleFilterOptionChange}
                        name="userLogin"
                      />{' '}
                      사용자 로그인
                    </Typography>
                    <Typography>
                      <Checkbox
                        checked={filterOptions.adminLogin}
                        onChange={handleFilterOptionChange}
                        name="adminLogin"
                      />{' '}
                      관리자 로그인
                    </Typography>
                    <Typography>
                      <Checkbox
                        checked={filterOptions.system}
                        onChange={handleFilterOptionChange}
                        name="system"
                      />{' '}
                      시스템
                    </Typography>
                    <Typography>
                      <Checkbox
                        checked={filterOptions.general}
                        onChange={handleFilterOptionChange}
                        name="general"
                      />{' '}
                      일반
                    </Typography>
                  </Box>
                  <Box ml={2} display="block">
                    <Typography>
                      <Checkbox
                        checked={filterOptions.permission}
                        onChange={handleFilterOptionChange}
                        name="permission"
                      />{' '}
                      권한
                    </Typography>
                    <Typography>
                      <Checkbox
                        checked={filterOptions.accessLog}
                        onChange={handleFilterOptionChange}
                        name="accessLog"
                      />{' '}
                      접속기록
                    </Typography>
                  </Box>
                </Box>
                <Divider sx={{ mt: 3 }} />
                <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{  mt: 1 }}>
                  <Button variant="text" color="error" sx={{  ml: 1 }} onClick={() => {handleResetFilter}}>
                    모든 필터 해제
                  </Button>
                  <Button variant="contained" color="error" sx={{  ml: 1 }} onClick={() => {handleCancelFilter}}>
                    취소
                  </Button>
                  <Button variant="contained" sx={{  ml: 1 }} onClick={handleFilter}>
                    확인
                  </Button>
                </Box>
              </Box>
            </CustomSelect>
          </Box>

          <Table>
            <TableHead sx={{ backgroundColor: 'success' }}>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>구분</TableCell>
                <TableCell>API</TableCell>
                <TableCell>계정</TableCell>
                <TableCell>계정 유형</TableCell>
                <TableCell>일시</TableCell>
                <TableCell>상세</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logItems.map((row, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell>{index}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell>{row.api_name}</TableCell>
                    <TableCell>{row.user_name}</TableCell>
                    <TableCell>
                      {row.user_type === '3'
                        ? '마스터관리자'
                        : row.user_type === '0'
                        ? '관리자'
                        : row.user_type === '1'
                        ? '수탁사'
                        : '위탁사'}
                    </TableCell>
                    <TableCell>{row.reg_date}</TableCell>
                    <TableCell>
                      <Fab
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setExpandedRow(expandedRow === index ? null : index);
                        }}
                      >
                        <IconPlus width={24} />
                      </Fab>
                    </TableCell>
                    <TableCell>{row.log_type}</TableCell>
                  </TableRow>
                  { <TableRow>
                  <TableCell colSpan={8}>
                      <Collapse in={expandedRow === index} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 2 }}>
                          <Typography>로그 요청: {row.log_request}</Typography>
                          <Typography>로그 응답: {row.log_response}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}

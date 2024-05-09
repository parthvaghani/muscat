import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  IconButton,
  Tooltip,
  FormControlLabel,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Button,
  MenuItem,
  CardContent,
  Dialog, DialogActions, DialogContent, DialogContentText,  DialogTitle
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons-react';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import BlankCard from '@src/components/shared/BlankCard';
import ProjectDetail from './ProjectDetail';
const axios = require('axios');
import { API_URL } from '@pages/constant';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from  "react-datepicker";
import CloseIcon from '@mui/icons-material/Close';
import ko from 'date-fns/locale/ko';
import axiosPost from '@pages/axiosWrapper';
registerLocale('ko', ko)

const CustomTableCell = (props: any) => {
  return (
    <TableCell {...props} sx={{padding:1.2}}>
    </TableCell>
  );
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'no',
    numeric: false,
    disablePadding: false,
    label: 'No',
  },
  {
    id: 'year',
    numeric: false,
    disablePadding: false,
    label: '연도',
  },

  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: '프로젝트 명',
  },
  {
    id: 'consignor',
    numeric: false,
    disablePadding: false,
    label: '위탁사 명',
  },
  {
    id: 'checklist_name',
    numeric: false,
    disablePadding: false,
    label: '체크리스트 명',
  },
  {
    id: 'privacy_type',
    numeric: false,
    disablePadding: false,
    label: '개인정보 취급 분류',
  },
  {
    id: 'consignee',
    numeric: false,
    disablePadding: false,
    label: '수탁사 현황',
  },
  {
    id: 'schedule',
    numeric: false,
    disablePadding: false,
    label: '일정',
  }
];

function EnhancedTableHead(props: any) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <CustomTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'center'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </CustomTableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


const EnhancedTableToolbar = (props: any) => {
  const { numSelected, setEditMode, rows } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
     
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          {numSelected} 건 선택됨
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
          총  {rows.length} 건
        </Typography>
      )} 
      <Button
        variant="contained"
        color="success" 
        sx={{width:150}}
        onClick={() => {setEditMode(true)}}
      >
            프로젝트 생성
      </Button> 
   
    </Toolbar>
  );
};


const ProductTableList = () => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('calories');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [year, setYear] = React.useState(0);
  const [years, setYears] = React.useState([]);
  const [projectNames, setProjectNames] = React.useState([]);
  const [companyName, setCompanyName] = React.useState('');
  const [checklist, setChecklist] = React.useState([]);
  const [personalCategory, setPersonalCategory] = React.useState([]);
  const [companyList, setCompanyList] = React.useState([]);

  let registerYears: number[] = [];
  const today = new Date();
  let y = [];
  for (let i = 0; i < 3; i++)
    registerYears.push(today.getFullYear() - i);

  async function fetchData() {
    try {
      const response = await axiosPost(`${API_URL}/project/List`, {
        year: searchYear,
        project_name: searchName,
        company_name: companyName
      });
      setRows(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async function fetchYears() {
    try {
      const response = await axiosPost(`${API_URL}/project/SearchItem`,{});
      setYears(response.data.years)
      setProjectNames(response.data.names)

      setSearchYear(0)
      setSearchName('!@#')
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchChecklist = async() => {
    try {
      const response = await axiosPost(`${API_URL}/checklist/List`,{});
      setChecklist(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchCompany = async() => {
    try {
      const response = await axiosPost(`${API_URL}/company/List`,{})
      setCompanyList(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const fetchPersonalCategory = async() => {
    try {
      const response = await axiosPost(`${API_URL}/personal_category/List`,{});
      setPersonalCategory(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  React.useEffect(() => {
    fetchYears()
    fetchData()
    fetchChecklist()
    fetchCompany()
    fetchPersonalCategory()
  }, []);


  const [rows, setRows] = React.useState<any>([]);

  const handleSearch = (event: any) => {
    fetchData()
  };

  // This is for the sorting
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [projectName, setProjectName] = React.useState('');
  const [searchYear, setSearchYear] = React.useState(0);
  const [searchName, setSearchName] = React.useState('');
  const [companyId, setCompanyId] = React.useState<any>(0);
  const [checkListId, setCheckListId] = React.useState(0);
  const [privacyPolicy, setPrivacyPolicy] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);

  const onRegister = async() => {
    if (projectName != '' && year != 0 && companyId != 0 && checkListId != 0 && privacyPolicy != 0) {
      let data = {
        'year': year,
        'name': projectName,
        'company_id': companyId,
        'checklist_id': checkListId,
        'privacy_type': privacyPolicy
      }

      const response = await axiosPost(`${API_URL}/project/Register`, data);
      fetchData()
      setEditMode(false)
    }
    else {
      setModalMsg('프로젝트명을 입력하세요.')
      setShowModal(true)
    }
    
  }

  React.useEffect(() => {
    setProjectName('');
    setYear(registerYears[0]);
    if (companyList.length > 0)
      setCompanyId(companyList[0].user_id);
    else setCompanyId(0);

    if (checklist.length > 0)
      setCheckListId(checklist[0].id); 
    else setCheckListId(0);

    if (personalCategory.length > 0)
      setPrivacyPolicy(personalCategory[0])
    else setCheckListId(0);

    if (personalCategory.length > 0)
      setPrivacyPolicy(personalCategory[0].id);
    else setPrivacyPolicy(0)
  }, [editMode])

  const [showModal, setShowModal] = React.useState(false)
  const [showScheduleModal, setShowScheduleModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')

  const [dd, setDD] = React.useState('')
  const [createFrom, setCreateFrom] = React.useState('')
  const [createTo, setCreateTo] = React.useState('')
  const [selfCheckFrom, setSelfCheckFrom] = React.useState('')
  const [selfCheckTo, setSelfCheckTo] = React.useState('')
  const [impCheckFrom, setImpCheckFrom] = React.useState('')
  const [impCheckTo, setImpCheckTo] = React.useState('')
  const [editId, setEditId] = React.useState(0)

  const showSchedule = async(id:any) => {
    setEditId(id)
    const response = await axiosPost(`${API_URL}/project/Schedule`, {
      id: id
    });
    

    let data = response.data.data
    setCreateFrom(data.create_from)
    setCreateTo(data.create_to)
    setSelfCheckFrom(data.self_check_from)
    setSelfCheckTo(data.self_check_to)
    setImpCheckFrom(data.imp_check_from)
    setImpCheckTo(data.imp_check_to)

    setShowScheduleModal(true)
  }

  const onClose = () => {
    setShowModal(false)
  }

  const onScheduleClose = () => {
    setShowScheduleModal(false)
  }

  const onSave = async() => {
    if (createFrom > createTo) {
      setModalMsg('계정생성 기간을 정확히 입력하세요.')
      setShowModal(true)
      return;
    }
    
    if (selfCheckFrom > selfCheckTo) {
      setModalMsg('자가점검 기간을 정확히 입력하세요.')
      setShowModal(true)
      return;
    }

    if (impCheckFrom > impCheckTo) {
      setModalMsg('이행점검 기간을 정확히 입력하세요.')
      setShowModal(true)
      return;
    }

    if (createTo >= selfCheckFrom) {
      setModalMsg('자가점검 시작날짜가 계정생성 마감날짜보다 앞서있습니다.')
      setShowModal(true)
      return;
    }

    if (selfCheckTo >= impCheckFrom) {
      setModalMsg('이행점검 시작날짜가 자가점검 마감날짜보다 앞서있습니다.')
      setShowModal(true)
      return;
    }

    const response = await axios.put(`${API_URL}/project/Schedule`, {
      id: editId,
      create_from: createFrom,
      create_to: createTo,
      self_check_from: selfCheckFrom,
      self_check_to: selfCheckTo,
      imp_check_from: impCheckFrom,
      imp_check_to: impCheckTo
    });

    if (response.data.result == 'SUCCESS') {
      setModalMsg('일정저장이 성공하였습니다.')
      setShowModal(true)
      setShowScheduleModal(false)
    }
    else {
      setModalMsg('일정저장이 실패하였습니다.')
      setShowModal(true)
    }
  }

  const [mode, setMode] = React.useState('List');
  const [currentProject, setCurrentProject] = React.useState({})
  
  return (
    <Box>
      { mode == 'List' ? (<>
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
          value={searchYear}
          sx={{width:100, mr:2}}
          onChange = {(e:any) => {
            setSearchYear(e.target.value);
          }}
        >
          <MenuItem value={0} key = {1000000}>전체</MenuItem>
          {years.map((x, index) => {
            return (
              <MenuItem value={x} key = {index}>{x}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Typography align='center' sx={{mr: 1}}>
          프로젝트 명:
        </Typography> 
        <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={searchName}
          sx={{width:200, mr:2}}
          onChange = {(e:any) => {
            setSearchName(e.target.value);
          }}
        >
          <MenuItem value={'!@#'} key = {1000000}>전체</MenuItem>
          {projectNames.map((x:any, index: number) => {
            return (
              <MenuItem value={x} key = {index}>{x}</MenuItem>
            );
          })

          }
        </CustomSelect>
        <Typography align='center' sx={{mr: 1}}>
          위탁사 명:
        </Typography> 
        <TextField
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size="1.1rem" />
                </InputAdornment>
              ),
            }}
            placeholder="검색"
            size="small"
            onChange={(e) => {
              setCompanyName(e.target.value)
            }}
            value={companyName}
        />
        <Button
          variant={"contained"}
          color={"primary"}
          sx={{width:60, ml:1}}
          onClick = {handleSearch}
        >
              조회
        </Button> 
      </Box>
        <BlankCard>
          <EnhancedTableToolbar
            numSelected={selected.length}
            handleSearch={(event: any) => handleSearch(event)}
            setEditMode={setEditMode}
            rows={rows}
          />
          <Paper variant="outlined" sx={{ mx: 2, mt: 1, border: `1px solid ${borderColor}` }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {editMode &&
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <CustomTableCell>
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={year}
                          sx={{width:100, mr:1}}
                          onChange={(e:any)=>setYear(e.target.value)}
                        >
                          {registerYears.map((x, i) => {
                            return (
                              <MenuItem value={x} key = {i}>{x}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>

                      <CustomTableCell>
                        <TextField
                          placeholder="프로젝트명"
                          size="small"
                          onChange={(e:any) => {setProjectName(e.target.value)}}
                          value={projectName}
                          sx={{width:150, mr:1}}
                        />
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={companyId}
                          sx={{width:150, mr:1}}
                          onChange={(e:any) => setCompanyId(e.target.value)}
                        >
                          {companyList.map((x, i) => {
                            return (
                              <MenuItem key={i} value={x.id}>{x.company_name}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={checkListId}
                          sx={{width:150, mr:1}}
                          onChange={(e:any) => setCheckListId(e.target.value)}
                        >
                          {checklist.map((x, i) => {
                            return (
                              <MenuItem key={i} value={x.id}>{x.checklist_item}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={privacyPolicy}
                          sx={{width:150, mr:1}}
                          onChange={(e:any) => setPrivacyPolicy(e.target.value)}
                        >
                          {personalCategory.map((x, i) => {
                            return (
                              <MenuItem key={i} value={x.id}>{x.personal_category}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>
                      <CustomTableCell>
                        <Box 
                          sx={{width: 100}}
                        >

                        </Box>
                      </CustomTableCell>
                      <CustomTableCell>
                      <Box 
                          sx={{width: 50}}
                        >

                        </Box>
                      </CustomTableCell>
                    </TableRow>
                  }
                  
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={index}
                        >

                          <CustomTableCell>
                            <Box display="flex" alignItems="center"> 
                              <Box
                                sx={{
                                  ml: 2,
                                }}
                              >
                                <Typography align='center'>
                                  {index + 1}
                                </Typography> 
                              </Box>
                            </Box>
                          </CustomTableCell>

                          <CustomTableCell>
                              <Typography align='center'>
                                {row.year}
                              </Typography> 
                          </CustomTableCell>

                          <CustomTableCell>
                            <Typography align='center'>{row.name}</Typography>
                          </CustomTableCell>

                          <CustomTableCell>
                            <Typography align='center'>
                              {row.company_name}
                            </Typography>
                          </CustomTableCell>

                          <CustomTableCell>
                          <Typography align='center'>
                              {row.checklist_name}
                            </Typography>
                          </CustomTableCell>

                          <CustomTableCell>
                            <Typography align='center'>
                              {row.privacy_type}
                            </Typography>
                          </CustomTableCell>

                          <CustomTableCell>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Button variant="contained" onClick={() => {
                                setCurrentProject(row)
                                setMode('Detail')
                              }}>
                                수탁사 현황
                              </Button>
                            </Box>
                            
                          </CustomTableCell>

                          <CustomTableCell>
                            <Box display={"flex"} justifyContent={"center"}>
                              <Button variant="contained" onClick={() => {showSchedule(row.id)}}>
                                일정
                              </Button>
                            </Box>
                          </CustomTableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <CustomTableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper> 
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginY: 1, mr: 2 }}>
            {editMode &&
            <Button variant="contained" onClick={onRegister}>
              저장
            </Button>

            }
          </Box>
        </BlankCard>
        <Dialog open={showModal} onClose={onClose}>
          <DialogTitle></DialogTitle>
          <DialogContent sx={{width:300}} >
            <DialogContentText>{modalMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { onClose(); }}>OK</Button>
          </DialogActions>
        </Dialog> 

        <Dialog open={showScheduleModal} onClose={onScheduleClose}>
          <Toolbar>
            <Typography sx={{ mr: 'auto' }} variant="h6" component="div">
              프로젝트 일정 설정
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onScheduleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <DialogContent >
            <Typography sx={{ mr: 'auto', mb:1 }} variant="h6" component="div">
              계정 생성 기간
            </Typography>
            <Box sx={{display: 'flex'}}>
              <input type={"date"} value={createFrom} onChange={(e:any) => setCreateFrom(e.target.value)}/>
              <Typography sx={{ ml:1, mr:1 }} variant="h6" component="div">
                ~
              </Typography>
              <input type={"date"} value={createTo} onChange={(e:any) => setCreateTo(e.target.value)}/>              
            </Box>
            <Typography sx={{ mt:2, mr: 'auto', mb:1 }} variant="h6" component="div">
              자가 점검 기간
            </Typography>
            <Box sx={{display: 'flex'}}>
              <input type={"date"} value={selfCheckFrom} onChange={(e:any) => setSelfCheckFrom(e.target.value)}/>
              <Typography sx={{ ml:1, mr:1 }} variant="h6" component="div">
                ~
              </Typography>
              <input type={"date"} value={selfCheckTo} onChange={(e:any) => setSelfCheckTo(e.target.value)}/>
            </Box>
            <Typography sx={{ mt:2, mr: 'auto', mb:1 }} variant="h6" component="div">
              이행점검 보완제출 기간
            </Typography>
            <Box sx={{display: 'flex'}}>
              <input type={"date"} value={impCheckFrom} onChange={(e:any) => setImpCheckFrom(e.target.value)}/>
              <Typography sx={{ ml:1, mr:1 }} variant="h6" component="div">
                ~
              </Typography>
              <input type={"date"} value={impCheckTo} onChange={(e:any) => setImpCheckTo(e.target.value)}/>              
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant={"contained"}
                    color={"primary"} 
                    onClick={() => { onSave(); }}>
              저장
            </Button>
          </DialogActions>
        </Dialog> 
        </>
        ):(
          <ProjectDetail setMode={setMode} data={currentProject}/>
        )}
    </Box>
  );
};

export default ProductTableList;

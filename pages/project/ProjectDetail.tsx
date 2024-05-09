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
  Typography, 
  TextField,
  InputAdornment,
  MenuItem,
  Paper,
  Button, 
  Dialog, DialogActions, DialogContent, DialogContentText,  DialogTitle
} from '@mui/material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch } from '@src/store/Store';
import { fetchCompanies   } from '@src/store/apps/CompanySlice';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox'; 
import {   IconSearch,   } from '@tabler/icons-react';
import { CompanyType } from '@src/types/apps/company'; 
import BlankCard from '@src/components/shared/BlankCard';
const axios = require('axios');
import { API_URL } from '@pages/constant';
import axiosPost,{axiosDelete} from '@pages/axiosWrapper';

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
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: '수탁사명',
  },
  {
    id: 'work_name',
    numeric: false,
    disablePadding: false,
    label: '위탁 업무',
  }, 
  {
    id: 'checker',
    numeric: false,
    disablePadding: false,
    label: '점검 담당자',
  }, 
  {
    id: 'check_type',
    numeric: false,
    disablePadding: false,
    label: '점검방식',
  }, 
];

interface CompaynyTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function CompanyTableHead(props: CompaynyTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: any) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <CustomCheckbox
            color="primary"
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
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
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface CompanyTableToolbarProps {
  numSelected: number;
  rows: any; 
}

const ProjectDetail = ({setMode, data}: {setMode:any, data:any}) => {
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [dense, setDense] = React.useState(false);
  const [companyList, setCompanyList] = React.useState([])
  const [adminList, setAdminList] = React.useState([])

  const [company, setCompany] = React.useState(0)
  const [workName, setWorkName] = React.useState('')
  const [checker, setChecker] = React.useState(0)
  const [checkType, setCheckType] = React.useState(0)

  const onRegister = async() => {
    if (editMode == 'register') {
      let response = await axiosPost(`${API_URL}/project_detail/Register`, {
        project_id: data.id,
        company_id: company,
        work_name: workName,
        checker_id: checker,
        check_type: checkType,
      });
  
      if (response.data.result == 'SUCCESS') {
        setModalMsg('정확히 저장되었습니다.')
        setShowModal(true)
        setEditMode('list')
        fetchData()
      }
      else {
        setModalMsg('저장이 실패하였습니다.' + response.data.error_message)
        setShowModal(true)
      }  
    }
    else if (editMode == 'edit') {
      let response = await axiosPost(`${API_URL}/project_detail/Update`, {
        id: editData.id,
        project_id: data.id,
        company_id: company,
        work_name: workName,
        checker_id: checker,
        check_type: checkType
      });
  
      if (response.data.result == 'SUCCESS') {
        setModalMsg('정확히 저장되었습니다.')
        setShowModal(true)
        setEditMode('list')
        fetchData()
      }
      else {
        setModalMsg('저장이 실패하였습니다.' + response.data.error_message)
        setShowModal(true)
      }  
    }
  }

  const fetchData = async() => {
    let response = await axiosPost(`${API_URL}/project_detail/List`, {
      project_id: data.id
    });
    setRows(response.data)
    
    response = await axiosPost(`${API_URL}/project/Users`,{});
    data = response.data

    setCompanyList(data.company)
    if (data.company.length > 0)
      setCompany(data.company[0].id)

    setAdminList(response.data.admin)
    if (data.admin.length > 0)
      setChecker(data.admin[0].user_id)
  }
  //Fetch Products
  React.useEffect(() => {
    fetchData();
    setMode('Detail')
  }, []);

  const [rows, setRows] = React.useState([]);

  // This is for the sorting
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n.id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };



  // This is for the single row sleect
  const handleClick = (event: React.MouseEvent<unknown>, num: string) => {
    const selectedIndex = selected.indexOf(num);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, num);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };


  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [editMode, setEditMode] = React.useState('list');
  const [editData, setEditData] = React.useState(null);

  const [deleteModal, setDeleteModal] = React.useState(false)

  const onDelete = () => {
    setDeleteModal(true)
  }

  const onCloseDeleteModal = () => {
    setDeleteModal(false)
  }

  const handleDelete = async() => {
    const response = await axiosDelete(`${API_URL}/project_detail/Delete`, {
      data: { str_ids: selected.join(",") }
    });

    if (response.data.result == 'SUCCESS') {
      setDeleteModal(false)
      setModalMsg('정확히 삭제되었습니다.');
      setShowModal(true)
      fetchData()

    }
    else {
      setModalMsg('삭제가 실패하였습니다.');
      setShowModal(true)
    }
  }

  const [showModal, setShowModal] = React.useState(false)
  const [modalMsg, setModalMsg] = React.useState('')
  const onClose = () => {
    setShowModal(false)
  }

  const onEdit = () => {
    if (editMode == 'edit') {
      setEditMode('list')
    }
    else if (selected.length == 1) {
      setEditMode('edit')

      let selectedData = rows.find((x) => x.id == selected[0])
      setEditData({...selectedData})

      setCompany(selectedData.company_id)
      setWorkName(selectedData.work_name)
      setChecker(selectedData.checker_id)
      setCheckType(selectedData.check_type)
    }
  }

  React.useEffect(() => {
    console.log(rows)
  }, [rows])
  
  const fileInputRef = React.useRef(null);
  const handleButtonClick = () => {
    fileInputRef.current.click();
  }
  const handleFileChange = async(e:any) => {
    const selectedFile = e.target.files[0];
    // 파일 선택이 완료된 후 추가 작업 수행
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('project_id', data.id);
  
    e.target.value = null;
    fetch(`${API_URL}/project_detail/RegisterExcel`, {
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
        setModalMsg('정확히 저장되었습니다.');
        setShowModal(true)
        fetchData()
      }
    })
    .catch(error => {
      console.error("Failed to register the notice:", error);
    });
  };

  return (
    <Box> 
          {/* <Button type="submit" color="success" variant="contained" sx={{width:150}}>조회</Button>  */}

          <Box
            sx={{mb: 2, display: 'flex', alignItems: 'center'}}
          > 
            <Typography align='center' sx={{mr: 1, fontSize: 16}}>
              연도:
            </Typography> 
            <Typography align='center' sx={{mr: 3, fontSize: 18, fontWieght: 'bold'}}>
              {data.year}
            </Typography> 
          <Typography align='center' sx={{mr: 1, fontSize: 16}}>
            프로젝트 명:
          </Typography> 
          <Typography align='center' sx={{mr: 3, fontSize: 18}}>
              {data.name}
            </Typography> 
          <Typography align='center' sx={{mr: 1, fontSize: 16}}>
            위탁사 명:
          </Typography> 
          <Typography align='center' sx={{mr: 3, fontSize: 18}}>
            {data.company_name}
          </Typography> 

          <Button variant="contained" sx={{ml: 'auto'}}onClick={() => setMode('List')}>
              목록
            </Button>
        </Box>
        <BlankCard> 
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
              bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              ...(selected.length > 0 && {
                bgcolor: (theme) =>
                  alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
              }),
            }}
          >
          
            {selected.length > 0 ? (
              <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
                {selected.length} 건 선택됨
              </Typography>
            ) : (
              <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
                수탁사 총 {rows.length}개사
              </Typography>
            )} 
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{display: 'none'}}/>
            <Button
              variant="contained"
              color="primary" 
              sx={{width:150}}
              onClick={handleButtonClick}
            >
              엑셀 업로드
            </Button> 

            <Button
              variant="contained"
              color="primary" 
              sx={{width:80, ml:1}}
              onClick={() => {
                if (editMode == 'register')
                  setEditMode('list')
                else setEditMode('register')
              }}
            >
              추가
            </Button> 

            <Button
              variant="contained"
              color="primary" 
              sx={{width:80, ml: 1}}
              onClick={onEdit}
            >
              수정
            </Button> 

            <Button
              variant="contained"
              color="primary" 
              sx={{width:80, ml: 1}}
              onClick={onDelete}
            >
              삭제
            </Button> 
          </Toolbar>
          <Paper variant="outlined" sx={{ mx: 2, my: 1, border: `1px solid ${borderColor}` }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? 'small' : 'medium'}
              >
                <CompanyTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                {editMode == 'register' &&
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                    >
                      <CustomTableCell>
                      </CustomTableCell>
                      <CustomTableCell>
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={company}
                          sx={{width:150, mr:1}}
                          onChange={(e:any)=>setCompany(e.target.value)}
                        >
                          {companyList.map((x, i) => {
                            console.log(x)
                            return (
                              <MenuItem value={x.id} key = {i}>{x.name}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>

                      <CustomTableCell>
                        <TextField
                          placeholder="위탁 업무"
                          size="small"
                          onChange={(e:any) => {setWorkName(e.target.value)}}
                          value={workName}
                          sx={{width:150, mr:1}}
                        />
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={checker}
                          sx={{width:100, mr:1}}
                          onChange={(e:any)=>setChecker(e.target.value)}
                        >
                          {adminList.map((x, i) => {
                            return (
                              <MenuItem value={x.user_id} key = {i}>{x.name}</MenuItem>
                            );
                          })}
                        </CustomSelect>
                      </CustomTableCell>

                      <CustomTableCell>
                        <CustomSelect
                          labelId="month-dd"
                          id="month-dd"
                          size="small" 
                          value={checkType}
                          sx={{width:150, mr:1}}
                          onChange={(e:any) => setCheckType(e.target.value)}
                        >
                          <MenuItem value={0}>서면</MenuItem>
                          <MenuItem value={1}>현장</MenuItem>
                        </CustomSelect>
                      </CustomTableCell>

                    </TableRow>
                  }
                  {stableSort(rows, getComparator(order, orderBy))
                    .map((row: any, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      if (editMode != 'edit' || row.id != editData?.id)
                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.id}
                            selected={isItemSelected}
                          >
                            <CustomTableCell padding="checkbox">
                              <CustomCheckbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </CustomTableCell>

                            <CustomTableCell>
                              <Box display="flex" alignItems="center"> 
                                <Box
                                  sx={{
                                    ml: 2,
                                  }}
                                >
                                  <Typography variant="h6" fontWeight="600">
                                    {index + 1}
                                  </Typography> 
                                </Box>
                              </Box>
                            </CustomTableCell>
                                  
                            <CustomTableCell>
                              <Box display="flex" alignItems="center"> 
                                <Box
                                  sx={{
                                    ml: 2,
                                  }}
                                >
                                  <Typography variant="h6" fontWeight="600">
                                    {row.company_name}
                                  </Typography> 
                                </Box>
                              </Box>
                            </CustomTableCell>
                            <CustomTableCell>
                                <Typography variant="h6" fontWeight="600">
                                  {row.work_name}
                                </Typography>  
                            </CustomTableCell> 
                            <CustomTableCell>
                                <Typography variant="h6" fontWeight="600">
                                  {row.checker_name}
                                </Typography>  
                            </CustomTableCell> 

                            <CustomTableCell>
                                <Typography variant="h6" fontWeight="600">
                                  {row.check_type == 1 ? '현장' : '서면'}
                                </Typography>  
                            </CustomTableCell> 
                          </TableRow>
                        );
                      else {
                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            tabIndex={-1}
                            key={row.id}
                          >
                            <CustomTableCell>
                            </CustomTableCell>
                            <CustomTableCell>
                            </CustomTableCell>
      
                            <CustomTableCell>
                              <CustomSelect
                                labelId="month-dd"
                                id="month-dd"
                                size="small" 
                                value={company}
                                sx={{width:150, mr:1}}
                                onChange={(e:any)=>setCompany(e.target.value)}
                              >
                                {companyList.map((x, i) => {
                                  console.log('-----------')
                                  console.log(x)
                                  return (
                                    <MenuItem value={x.id} key = {i}>{x.name}</MenuItem>
                                  );
                                })}
                              </CustomSelect>
                            </CustomTableCell>
      
                            <CustomTableCell>
                              <TextField
                                placeholder="위탁 업무"
                                size="small"
                                onChange={(e:any) => {setWorkName(e.target.value)}}
                                value={workName}
                                sx={{width:150, mr:1}}
                              />
                            </CustomTableCell>
      
                            <CustomTableCell>
                              <CustomSelect
                                labelId="month-dd"
                                id="month-dd"
                                size="small" 
                                value={checker}
                                sx={{width:100, mr:1}}
                                onChange={(e:any)=>setChecker(e.target.value)}
                              >
                                {adminList.map((x, i) => {
                                  return (
                                    <MenuItem value={x.user_id} key = {i}>{x.name}</MenuItem>
                                  );
                                })}
                              </CustomSelect>
                            </CustomTableCell>
      
                            <CustomTableCell>
                              <CustomSelect
                                labelId="month-dd"
                                id="month-dd"
                                size="small" 
                                value={checkType}
                                sx={{width:150, mr:1}}
                                onChange={(e:any) => setCheckType(e.target.value)}
                              >
                                <MenuItem value={0}>서면</MenuItem>
                                <MenuItem value={1}>현장</MenuItem>
                              </CustomSelect>
                            </CustomTableCell>
      
                          </TableRow>
                        )
                      }
                    })}
                  
                </TableBody>
              </Table>
            </TableContainer>
          </Paper> 
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginY: 1, mr: 2 }}>
            {editMode != 'list' &&
            <Button variant="contained" onClick={onRegister}>
              저장
            </Button>

            }
          </Box>
        </BlankCard> 
        <Dialog open={deleteModal} onClose={onCloseDeleteModal}>
          <DialogTitle>삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 수탁사들을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onCloseDeleteModal}>취소</Button>
            <Button onClick={handleDelete} color="error">삭제</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={showModal} onClose={onClose}>
          <DialogTitle></DialogTitle>
          <DialogContent sx={{width:400}} >
            <DialogContentText sx={{wordWrap:'break-word', whiteSpace:'break-spaces'}}>{modalMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { onClose(); }}>OK</Button>
          </DialogActions>
        </Dialog> 
    </Box>
  );
};

export default ProjectDetail;

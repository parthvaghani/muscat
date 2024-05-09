import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Paper,
  Button,
  MenuItem,
  CardContent,
} from '@mui/material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch, AppDispatch } from '@src/store/Store';
import { deleteNotices } from '@src/store/apps/NoticeSlice';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox';
import { IconDotsVertical, IconFilter, IconSearch, IconTrash } from '@tabler/icons-react';
import { NoticeType } from '@src/types/apps/notice';
import BlankCard from '@src/components/shared/BlankCard';
import Link from 'next/link';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';

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
    id: 'ao',
    numeric: false,
    disablePadding: false,
    label: 'No',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: '분류(프로젝트 명)',
  },
  {
    id: 'pname',
    numeric: false,
    disablePadding: false,
    label: '제목',
  },

  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: '작성자',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: '작성일',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: '조회수',
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  

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


const NoticeList = () => { 
  const [open, setOpen] = React.useState<boolean>(false);
  const [projects, setProjects] = React.useState([]) 
  const [notice, setNotice] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const fetchProjectsByConsignee = async (id:any, notices:any) => {
    const response = await axiosPost(`${API_URL}/project/List`, {
      consignee_id: id, 
    }); 
    const projects = response.data;  
    setProjects(projects);  
    const noticeFilter = notices.filter((x:any) => projects.some((project:any) => project.project_id === x.project_id || '전체' === x.project_name));
    console.log(noticeFilter) 
    setNotice(noticeFilter);
  };
  const fetchProjectsByConsignor = async (id:any, notices:any) => { 
    const response = await axiosPost(`${API_URL}/project/List`, { 
      consignor_id: id
    }); 
    const projects = response.data;  
    setProjects(projects);  
    const noticeFilter = notices.filter((x:any) => projects.some((project:any) => project.project_id === x.project_id || '전체' === x.project_name));
    console.log(noticeFilter) 
    setNotice(noticeFilter);
  };

    //Fetch Products
    React.useEffect(() => {
      
      fetchNotices()
    }, []); 
  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false); 
    setSelected([]);
  };
  const dispatch: AppDispatch = useDispatch(); 

  const handleDelete = (): void => {
    if (selected.join(',').length > 0) {
      dispatch(deleteNotices(selected.join(',')))
        .unwrap()
        .then(() => {
          console.log("Companies successfully deleted");
          fetchNotices();
          handleClose();
        })
        .catch((error: any) => {
          console.error("Failed to delete companies:", error);
        });
    }
  };

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchType, setSearchType] = React.useState(1);
  const [keyword, setKeyword] = React.useState('');
  const [isMaster, setIsMaster] = React.useState(false) ;
 
  const fetchNotices = async() => {
    const response = await axiosPost(`${API_URL}/notice/List`, {
      search_type: searchType,
      keyword: keyword
    });
    
    const str = sessionStorage.getItem('user')
    let data = JSON.parse(str); 
    if (data.type == 1) {
      fetchProjectsByConsignee(data.user_id, response.data)
    } else if (data.type == 2 ) {
      fetchProjectsByConsignor(data.user_id, response.data)
    } else{
      setIsMaster(true)
      setNotice(response.data)
    }
  }


  const handleSearch = () => {
    fetchNotices()
  };

  // This is for the sorting
  const handleRequestSort = (event: React.MouseEvent<unknown>, property: any) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // This is for select all the row
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = notice.map((n: any) => n.id.toString());
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  // This is for the single row sleect
  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id.toString());
    let newSelected:   string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id.toString());
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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: number) => selected.indexOf(name.toString()) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - notice.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Box>
      <CustomSelect
          labelId="month-dd"
          id="month-dd"
          size="small" 
          value={searchType}
          onChange = {(e:any) => setSearchType(e.target.value)} 
          sx={{width:200, mr:1,mb:2}}
        >
          <MenuItem value={1}>제목</MenuItem>
          <MenuItem value={2}>제목+내용</MenuItem>
          <MenuItem value={3}>작성자</MenuItem>
        </CustomSelect>
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
            value={keyword}
            onChange = {(e) => setKeyword(e.target.value)} 
          />
          <Button
              onClick={handleSearch}
              variant="contained"
              color="primary" 
              sx={{width:60, ml:1}}
            >
              검색
        </Button> 
     
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
            총  {notice.length} 건
          </Typography>
        )}  
        
        {isMaster &&<Button variant="contained" color="error"  sx={{width:100, mr:1}} onClick={handleClickOpen} disabled={selected.length === 0}>
          삭제
        </Button>
        }
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>업체 삭제</DialogTitle>
          <DialogContent>
            <DialogContentText>
              선택한 업체들을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>취소</Button>
            <Button onClick={handleDelete} color="error">삭제</Button>
          </DialogActions>
        </Dialog>

        {isMaster &&  <Button
              component={Link}
              href="/noticelist/notice-create"
              variant="contained"
              color="success" 
              sx={{width:100}}
            >
              글 작성
        </Button> }
    
      </Toolbar>
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
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={notice.length}
                />
                <TableBody>
                  {stableSort(notice, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index) => {
                      const isItemSelected = isSelected(row.id);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <CustomCheckbox
                              onClick={(event) => handleClick(event, row.id)}
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>

                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Box
                                sx={{
                                  ml: 2,
                                }}
                              >
                                <Typography variant="h6" fontWeight="600">
                                  {index+1}
                                </Typography> 
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                color="textSecondary"
                                variant="subtitle2"
                                sx={{ ml: 1, cursor: 'pointer' }} 
                              >
                                {row.project_name  }
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                color="textSecondary"
                                variant="subtitle2"
                                sx={{  cursor: 'pointer', borderBottom:'1px solid black' }}
                                component={Link}
                                href={`/noticelist/notice-edit?id=${row.id}`}
                              >
                                {row.title  }
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                          <Typography>{row.create_by}</Typography>
                            
                          </TableCell>
                          <TableCell>
                          <Typography fontWeight={600} variant="h6">
                              {row.create_time}
                            </Typography>
                          </TableCell>
                          <TableCell>
                              <Typography variant="h6" fontWeight="600">
                                {row.views}
                              </Typography>  
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
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
              count={notice.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper> 
        </BlankCard> 
      
    </Box>
  );
};

export default NoticeList;

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
  Paper,
  Button, 
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useSelector, useDispatch } from '@src/store/Store';
import { fetchCompanies   } from '@src/store/apps/CompanySlice';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox'; 
import {   IconSearch,   } from '@tabler/icons-react';
import { CompanyType } from '@src/types/apps/company'; 
import BlankCard from '@src/components/shared/BlankCard';
import AddCompany from './AddCompany';
import DeleteCompanies from './DeleteCompanies';

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
    label: '사업자 번호',
  },
  {
    id: 'pname',
    numeric: false,
    disablePadding: false,
    label: '업체 명',
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
 

const CompanyList = ({ handleCompanySelect  }: { handleCompanySelect :  (registerNum:string) => void }) => { 
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('calories');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [selectedRegisterNum, setSelectedRegisterNum] = React.useState('');

  const dispatch = useDispatch();
  const [isMaster, setIsMaster] = React.useState(true)
  //Fetch Products
  React.useEffect(() => {
    dispatch(fetchCompanies());
    const str = sessionStorage.getItem('user')
    const type = JSON.parse(str).type
    if (type == 3) {
      setIsMaster(true) 
      setSelectedRegisterNum('000-00-00000')
    }
    else {
      setIsMaster(false) 
    }
  }, [dispatch]);

  const getCompanies: CompanyType[] = useSelector((state) => state.companyReducer.companies);

  const [rows, setRows] = React.useState<any>(getCompanies);
 
  React.useEffect(() => {
    setRows(getCompanies);
  }, [getCompanies]);

 
  const [companyNameSearch, setCompanyNameSearch] = React.useState('');
  const [registrationNumberSearch, setRegistrationNumberSearch] = React.useState('');


  // 기존 handleSearch 함수 수정
  const handleCompanyNameSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredRows: CompanyType[] = getCompanies.filter((row) => {
      return row.company_name.toLowerCase().includes(event.target.value);
      // || row.register_num.includes(searchQuery);
    });
    setCompanyNameSearch(event.target.value);
    setRows(filteredRows);
  };

  const handleRegistrationNumberSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredRows: CompanyType[] = getCompanies.filter((row) => {
      return row.register_num.toLowerCase().includes(event.target.value);
    });
    setRegistrationNumberSearch(event.target.value);
    setRows(filteredRows);
  };
  const handleRegisterNumClick = (registerNum : string) => {
    handleCompanySelect(registerNum);
    setSelectedRegisterNum(registerNum); 
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

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;


  
  
  return (
    <Box> 
          {/* <Button type="submit" color="success" variant="contained" sx={{width:150}}>조회</Button>  */}
       
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
                총  {rows.length} 건
              </Typography>
            )} 
            <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size="1.1rem" />
                      </InputAdornment>
                    ),
                    style: { backgroundColor: 'white' } 
                  }}
                  placeholder="업체명"
                  size="small"
                  sx={{mr:1,width:300 }}
                  onChange={handleCompanyNameSearch}
                  value={companyNameSearch}
                />
                <TextField
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconSearch size="1.1rem" />
                      </InputAdornment>
                    ),
                    style: { backgroundColor: 'white' } 
                  }}
                  placeholder="사업자번호"
                  size="small" 
                  sx={{ mr: 1, width: 300,   }} // 배경색을 흰색으로 설정
                  onChange={handleRegistrationNumberSearch}
                  value={registrationNumberSearch}
                />

            <DeleteCompanies selectedCompanyIds={selected.join(',')} onClose={()=>{setSelected([])}}/>
            <AddCompany   onClose={()=>{dispatch(fetchCompanies());}} />
        
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
                    { isMaster && (<TableRow
                          hover 
                          role="checkbox" 
                          tabIndex={-1}
                          key={-1} 
                        >
                          <TableCell padding="checkbox">
                           
                          </TableCell>

                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Box
                                sx={{
                                  ml: 2,
                                }}
                              >
                                <Typography variant="h6" fontWeight="600">
                                  1
                                </Typography> 
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                  key={-1}
                                  sx={{
                                    ml: 1,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid black',
                                    color: selectedRegisterNum === '000-00-00000' ? 'blue' : 'black',
                                  }}
                                  variant="h6"
                                  fontWeight="600"
                                  onClick={() => handleRegisterNumClick('000-00-00000')}
                                >
                                000-00-00000
                              </Typography>  
                              </Box>
                          </TableCell> 
                          <TableCell>
                              <Typography variant="h6" fontWeight="600">
                                주(머스캣)
                              </Typography>  
                          </TableCell>  
                        </TableRow>)}
                  {stableSort(rows, getComparator(order, orderBy))
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
                                  {isMaster?index*page+1:index}
                                </Typography> 
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                  key={row.id}
                                  sx={{
                                    ml: 1,
                                    cursor: 'pointer',
                                    borderBottom: '1px solid black',
                                    color: selectedRegisterNum === row.register_num ? 'blue' : 'black',
                                  }}
                                  variant="h6"
                                  fontWeight="600"
                                  onClick={() => handleRegisterNumClick(row.register_num)}
                                >
                                {row.register_num}
                              </Typography>  
                              </Box>
                          </TableCell> 
                          <TableCell>
                              <Typography variant="h6" fontWeight="600">
                                {row.company_name}
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
              count={rows.length}
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

export default CompanyList;

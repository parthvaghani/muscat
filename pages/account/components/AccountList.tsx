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
  Paper,
  Button, 
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils'; 
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox'; 
import {  IconSearch,   } from '@tabler/icons-react'; 
import BlankCard from '@src/components/shared/BlankCard';
import Link from 'next/link';
import DeleteUser from './DeleteUser';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';
 

interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

const headCells:  HeadCell[] = [
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
    label: '계정 유형',
  },
  {
    id: 'company_name',
    numeric: false,
    disablePadding: false,
    label: '업체명',
  },
  
  {
    id: 'pname',
    numeric: false,
    disablePadding: false,
    label: '계정',
  },

  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: '이름',
  },
  {
    id: 'price',
    numeric: false,
    disablePadding: false,
    label: '사용 여부',
  },
  {
    id: 'action',
    numeric: false,
    disablePadding: false,
    label: '최근 접속 시간',
  },
];

interface EnhancedTableProps {
  numSelected: number; 
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void; 
  rowCount: number;
} 

 


const AccountList = ({ register_num }: { register_num: string }) => {  
  const [isMaster, setIsMaster] = React.useState(false);  
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick,   numSelected, rowCount } = props; 
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
            (!search && headCell.id=="company_name") ? null :
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'} 
            >
              <TableSortLabel 
                 
              >
                {headCell.label} 
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }
 
  const fetchUsers = async() => {
    const str = sessionStorage.getItem('user')
    const type = JSON.parse(str).type
    if (type == 3)
      setIsMaster(true)
    else setIsMaster(false)

    const response = await axiosPost(`${API_URL}/user/List`,{});

    console.log(type)
    let data = response.data
    if (type != 3) {
      data = response.data.filter((x:any) => x.user_type != 0)

      console.log(data)
    }
    setAccounts(data)
    data = data.filter((x:any) => x.register_num === register_num); 
    setRows(data)
  }
  React.useEffect(() => {
    if (register_num) { 
      console.log(accounts)
      const data = accounts.filter((x:any) => x.register_num === register_num); 
      setRows(data)
      setSearch('');
    } 
  }, [register_num]);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const [rows, setRows] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [search, setSearch] = React.useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filteredAccounts = accounts.filter((row:any) => {
      return row.user_email!.toString().toLowerCase().includes(event.target.value);
    });
    setSearch(event.target.value);
    setRows(filteredAccounts);
  };

  

  // This is for select all the row
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n: any) => n.user_id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  // This is for the single row sleect
  const handleClick = (event: React.MouseEvent<unknown>, id: string | number) => {
    const selectedIndex = selected.indexOf(id.toString());
    let newSelected:  string[] = [];

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
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const typeName= ['어드민', '수탁사', '위탁사']

  return (
    <Box>
      <Divider sx={{ mt: 3 }}/>
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
              <Typography sx={{ flex: '1 1 100%' }} color="inherit"  component="div">
                {selected.length} 건 선택됨
              </Typography>
            ) : (
              <Typography sx={{ flex: '1 1 100%' }} color="inherit"  component="div">
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
                placeholder="계정명"
                size="small"
                sx={{mr:3}}
                onChange={handleSearch}
                value={search}
              />

            <DeleteUser selectedUserIds={selected.join(',')} onClose={()=>{
              fetchUsers()
              setSelected([])
              }}/>
            
            <Button component={Link}
                  href="/account/account-create" color="primary" variant="contained" sx={{width:150}}
            >계정 등록</Button> 
        
          </Toolbar>
          <Paper variant="outlined" sx={{ mx: 2, my: 1, border: `1px solid ${borderColor}` }}>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tablenickname"
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length} 
                  onSelectAllClick={handleSelectAllClick} 
                  rowCount={rows.length}
                />
                <TableBody>
                  {rows
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row: any, index) => {
                      const isItemSelected = isSelected(row.user_id); 
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.user_id}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <CustomCheckbox
                              color="primary"
                              onClick={(event) => handleClick(event, row.user_id)}
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
                              <Box
                                sx={{
                                  ml: 2,
                                }}
                              >
                                <Typography variant="h6" fontWeight="600">
                                  {typeName[row.user_type]}
                                </Typography> 
                              </Box>
                            </Box>
                          </TableCell>
                          {search && <TableCell>
                            <Typography fontWeight={600} variant="h6">
                              {row.company_name}  
                            </Typography> 
                          </TableCell>}
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                component={Link}
                                sx={{  ml: 1, cursor: 'pointer', borderBottom:'1px solid black' }} variant="h6" fontWeight="600"
                                href={`/account/account-detail?id=${row.user_id}`}
                              >
                                {row.user_email}
                              </Typography> 
                              </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center"> 
                              <Typography
                                color="textSecondary"   
                              >
                                {(row.user_type == 0 || row.user_type == 3) ? row.admin_name : row.manager_name}
                              </Typography>
                            </Box>
                          </TableCell>

                          <TableCell>
                          {/* <Typography>{format(new Date(row.manager_grade), 'E, MMM d yyyy')}</Typography> */}
                          {row.approval==0?'미사용':'사용'  }
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight={600} variant="h6">
                                {row.access_time}  
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

export default AccountList;

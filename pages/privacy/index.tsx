import React, { useState, useEffect } from 'react';
import axiosPost,{axiosDelete} from '@pages/axiosWrapper';
import {  Box, Button,  Checkbox,  Dialog,  DialogActions,  DialogContent,  DialogTitle,  IconButton,   Paper,  Table,  TableBody,  TableCell,  TableContainer, TableHead, TableRow,  TextField,  Toolbar,  Typography,} from '@mui/material'; 
import { IconCheck, IconX } from '@tabler/icons-react';
import { API_URL } from '@pages/constant';
import { alpha, useTheme } from '@mui/material/styles'; 
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PrivacyInfoTable from '@pages/privacy-info'; 
interface PrivacyItem {
  id: number;
  personal_category: string;
  description: string;
}
export default function PrivacyItemManagement() {
  const [privacyItems, setPrivacyItems] = useState<PrivacyItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [newItem, setNewItem] = useState<{ personal_category: string; description: string }>({ personal_category: '', description: '' });
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);
  const [selectPrivacyItem, setSelectPrivacyItem] = useState<PrivacyItem>();

  const handleAddItemToggle = () => {
    setIsAddingNewItem(!isAddingNewItem);
    setNewItem({ personal_category: '', description: '' }); // 새 항목 입력 필드 초기화
  };
  // 서버로부터 모든 개인정보 항목을 불러오는 함수
  const fetchPrivacyItems = async () => {
    try {
      const response = await axiosPost(`${API_URL}/personal_category/List`,{});
      if (response.status === 200) {
        setPrivacyItems(response.data);
        setIsAddingNewItem(false);
        setNewItem({ personal_category: '', description: '' }); // 입력 필드 초기화 
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchPrivacyItems();
  }, []);

  // 새 개인정보 항목을 추가하는 함수
  const handleAddItem = async () => {
    if (!newItem.personal_category || !newItem.description) {
      alert('제목과 설명을 모두 입력해주세요.');
      return;
    }
    
    try {
      const response = await axiosPost(`${API_URL}/personal_category/Register`, newItem);
      if (response.status === 200) {
        fetchPrivacyItems(); // 성공 후 목록 새로고침
        
        
      } else {
        console.error('Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  // 선택된 개인정보 항목들을 삭제하는 함수
  const handleDeleteSelectedItems = async () => {
    try {
      const response = await axiosDelete(`${API_URL}/personal_category/Delete`, { data:{id: selected.join(',')}  });
      if (response.status === 200) {
        fetchPrivacyItems(); // 성공 후 목록 새로고침
        setSelected([]);
        setDeleteDialogOpen(false)
      } else {
        console.error('Failed to delete items');
      }
    } catch (error) {
      console.error('Error deleting items:', error);
    }
  };
  const openDeleteDialog = () => {
    if (selected.length > 0) {
      setDeleteDialogOpen(true);
    }
  };
  const cancelNewRow = () => { 
    setIsAddingNewItem(false);
    setNewItem({ personal_category: '', description: '' }); // Reset new row data
  };
  const handleSaveNewItem = async () => {
    if (!newItem.personal_category || !newItem.description) {
      alert('제목과 설명을 모두 입력해주세요.');
      return;
    }
    handleAddItem();  
  };
  // 모든 항목 선택/해제
  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = privacyItems.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  // 개별 항목 선택/해제
  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected : any = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex >= 0) {
      newSelected = newSelected.filter((selectedId: any) => selectedId !== id);
    }

    setSelected(newSelected);
  };

  return (
    <>
    {showPrivacyInfo==false ? 
    <Box sx={{ width: '100%' }}>
      <Breadcrumb title="개인정보 항목 관리" items={[{
            to: '/',
            title: '메인',
          },
          {
            title: '개인정보 항목 관리',
          }]} />
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
            총  {privacyItems.length} 건
          </Typography>
        )} 
        
        <Button variant="outlined" color="error" onClick={openDeleteDialog} sx={{ mr: 1 }}>
          삭제
        </Button>
        <Button variant="contained" onClick={handleAddItemToggle}>추가</Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < privacyItems.length}
                  checked={privacyItems.length > 0 && selected.length === privacyItems.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>설명</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
             {isAddingNewItem && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>새 항목</TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newItem.personal_category}
                    onChange={(e) => setNewItem({ ...newItem, personal_category: e.target.value })}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </TableCell> 
                <TableCell align="right">
                  <IconButton onClick={handleSaveNewItem}>
                    <IconCheck />
                  </IconButton>
                  <IconButton onClick={cancelNewRow}>
                    <IconX />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {privacyItems.map((row, index) => {
              const isItemSelected = selected.indexOf(row.id) !== -1;
              return (
                <TableRow
                  key={row.id}
                  hover
                  
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  selected={isItemSelected}
                >
                  <TableCell padding="checkbox" onClick={(event) => handleClick(event, row.id)}>
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {index+1}
                  </TableCell>
                  <TableCell   >
                    <Box display="flex" alignItems="center"> 
                      <Typography
                          key={-1}
                          sx={{
                            ml: 1,
                            cursor: 'pointer',
                            borderBottom: '1px solid black', 
                          }}
                          variant="h6"
                          fontWeight="600"
                          onClick={() => {
                            setShowPrivacyInfo(true);
                            setSelectPrivacyItem(row);
                          }}
                        >
                        {row.personal_category}
                      </Typography>  
                      </Box>
                   </TableCell>
                  <TableCell>{row.description}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>
          선택한 항목을 삭제하시겠습니까?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteSelectedItems} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
      </Box>
      : <PrivacyInfoTable initPrivacyItems={privacyItems} selectedItem={selectPrivacyItem} onClose={()=>{
        setShowPrivacyInfo(false);
      }} />
    }
    </>
  );
}

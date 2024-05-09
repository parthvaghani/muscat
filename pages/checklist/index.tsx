import React, { useState, useEffect } from 'react';
import axiosPost,{axiosDelete} from '@pages/axiosWrapper';
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@mui/material';
import { IconCheck, IconX } from '@tabler/icons-react';
import { alpha, useTheme } from '@mui/material/styles';
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import { API_URL } from '@pages/constant';
import CheckInfoTable from '@pages/check-info';
 

interface ChecklistItem {
  id: number;
  checklist_item: string;
  description: string;
}

export default function ChecklistManagement() {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [newItem, setNewItem] = useState<{ checklist_item: string; description: string }>({ checklist_item: '', description: '' });
  const [isAddingNewItem, setIsAddingNewItem] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [showCheckInfo, setShowCheckInfo] = useState(false);
  const [selectCheckItem, setSelectCheckItem] = useState<ChecklistItem>();

  const handleAddItemToggle = () => {
    setIsAddingNewItem(!isAddingNewItem);
    setNewItem({ checklist_item: '', description: '' }); // 새 항목 입력 필드 초기화
  };

  const fetchChecklistItems = async () => {
    try {
      const response = await axiosPost(`${API_URL}/checklist/List`,{});
      if (response.status === 200) {
        setChecklistItems(response.data);
        setIsAddingNewItem(false);
        setNewItem({ checklist_item: '', description: '' });
      } else {
        console.error('Failed to fetch checklist items');
      }
    } catch (error) {
      console.error('Error fetching checklist items:', error);
    }
  };

  useEffect(() => {
    fetchChecklistItems();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.checklist_item || !newItem.description) {
      alert('항목과 설명을 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axiosPost(`${API_URL}/checklist/Register`, newItem);
      if (response.status === 200) {
        fetchChecklistItems();
      } else {
        console.error('Failed to add checklist item');
      }
    } catch (error) {
      console.error('Error adding checklist item:', error);
    }
  };

  const handleDeleteSelectedItems = async () => {
    try {
      const response = await axiosDelete(`${API_URL}/checklist/Delete`, { data: { id: selected.join(',') } });
      if (response.status === 200) {
        fetchChecklistItems();
        setSelected([]);
        setDeleteDialogOpen(false)
      } else {
        console.error('Failed to delete checklist items');
      }
    } catch (error) {
      console.error('Error deleting checklist items:', error);
    } 
  };

  const openDeleteDialog = () => {
    if (selected.length > 0) {
      setDeleteDialogOpen(true);
    }
  };

  const cancelNewRow = () => {
    setIsAddingNewItem(false);
    setNewItem({ checklist_item: '', description: '' });
  };

  const handleSaveNewItem = () => {
    handleAddItem();
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = checklistItems.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: any = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex >= 0) {
      newSelected = newSelected.filter((selectedId: any) => selectedId !== id);
    }

    setSelected(newSelected);
  };

  return (
    <>
    {showCheckInfo==false ? 
    <Box sx={{ width: '100%' }}>
      <Breadcrumb title="점검 항목 관리" items={[{ to: '/', title: '메인' }, { title: '점검 항목 관리' }]} />
      <Toolbar sx={{ pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity), ...(selected.length > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity), }), }}>
        {selected.length > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
            {selected.length} 건 선택됨
          </Typography>
        ) : (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
            총 {checklistItems.length} 건
          </Typography>
        )} 
        <Button variant="outlined" color="error" disabled={ selected.length==0 } onClick={openDeleteDialog}>삭제</Button>
        <Button variant="contained"  onClick={handleAddItemToggle}  sx={{ ml: 1 }}>추가</Button>
      </Toolbar>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:'success'}}>
            <TableRow>
              <TableCell padding="checkbox"><Checkbox indeterminate={selected.length > 0 && selected.length < checklistItems.length} checked={checklistItems.length > 0 && selected.length === checklistItems.length} onChange={handleSelectAllClick} /></TableCell>
              <TableCell>번호</TableCell>
              <TableCell>항목</TableCell>
              <TableCell>설명</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAddingNewItem && (
              <TableRow>
                <TableCell></TableCell>
                <TableCell>새 항목</TableCell>
                <TableCell>
                  <TextField fullWidth variant="outlined" value={newItem.checklist_item} onChange={(e) => setNewItem({ ...newItem, checklist_item: e.target.value })} />
                </TableCell>
                <TableCell>
                  <TextField fullWidth variant="outlined" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleSaveNewItem}><IconCheck /></IconButton>
                  <IconButton onClick={cancelNewRow}><IconX /></IconButton>
                </TableCell>
              </TableRow>
            )}
            {checklistItems.map((row, index) => (
              <TableRow key={row.id} hover role="checkbox" aria-checked={selected.indexOf(row.id) !== -1} tabIndex={-1} selected={selected.indexOf(row.id) !== -1}>
                <TableCell onClick={(event) => handleClick(event, row.id)}  padding="checkbox"><Checkbox checked={selected.indexOf(row.id) !== -1} /></TableCell>
                <TableCell component="th" scope="row">{index + 1}</TableCell>
                <TableCell>
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
                      setShowCheckInfo(true);
                      setSelectCheckItem(row);
                    }}
                  >
                  {row.checklist_item}
                </Typography> 
                </Box>
                 </TableCell>
                <TableCell>{row.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>삭제 확인</DialogTitle>
        <DialogContent>선택한 항목을 삭제하시겠습니까?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>취소</Button>
          <Button onClick={handleDeleteSelectedItems} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
    : <CheckInfoTable initChecklistItems={checklistItems} selectedItem={selectCheckItem} onClose={()=>{
      setShowCheckInfo(false);
    }} />
  }
    </>
  );
}

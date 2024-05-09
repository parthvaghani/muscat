import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Box, TextField, InputLabel, MenuItem, Typography } from '@mui/material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { API_URL } from '@pages/constant';
import axiosPost from '@pages/axiosWrapper';
import { Row } from 'antd';
 



 
interface Row {
  id: number;
  sequence: number;
  standard_grade: string;
  intermediate_grade: string;
  item: string;
  categoryId: number;
  merged1: number;
  merged2: number;
} 
interface SelectedCell {
  rowIndex: number;
  colIndex: number;
}

 
 
interface PrivacyItem {
  id: number;
  personal_category: string;
  description: string;
} 
interface PrivacyProps {
  selectedItem: PrivacyItem;
  initPrivacyItems: PrivacyItem[];
  onClose?: () => void;
} 
const PrivacyInfoTable: React.FC<PrivacyProps> = ({selectedItem, initPrivacyItems, onClose }) => {
  const [privacyItems, setPrivacyItems] = useState<PrivacyItem[]>(initPrivacyItems);
  const [privacyImport, setPrivacyImport] = useState<PrivacyItem>(selectedItem);
  const [privacyInfos, setPrivacyInfos] = useState<Row[]>([]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [editingCell, setEditingCell] = useState<SelectedCell | null>(null);
  const [willSave, setWillSave] = useState<boolean>(false);

  const fetchPrivacyInfo = async ( category_id :number ) => {
    try {
      const response = await axiosPost(`${API_URL}/personal_info/List`,{
        "category_id": category_id
      })
      if (response.data) {
        console.log(response.data);
        setPrivacyInfos(response.data); 

      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if(privacyItems.length>0){ 
      fetchPrivacyInfo(selectedItem.id);
    } 
  }, []);


  const handleCellUpdate = (rowIndex: number, field: keyof Row, value: string | number) => {
    setWillSave(true);
    console.log(privacyInfos);
    console.log('-------------');
    const updatedRows = privacyInfos.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    console.log(updatedRows);
    setPrivacyInfos(updatedRows); 
  };
  

  const handleAddRow = () => {
    setWillSave(true);
    handleSplit();
    const newRow: Row = {
      id: privacyInfos.length + 1,
      sequence: privacyInfos.length + 1,
      standard_grade: '',
      intermediate_grade: '',
      item: '',
      categoryId: selectedItem.id,
      merged1: 1,
      merged2: 1,
    };

    if (selectedCell) {
      const updatedRows = [...privacyInfos];
      let insertAtIndex = selectedCell.rowIndex + 1; 
      if( selectedCell.colIndex == 2 ){
        for (let i = selectedCell.rowIndex+1 ; i < privacyInfos.length+1; i++) {
          if( i == privacyInfos.length){
            insertAtIndex = i ; 
            break;
          }
          const row = updatedRows[i];
          if (row.merged1 >= 1 ){
            insertAtIndex = i ; 
            break;
          } 
        }
      }else if( selectedCell.colIndex == 3 ){
        for (let i = selectedCell.rowIndex+1 ; i < privacyInfos.length+1; i++) {
          if( i == privacyInfos.length){
            insertAtIndex = i ; 
            break;
          }
          const row = updatedRows[i];
          if (row.merged2 >= 1 ){
            insertAtIndex = i ; 
            break;
          } 
        }
      }
      console.log(insertAtIndex)
      
      // 삽입위치 이후 행의 merged1 값을 수정
      for (let i = insertAtIndex ; i >= 0; i--) {
        if( i == privacyInfos.length){
          break;
        }
        if( updatedRows[insertAtIndex].merged1 == 0  ){
          const row = updatedRows[i];
          if (row.merged1 === 1 ){
            newRow.merged1 = 1 ;
            break;
          } 
          if (row.merged1 > 1 ) {
            updatedRows[i].merged1++;  
            newRow.merged1 = 0;
            break;
          }  
        }
       
      }

      for (let i = insertAtIndex ; i >= 0; i--) {
        if( i == privacyInfos.length){
          break;
        }
        if( updatedRows[insertAtIndex].merged2 == 0  ){
          const row = updatedRows[i];
        if (row.merged2 === 1 ){
          newRow.merged2 = 1 ;
          break;
        }
        if (row.merged2 > 1 ) {
          updatedRows[i].merged2++;  
          newRow.merged2 = 0 ;
          break;
        }  
        }
        
      }
      // 새로운 행 추가
      updatedRows.splice(insertAtIndex, 0, newRow);
      updatedRows.forEach((row, rowIndex) => {
        row.sequence = rowIndex + 1;  
      });
      setPrivacyInfos(updatedRows); 
    } else {
      setPrivacyInfos([...privacyInfos, newRow]);
    }
    
  };

  const handleDeleteRow = () => {
    if (selectedCell) { 
      setWillSave(true);
      const updatedRows = [...privacyInfos];
      updatedRows.splice(selectedCell.rowIndex, 1); 
      handleSplit();
      // let updatedRows = [...rows]; 
      // // 선택된 셀 아래에 있는 행 중 merged1 값이 0인 행을 모두 제거
      // for (let i = selectedCell.rowIndex ; i < updatedRows.length; i++) {
      //   if (updatedRows[i].merged1 === 0) {
      //     updatedRows.splice(i, 1); // merged1 값이 0이면 행을 제거
      //     i--; // 행이 제거되었으므로 index를 조정
      //   } else {
      //     break; // merged1 값이 0이 아니면 반복문 종료
      //   }
      // }
    
      // // 선택된 셀 아래에 있는 행 중 merged2 값이 0인 행을 모두 제거
      // for (let i = selectedCell.rowIndex ; i < updatedRows.length; i++) {
      //   if (updatedRows[i].merged2 === 0) {
      //     updatedRows.splice(i, 1); // merged1 값이 0이면 행을 제거
      //     i--; // 행이 제거되었으므로 index를 조정
      //   } else {
      //     break; // merged1 값이 0이 아니면 반복문 종료
      //   } 
      // } 
      updatedRows.forEach((row, index) => (row.sequence = index + 1));
      setPrivacyInfos(updatedRows);  
    }
  };

  const handleMerge = () => {
    if (!selectedCell ) return;
    setWillSave(true);
    let mergeCount = 1; // 병합할 셀의 수를 추적합니다.
    let processing = true;
    
    // 병합할 셀의 수를 계산합니다.
    if( selectedCell.colIndex == 2 ){
      privacyInfos.forEach((row, rowIndex) => {
        if (rowIndex > selectedCell.rowIndex) {
          if (processing) {
            mergeCount++;
            if (row.merged1 === 1) processing = false;
          }
        }
      });
    
      processing = true;
      const updatedRows = privacyInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged1: mergeCount };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged1 === 1) processing = false;
          return { ...row, merged1: 0, standard_grade: privacyInfos[selectedCell.rowIndex].standard_grade
             };
        }
        return row;
      });
      setPrivacyInfos(updatedRows);
    }
    else if( selectedCell.colIndex == 3  ){ 
      privacyInfos.forEach((row, rowIndex) => {
        if (rowIndex > selectedCell.rowIndex) {
          if ( processing) {
            mergeCount++;
            if (row.merged2 === 1) processing = false;
          }
        }
      }); 
      processing = true;
      const updatedRows = privacyInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged2: mergeCount };
        } else if (rowIndex > selectedCell.rowIndex && processing) {
          if (row.merged2 === 1) processing = false;
          return { ...row, merged2: 0, standard_grade: privacyInfos[selectedCell.rowIndex].standard_grade };
        }
        return row;
      });
      setPrivacyInfos(updatedRows);
    }
    
  
    
  };
  
  const handleSplit = () => {
    if (!selectedCell) return;
    
    if( selectedCell.colIndex == 2 ){
      setWillSave(true);
      let processing = true;
      const updatedRows = privacyInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged1: 1 };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged1 >= 1) processing = false;
          return { ...row, merged1: 1 };
        }
        return row;
      }); 
    
      setPrivacyInfos(updatedRows);
    }else if( selectedCell.colIndex == 3 ){
      setWillSave(true);
      let processing = true;
      const updatedRows = privacyInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged2: 1 };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged2 >= 1) processing = false;
          return { ...row, merged2: 1 };
        }
        return row;
      }); 
      setPrivacyInfos(updatedRows);
    }
  }; 
  const handleSave = async () => {
    setWillSave(false);
    try {
      const response = await axiosPost(`${API_URL}/personal_info/Register`,{
        "id": selectedItem.id,
        "data": privacyInfos
      })
      if (response.data.result=='success') {
        fetchPrivacyInfo(selectedItem.id)
      } else {
        console.error(response.data.error_message);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }

  return (
    <> 
    <Box 
      sx={{
        backgroundColor: "primary.light",
        borderRadius: "12px",
        p: "30px 25px 20px",
        marginBottom: "30px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Typography variant="h4">개인정보 상세설정</Typography>
      <Row>
        <Typography
          color="textSecondary"
          variant="h6"
          fontWeight={400}
          mt={0.8}
          mb={0}
        >
          개인정보 취급 분류: 
        </Typography>
        <Typography
          color="primary"
          variant="h6"
          fontWeight={700}
          mt={0.8}
          ml={1}
          mb={0}
        >
          {selectedItem.personal_category}
        </Typography>
      </Row> 
    </Box>
      
      <Box sx={{ mb: 2, display: 'flex',justifyContent:'space-between'  }}>
        <Button sx={{  width: 100 }} variant="contained" onClick={onClose} >목록</Button>
        <Box sx={{ display: 'flex',justifyContent:'flex-end',  gap: 1 }}>
          <CustomSelect
            id="account-type-select"
            sx={{ mr: 1, width: 200 }}
            value={privacyImport.id} 
            onChange={(event:any) => {   
              const item = privacyItems.find((e)=>e.id ==event.target.value ); 
              setPrivacyImport(item); 
            }}
            
          >
            {privacyItems.map((x, i) => {
              return (
                <MenuItem key={i} value={x.id}>{x.personal_category}</MenuItem>
              );
            })
            }
          </CustomSelect>
          <Button sx={{   mr: 4, width: 100 }} variant="contained" onClick={()=>{
            setPrivacyInfos([]);
            fetchPrivacyInfo(privacyImport.id);
          }} >불러오기</Button>
          <Button variant="contained" onClick={handleMerge} disabled={!selectedCell}>셀 병합</Button>
          <Button variant="contained" onClick={handleSplit} disabled={!selectedCell}>셀 분할</Button>
          <Button variant="contained" onClick={handleAddRow}  >행 삽입</Button>
          <Button variant="contained" onClick={handleDeleteRow} disabled={(selectedCell && privacyInfos.length> selectedCell.rowIndex) ?  ( privacyInfos[selectedCell.rowIndex].merged1 !==1) || (privacyInfos[selectedCell.rowIndex].merged2  !==1) :true  }>행 삭제</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {privacyInfos.map((row:Row, rowIndex) => (
           
              <TableRow key={row.id}>
                {Object.keys(row).map((key, colIndex) => {
                  const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex;
                  return colIndex == 2 &&  row.merged1 !== 0 ?
                    (
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => setSelectedCell({ rowIndex, colIndex })}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}
                      rowSpan={row.merged1 > 0 ? row.merged1 : 1} 
                      sx={{width:100, pa:0}}
                    >
                      {isEditing ? (
                        <TextField
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                          value={row[key as keyof Row]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof Row, e.target.value)}
                        />
                      ) : (
                        <InputLabel  >{row.standard_grade}</InputLabel>
                      )}
                    </TableCell>
                  )
                  : colIndex == 3 &&  row.merged2 !== 0 ?
                  (
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => setSelectedCell({ rowIndex, colIndex })}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}
                      rowSpan={row.merged2 > 0 ? row.merged2 : 1} 
                      sx={{width:100}}
                    >
                      {isEditing ? (
                        <TextField 
                          value={row[key as keyof Row]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof Row, e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                        />
                      ) : (
                        <InputLabel>{row.intermediate_grade}</InputLabel>
                      )}
                    </TableCell>
                  )
                  : colIndex == 4  ?
                  (
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => setSelectedCell({ rowIndex, colIndex })}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })} 
                      
                      sx={{width:100}}
                    >
                      {isEditing ? (
                        <TextField  
                          value={row[key as keyof Row]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof Row, e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                        />
                      ) : (
                        <InputLabel>{row.item}</InputLabel>
                      )}
                    </TableCell>
                  ) : null;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display={'flex'} justifyContent={'flex-end'} marginTop={2}>
        <Button variant="contained" onClick={handleSave} disabled={!willSave}>저장</Button>
      </Box>
      
    </>
  );
};
export default PrivacyInfoTable;

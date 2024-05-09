import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import React, { useEffect, useState } from 'react';
import { Button, Table, Input,TableBody, TableCell,Typography, TableContainer, TableRow, Paper, Box, TextField, InputLabel, MenuItem, TableHead, Chip, TextareaAutosize } from '@mui/material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { API_URL } from '@pages/constant';
import axiosPost, { axiosPost2 } from '@pages/axiosWrapper'; 
import {  Row } from 'antd';
import { CloudUpload, CloudUploadOutlined } from '@mui/icons-material';

interface CheckInfo{
  id: number;
  sequence: number;
  area: string;
  domain: string;
  item: string;
  detail_item: string;
  description: string;
  attachment: number;
  categoryId: number;
  merged1: number;
  merged2: number;
  filename: string;
}

interface ChecklistResultItem {
  id: number;
  sequence: number;
  area: string;
  domain: string;
  item: string;
  detail_item: string;
  description: string;
  
  inspection_result: string;
  evidence_attachment: string;
  inspection_approval: string;
  corrective_action: string;
  final_result: string;
  last_modified_date: string;
  status: string;
  corrective_request: string;
  inspection_opinion: string;
  evidence_attachment_1: string;
  evidence_attachment_2: string;
  lock: string;
  item_id: number;
  project_detail_id: number;
}

interface SelectedCell {
  rowIndex: number;
  colIndex: number;
}

 
 
interface ChecklistItem {
  id: number;
  checklist_item: string;
  description: string;
}

interface CheckProps {
  selectedItem: ChecklistItem;
  initChecklistItems: ChecklistItem[];
  onClose?: () => void;
} 
const CheckInfoTable: React.FC<CheckProps> = ({selectedItem, initChecklistItems, onClose }) => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(initChecklistItems);
  const [checklistImport, setChecklistImport] = useState<ChecklistItem>(selectedItem);
  const [checkInfos, setCheckInfos] = useState<CheckInfo[]>([]);
  const [selectedCell, setSelectedCell] = useState<SelectedCell | null>(null);
  const [editingCell, setEditingCell] = useState<SelectedCell | null>(null);
  const [willSave, setWillSave] = useState<boolean>(false);

  const fetchCheckInfo = async ( category_id :number) => {
    try {
      const response = await axiosPost(`${API_URL}/checkinfo/List`,{
        "category_id": category_id
      });
      if (response.status === 200) {
        setCheckInfos(response.data);
         
      } else {
        console.error('Failed to fetch items');
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    if(checklistItems.length>0){ 
      fetchCheckInfo(selectedItem.id);
    }  
  }, []);


  const handleCellUpdate = (rowIndex: number, field: keyof CheckInfo, value: string | number) => {
    setWillSave(true);
    const updatedRows = checkInfos.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setCheckInfos(updatedRows); 
  };
 

  

  const handleAddRow = () => {
    setWillSave(true);
    handleSplit();
    const newRow: CheckInfo = {
      id: checkInfos.length + 1,
      sequence: checkInfos.length + 1,
      area:'',
      domain:'',
      description:'',
      detail_item:'',
      attachment: 0, 
      item: '',
      categoryId: selectedItem.id,
      merged1: 1,
      merged2: 1,
      filename: '',
    };

    if (selectedCell) {
      const updatedRows = [...checkInfos];
      let insertAtIndex = selectedCell.rowIndex + 1; 
      if( selectedCell.colIndex == 2 ){
        for (let i = selectedCell.rowIndex+1 ; i < checkInfos.length+1; i++) {
          if( i == checkInfos.length){
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
        for (let i = selectedCell.rowIndex+1 ; i < checkInfos.length+1; i++) {
          if( i == checkInfos.length){
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
        if( i == checkInfos.length){
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
        if( i == checkInfos.length){
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
      setCheckInfos(updatedRows); 
    } else {
      setCheckInfos([...checkInfos, newRow]);
    }
    []
  };

  const handleDeleteRow = () => {
    if (selectedCell) { 
      setWillSave(true);
      const updatedRows = [...checkInfos];
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
      setCheckInfos(updatedRows);
      setSelectedCell(null);
    }
  };

  const handleMerge = () => {
    if (!selectedCell ) return;
    setWillSave(true);
    let mergeCount = 1; // 병합할 셀의 수를 추적합니다.
    let processing = true;
    
    // 병합할 셀의 수를 계산합니다.
    if( selectedCell.colIndex == 2 ){
      checkInfos.forEach((row, rowIndex) => {
        if (rowIndex > selectedCell.rowIndex) {
          if (processing) {
            mergeCount++;
            if (row.merged1 === 1) processing = false;
          }
        }
      });
    
      processing = true;
      const updatedRows = checkInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged1: mergeCount };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged1 === 1) processing = false;
          return { ...row, merged1: 0, area : checkInfos[selectedCell.rowIndex].area };
        }
        return row;
      });
      setCheckInfos(updatedRows);
    }
    else if( selectedCell.colIndex == 3  ){ 
      checkInfos.forEach((row, rowIndex) => {
        if (rowIndex > selectedCell.rowIndex) {
          if ( processing) {
            mergeCount++;
            if (row.merged2 === 1) processing = false;
          }
        }
      }); 
      processing = true;
      const updatedRows = checkInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged2: mergeCount };
        } else if (rowIndex > selectedCell.rowIndex && processing) {
          if (row.merged2 === 1) processing = false;
          return { ...row, merged2: 0 , domain : checkInfos[selectedCell.rowIndex].domain};
        }
        return row;
      });
      setCheckInfos(updatedRows);
    } 
  };


  interface SelectedFile {
    file: File;
    id: number;
  }
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  const handleFileChange = (event: any, inputId: number) => {
    setWillSave(true);
    const files: FileList | null = event.target.files;
    if (files) {
      const newFiles: SelectedFile[] = Array.from(files).map(file => ({
        file: file,
        id: inputId, 
      })); 
      const updatedFiles: SelectedFile[] = selectedFiles.map(selectedFile => {
        if (selectedFile.id === inputId) {
          return newFiles.find(newFile => newFile.id === inputId) || selectedFile;
        }
        return selectedFile;
      });
      
      setSelectedFiles(prevFiles => {  
        return updatedFiles.some(updatedFile => updatedFile.id === inputId)
          ? updatedFiles
          : [...prevFiles, ...newFiles];
      });
    }
    console.log(selectedFiles);
  };
  

  const handleDelete = (id: number) => {
    setWillSave(true);
    setSelectedFiles(prevFiles => prevFiles.filter(file => file.id !== id));
  };
  
  const handleSplit = () => {
    if (!selectedCell) return;
    
    if( selectedCell.colIndex == 2 ){
      setWillSave(true);
      let processing = true;
      const updatedRows = checkInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged1: 1 };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged1 >= 1) processing = false;
          return { ...row, merged1: 1 };
        }
        return row;
      }); 
    
      setCheckInfos(updatedRows);
    }else if( selectedCell.colIndex == 3 ){
      setWillSave(true);
      let processing = true;
      const updatedRows = checkInfos.map((row, rowIndex) => {
        if (rowIndex === selectedCell.rowIndex) {
          return { ...row, merged2: 1 };
        } else if (rowIndex > selectedCell.rowIndex &&  processing) {
          if (row.merged2 >= 1) processing = false;
          return { ...row, merged2: 1 };
        }
        return row;
      }); 
      setCheckInfos(updatedRows);
    }
  }; 
  const handleSave = async () => {
    setWillSave(false);
    const sortedFiles = selectedFiles.sort((a:any, b:any) => a.id - b.id);
    let newId = 1; 
    checkInfos.forEach((info) => {
      info.attachment = 0; 
    });
    sortedFiles.forEach((file) => { 
      const index = checkInfos.findIndex((info) => info.sequence === file.id);
      if (index !== -1) {
        checkInfos[index].attachment = (newId++);
        checkInfos[index].filename = file.file.name;
      } 
    });
    try {
      const formData = new FormData();
      formData.append('id', selectedItem.id.toString());
      formData.append('data', JSON.stringify(checkInfos));
      sortedFiles.forEach((file, index) => {
        formData.append(`file${index+1}`, file.file);
      }); 
      const response = await axiosPost2(`${API_URL}/checkinfo/Register`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
      if (response.data.result === 'success') {
        fetchCheckInfo(selectedItem.id);
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
      <Typography variant="h4">세부 점검 항목</Typography>
      <Row>
        <Typography
          color="textSecondary"
          variant="h6"
          fontWeight={400}
          mt={0.8}
          mb={0}
        >
          체크리스트명:
        </Typography>
        <Typography
          color="primary"
          variant="h6"
          fontWeight={700}
          mt={0.8}
          ml={1}
          mb={0}
        >
          {selectedItem.checklist_item}
        </Typography>
      </Row> 
    </Box>
         
      <Box sx={{ mb: 2, display: 'flex',justifyContent:'space-between'  }}>
        <Button sx={{  width: 100 }} variant="contained" onClick={onClose} >목록</Button>
        <Box sx={{ display: 'flex',justifyContent:'flex-end',  gap: 1 }}>
          <CustomSelect
            id="account-type-select"
            sx={{ mr: 1, width: 200 }}
            value={checklistImport.id} 
            onChange={(event:any) => { 
              const item = checklistItems.find((e)=>e.id ==event.target.value ); 
              setChecklistImport(item); 
            }} 
          >
            {checklistItems.map((x, i) => {
              return (
                <MenuItem key={i} value={x.id}>{x.checklist_item}</MenuItem>
              );
            })
            }
          </CustomSelect>
          <Button sx={{   mr: 4, width: 100 }} variant="contained" onClick={()=>{
            setCheckInfos([]);
            fetchCheckInfo(checklistImport.id);
          }} >불러오기</Button>
          <Button variant="contained" onClick={handleMerge} disabled={!selectedCell}>셀 병합</Button>
          <Button variant="contained" onClick={handleSplit} disabled={!selectedCell}>셀 분할</Button>
          <Button variant="contained" onClick={handleAddRow}  >행 삽입</Button>
          <Button variant="contained" onClick={handleDeleteRow} disabled={(selectedCell && checkInfos.length> selectedCell.rowIndex) ? (checkInfos[selectedCell.rowIndex].merged1 !==1) || (checkInfos[selectedCell.rowIndex].merged2  !==1) : true  }>행 삭제</Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
        <TableHead >
          <TableRow sx={{backgroundColor:'success'}}> 
            <TableCell style={{ textAlign: 'center'}}>영역</TableCell>
            <TableCell style={{ textAlign: 'center'}}>분야</TableCell>
            <TableCell style={{ textAlign: 'center'}}>항목</TableCell>
            <TableCell style={{ textAlign: 'center'}}>세부 점검 항목</TableCell>
            <TableCell style={{ textAlign: 'center'}}>설명</TableCell>
            <TableCell style={{ textAlign: 'center'}}>첨부파일 양식</TableCell> 
          </TableRow>
        </TableHead>
          <TableBody>
            {checkInfos.map((row:CheckInfo, rowIndex) => ( 
              <TableRow key={row.id}>
                {Object.keys(row).map((key, colIndex) => {
                  const isEditing = editingCell && editingCell.rowIndex === rowIndex && editingCell.colIndex === colIndex;
                 
                  return colIndex == 2 &&  row.merged1 !== 0 ?
                    (
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => {
                        setSelectedCell({ rowIndex, colIndex })
                      }}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}
                      rowSpan={row.merged1 > 0 ? row.merged1 : 1} 
                      sx={{width:200, pa:0}}
                    >
                      {isEditing ? (
                        <TextField
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                          value={row[key as keyof CheckInfo]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof CheckInfo, e.target.value)}
                        />
                      ) : (
                        <TextareaAutosize 
                          value={row.area} 
                          onClick={() => setSelectedCell({ rowIndex, colIndex })}
                          onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' ,
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        /> 
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
                      sx={{width:250}}
                    >
                      {isEditing ? (
                        <TextField 
                          value={row[key as keyof CheckInfo]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof CheckInfo, e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                        />
                      ) : (
                        <TextareaAutosize 
                          value={row.domain} 
                          onClick={() => setSelectedCell({ rowIndex, colIndex })}
                          onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' ,
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        />  
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
                      
                      sx={{width:250}}
                    >
                      {isEditing ? (
                        <TextField  
                          value={row.item}
                          onChange={(e) => handleCellUpdate(rowIndex, 'item', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                        />
                      ) : (
                        <TextareaAutosize 
                        value={row.item} 
                        onClick={() => setSelectedCell({ rowIndex, colIndex })}
                        onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                        style={{ 
                          width: "100%", 
                          minHeight: 32, 
                          resize: "none", 
                          border: "none", 
                          outline: "none",
                          backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' ,
                          pointerEvents: "none" // 입력 비활성화
                        }} 
                      />  
                      )}
                    </TableCell>
                  ): colIndex == 5  ?
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => setSelectedCell({ rowIndex, colIndex })}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                      sx={{width:700}}
                    >
                      {isEditing ? (
                        <TextField   
                          multiline={true}
                          value={row[key as keyof CheckInfo]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof CheckInfo, e.target.value)}
                           
                        />
                      ) : (
                        <TextareaAutosize 
                          value={row.detail_item} 
                          onClick={() => setSelectedCell({ rowIndex, colIndex })}
                          onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' ,
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        />

                      )}
                    </TableCell>
                    : colIndex == 6  ?
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                      onClick={() => setSelectedCell({ rowIndex, colIndex })}
                      onDoubleClick={() => setEditingCell({ rowIndex, colIndex })} 
                      
                      sx={{width:700}}
                    >
                      {isEditing ? (
                        <TextField  
                          value={row.description}
                          multiline
                          onChange={(e) => handleCellUpdate(rowIndex,'description', e.target.value)}
                          onKeyDown={(e: any) => { if (e.key === 'Enter') {
                            e.target.blur(); 
                            setEditingCell(null);
                          } }}
                        />
                      ) : ( 
                        <TextareaAutosize 
                          value={row.description} 
                          onClick={() => setSelectedCell({ rowIndex, colIndex })}
                          onDoubleClick={() => setEditingCell({ rowIndex, colIndex })}  
                          style={{ 
                            width: "100%", 
                            minHeight: 32, 
                            resize: "none", 
                            border: "none", 
                            outline: "none",
                            backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' ,
                            pointerEvents: "none" // 입력 비활성화
                          }} 
                        />
                      )}
                    </TableCell>
                    : colIndex == 7  ?
                    <TableCell
                      key={colIndex}
                      style={{ textAlign: 'center', cursor: 'pointer', backgroundColor: !isEditing && selectedCell && selectedCell.rowIndex === rowIndex && selectedCell.colIndex === colIndex ? '#bde0fe' : '' }}
                    
                      sx={{width:100}}
                    > 
                        
                          
                          
                          <label htmlFor={`file-upload${rowIndex}`} style={{ display: 'flex',cursor: 'pointer' , flexDirection: 'row', alignItems: 'center' }}>
                     
                            <CloudUploadOutlined/>
                               {selectedFiles.find(file => file.id === row.sequence) ? 
                                  <Chip
                                  style={{  marginLeft: 2 }}
                                  label={selectedFiles.find(file => file.id === row.sequence).file.name}
                                  onDelete={(event) => { 
                                    event.preventDefault()
                                    handleDelete( row.sequence)
                                  }}   
                                />:

                                <span style={{ textAlign: 'center', width: 80, borderBottom: '1px solid black' }}>
                                  {row.filename.toString() === "" ? '양식업로드' : row.filename.toString()}
                                </span>
                              }
                          
                            <input
                              id={`file-upload${rowIndex}`}
                              type="file"
                              onChange={(event) =>{ 
                                handleCellUpdate(rowIndex, 'filename', '')
                                handleFileChange(event,  row.sequence)
                              } }
                              style={{ display: 'none' }}
                            />
                          </label> 
                           
                        
                    </TableCell>
                   : null;
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
export default CheckInfoTable;

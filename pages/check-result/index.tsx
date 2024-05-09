import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import React, { useEffect, useState } from 'react';
import { Button, Table, Input,TableBody, TableCell, TableContainer, TableRow, Paper, Box, TextField, InputLabel, MenuItem, TableHead, Chip, TextareaAutosize, InputAdornment, Typography } from '@mui/material';
import CustomSelect from '@src/components/forms/theme-elements/CustomSelect';
import { API_URL } from '@pages/constant';
import axiosPost, { axiosPost2 } from '@pages/axiosWrapper'; 
import {  Row } from 'antd';
import {  CloudUploadOutlined } from '@mui/icons-material';
import { IconSearch } from '@tabler/icons-react';


interface ChecklistResultItem {
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


  inspection_result: string;
  evidence_attachment: string;
  inspection_approval: string;
  corrective_action: string;
  final_result: string;
  last_modified_date: string;
  status: string;
  corrective_request: string;
  inspection_opinion: string;
  evidence_attachment_file: string;
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
  onClose?: () => void;
} 
const CheckInfoTable: React.FC<CheckProps> = ({selectedItem,  onClose }) => { 
  const [checklistItem, setChecklistItem] = useState<ChecklistItem>(selectedItem);
  const [checkInfos, setCheckInfos] = useState<ChecklistResultItem[]>([]);
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
 

  React.useEffect(() => {
    fetchCheckInfo(3) 
  }, []); 
  const handleCellUpdate = (rowIndex: number, field: keyof ChecklistResultItem, value: string | number) => {
    setWillSave(true);
    const updatedRows = checkInfos.map((row, index) => {
      if (index === rowIndex) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setCheckInfos(updatedRows); 
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
      formData.append('id', checklistItem.id.toString());
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
      <Breadcrumb title="세부 점검 항목"  />   
      
      <Box sx={{ mb: 2, display: 'flex',justifyContent:'space-between'  }}>
        <Button sx={{  width: 100 }} variant="contained" onClick={onClose} >목록</Button>
        <Box sx={{ display: 'flex',justifyContent:'flex-end',  gap: 1 }}>
          
           
          <Button variant="contained"  >수탁사 입력 활성화</Button>
          <Button variant="contained"  >다운로드</Button>
          <Button variant="contained"  >임시 저장</Button>
          <Button variant="contained"  >보완 요청</Button>
          <Button variant="contained" >검수 완료</Button>
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
            {checkInfos.map((row:ChecklistResultItem, rowIndex) => ( 
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
                          value={row[key as keyof ChecklistResultItem]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof ChecklistResultItem, e.target.value)}
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
                          value={row[key as keyof ChecklistResultItem]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof ChecklistResultItem, e.target.value)}
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
                          value={row[key as keyof ChecklistResultItem]}
                          onChange={(e) => handleCellUpdate(rowIndex, key as keyof ChecklistResultItem, e.target.value)}
                           
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

// src/components/DeleteCompanies.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';  
import axiosPost,{axiosDelete} from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';

interface DeleteInquiryProps {
  selectedInquiryIds: string;
  onClose?: () => void;
}

const DeleteInquiry: React.FC<DeleteInquiryProps> = ({ selectedInquiryIds, onClose }) => {  
  const [open, setOpen] = useState<boolean>(false); 
  const handleClickOpen = (): void => {
    setOpen(true);
  }; 
  const handleClose = (): void => {
    setOpen(false);
    if (onClose) onClose();
  };

  const handleDelete = async (): Promise<void> => {
    if (selectedInquiryIds.length > 0) {
      try { 
        const deleteResponse = await axiosDelete(`${API_URL}/inquiry/Delete`, {
          data: { str_ids: selectedInquiryIds }
        });
  
        if (deleteResponse.status === 200) {
          // Handle successful delete response (status code 200)
          const { result } = deleteResponse.data;
          if (result === "SUCCESS") {
            handleClose();
            // Fetch updated list after successful deletion
            const listResponse = await axiosPost(`${API_URL}/inquiry/List`,{});

            // Handle the list response as needed
            console.log("List of companies:", listResponse.data);
          } else {
            // Handle other cases (e.g., result === "fail")
            console.error("Failed to delete the company:", deleteResponse.data);
          }
        } else if (deleteResponse.status === 400) {
          // Handle failed delete response (status code 400)
          console.error("API request failed:", deleteResponse.data);
        }
      } catch (error:any) {
        // Handle any other errors (e.g., network issues, invalid URL, etc.)
        console.error("Error fetching data from API:", error.message);
      }
    }
  };
  

  return (
    <>
      <Button variant="contained" color="error"  sx={{width:150, mr:1}} onClick={handleClickOpen} disabled={selectedInquiryIds.length === 0}>
        문의 삭제
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>문의 삭제</DialogTitle>
        <DialogContent>
          <DialogContentText>
            선택한 문의들을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button onClick={handleDelete} color="error">삭제</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteInquiry;

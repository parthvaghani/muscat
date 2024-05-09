
import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  DialogActions,
  DialogContentText,
  Typography,
} from '@mui/material';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';
import { useSelector } from '@src/store/Store';
interface AddInquiryProps {
  onClose?: () => void;
}
const AddInquiry : React.FC<AddInquiryProps> = ({  onClose }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState(''); 
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowPasswordInput(false);
   
  };
  const handleSetPasswordClick = () => {
    setShowPasswordInput(true); // 비밀번호 입력 필드 표시
  };
  // const author: string | undefined = useSelector((state) => state.auth.user?.email);
  const handleSubmit = async () => {
    const str = sessionStorage.getItem('user')
    const author = JSON.parse(str).name
    const inquiryData = {
      title,
      content,
      password,
      author,
      created_date: new Date().toDateString(),
    };
 
    try {
      const response = await axiosPost(`${API_URL}/inquiry/Register`, inquiryData);

      if (response.status === 200) {
        // Handle successful response
        console.log('Inquiry submitted successfully:', response.data); 
        // Reset form and close dialog
        setOpen(false);
        setTitle('');
        setContent('');
        setPassword(''); 
        if (onClose) onClose();
      } else {
        // Handle non-200 responses
        console.error('Failed to submit the inquiry:', response.data);
      }
    } catch (error:any) {
      console.error('Error submitting the inquiry:', error.message);
    }
  };
  const handleContentChange = (e : any) => { 
    console.log(e.target.value);
    setContent(e.target.value);
  };

  return (
    <>
      <Button onClick={handleClickOpen} disableElevation color="primary" variant="contained" sx={{ width: 150 }}>
        문의 추가
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogContent>
          <Typography variant="h5" mb={2} fontWeight={700}>
            새로운 문의 등록
          </Typography>
          <DialogContentText>
            문의를 등록하기 위해 아래 정보를 입력해 주세요.
          </DialogContentText>
          <TextField
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            id="inquiry-title"
            label="제목"
            type="text"
            fullWidth
            size="small"
            variant="outlined"
          />
          <TextField
            value={content}
            onChange={handleContentChange}
            margin="normal"
            id="inquiry-content"
            label="내용"
            type="text"
            fullWidth
            multiline
            rows={4}
            size="small"
            variant="outlined"
          />
          {showPasswordInput ? (
            <TextField
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              id="inquiry-password"
              label="비밀번호"
              type="password"
              fullWidth
              size="small"
              variant="outlined"
            />
          ) : (
            <Button onClick={handleSetPasswordClick} color="secondary" variant="outlined" sx={{ my: 2 }}>
              비밀번호 설정
            </Button>
          )} 
           
        </DialogContent>
        <DialogActions>
          <Button color='error' onClick={handleClose}>취소</Button>
          <Button
            onClick={handleSubmit}
            disabled={!title || !content }
            variant="contained"
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddInquiry;

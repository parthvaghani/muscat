import { useState, useRef, useEffect } from 'react';
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
interface AddCompaniesProps {
  onClose?: () => void;
}
 
const AddCompany : React.FC<AddCompaniesProps> = ({  onClose }) => {

  const [open, setOpen] = useState(false);
  const [registerNum, setRegisterNum] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleDialogVibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(200); // 200ms 동안 진동
    }
  };

  const isValidRegisterNum = (num: string) => {
    const regex = /^\d{3}-\d{2}-\d{5}$/;
    return regex.test(num);
  };

  useEffect(() => {
    if (dialogContentRef.current) {
      dialogContentRef.current.scrollTop = 0;
    }
  }, []);

  return (
    <>
      <Button onClick={handleClickOpen} disableElevation color="primary" variant="contained" sx={{width:150}}>업체 등록</Button>
       
      <Dialog open={open} onClose={handleClose}>
        <DialogContent ref={dialogContentRef}>
          <Typography variant="h5" mb={2} fontWeight={700}>
            새로운 회사 등록
          </Typography>
          <DialogContentText>
            새로운 회사를 등록하기 위해 등록 번호와 회사 이름을 입력한 후, 제출 버튼을 눌러주세요.
          </DialogContentText>
          <TextField
            value={registerNum}
            onChange={(e) => setRegisterNum(e.target.value)}
            margin="normal"
            id="register-num"
            label="등록 번호"
            type="text"
            fullWidth
            size="small"
            variant="outlined"
            error={!isValidRegisterNum(registerNum)}
            helperText={!isValidRegisterNum(registerNum) && '유효한 사업자 등록 번호를 입력하세요 (000-00-00000)'}
          />
          <TextField
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            margin="normal"
            id="company-name"
            label="회사 이름"
            type="text"
            fullWidth
            size="small"
            variant="outlined"
          />
           <Typography color={'red'}> {errorTitle}  </Typography> 
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>취소</Button>
          <Button
            disabled={!registerNum || !companyName || !isValidRegisterNum(registerNum)}
            onClick={ async () => { 
              try {
                const response = await axiosPost(`${API_URL}/company/Register`, { register_num: registerNum, company_name: companyName });
                if (response.data.result === 'success') {
                  setOpen(false);
                  setRegisterNum('');
                  setCompanyName('');
                  onClose();
                } else if (response.data.result === 'fail') {
                  setErrorTitle(response.data.error_message);
                  handleDialogVibrate();
                  setTimeout(() => {
                    setErrorTitle('');
                  }, 3000);
                }
              } catch (error) {
              }
            }}
            variant="contained"
          >
            제출
          </Button>
        </DialogActions>
      </Dialog>
      
    </>
  );
};

export default AddCompany;

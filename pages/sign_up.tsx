import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ListItemIcon,
  Fab,
} from '@mui/material';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import { IconCheck } from '@tabler/icons-react';
import { Row } from 'antd';
import { Router, useRouter } from 'next/router';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';

// Assuming these are the functions that would actually perform API calls.
// You would need to replace them with real API calls in your application.
const checkDuplicateId = async (id: string): Promise<boolean> => {
  try {
    const response = await axiosPost(`${API_URL}/user/CheckId`,{
      "id": id
    });
    return response.data.result=='fail';
  } catch (error) {
    console.error('Error checking duplicate ID:', error);
    return true; // API 호출 실패 시 중복으로 간주
  }
};

// 사업자 등록번호 확인 API 호출
const checkBusinessNumber = async (number: string): Promise<string> => {
  try {
    const response = await axiosPost(`${API_URL}/company/Check`,{
      "register_num": number
    });
    return response.data.data;
  } catch (error) {
    console.error('Error checking business number:', error);
    return ''; // API 호출 실패 시 null 반환
  }
};
const isValidRegisterNum = (num: string) => {
  const regex = /^\d{3}-\d{2}-\d{5}$/;
  return regex.test(num);
};
const AccountTab: React.FC = () => {
  // Form state
  const [isMaster, setIsMaster] = useState(true)
  const [accountType, setAccountType] = useState<number>(0);
  const [id, setId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [businessNumber, setBusinessNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [other, setOther] = useState<string>('');
  const [code, setCode] = useState('')
  const [codeInput, setCodeInput] = useState('')
 

  // Dialog state
  const [dialog1Open, setDialog1Open] = useState<boolean>(false);
  const [dialog2Open, setDialog2Open] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>('');
  const [dialogContent, setDialogContent] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  
  const [idChecked, setIdChecked] = useState<boolean>(false);
  const [emailChecked, setEmailChecked] = useState<boolean>(false);
  const [compChecked, setCompChecked] = useState<boolean>(false);

  const hashingPassword = (passwd : string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(passwd);
    return crypto.subtle.digest('SHA-1', data)
      .then(hash => {
        const hexString = Array.from(new Uint8Array(hash))
          .map(byte => byte.toString(16).padStart(2, '0'))
          .join('');
        return hexString;
      });
  };

  const verifyPassword = async () => { 
    // const isPasswordCorrect = await checkPassword(selectedInquiry.id, password);
    hashingPassword(codeInput)
    .then(hashedCode => {
      if (code == hashedCode) {
        setDialogTitle('이메일 인증');
        setDialogContent('정확히 인증되었습니다.');
        setDialog1Open(true);
        setEmailChecked(true);
      } else {
        // Handle incorrect password case
        setDialogTitle('이메일 인증');
        setDialogContent('인증코드가 정확하지 않습니다.');
        setDialog1Open(true);
      }
    })
    .catch(error => console.error('Error occurred:', error));
   
  };

  const router = useRouter();
  // Handlers
  const handleAccountTypeChange = (event:any) => {
    setAccountType(event.target.value);
    if(event.target.value==1)
      setBusinessNumber('000-00-00000');
  };

  useEffect(() => {
    setIsMaster(false)
    setAccountType(1)
  }, [])

  // ...other handlers here...

  const handleIdCheck = async () => {
    const isDuplicate = await checkDuplicateId(id);
    if (isDuplicate) {
      setDialogTitle('중복 확인');
      setDialogContent('중복된 아이디가 존재합니다. 다른 아이디를 입력해 주세요.');
      setDialog1Open(true);
    } else {
      setDialogTitle('중복 확인');
      setDialogContent('사용 가능한 아이디입니다.');
      setDialog1Open(true);
      setIdChecked(true)
    }
  };

  const handleSendCode = async () => {
    const response = await axiosPost(`${API_URL}/user/SendCode`,{
      email: email
    });

    if (response.data.result == 'success') {
      setDialogTitle('인증코드 전송');
      setDialogContent('인증코드가 전송되었습니다.');
      setDialog1Open(true);
      setCode(response.data.code)
    }
    else {
      setDialogTitle('전송 오류');
      setDialogContent(response.data.error_message);
      setDialog1Open(true);
    }
    
  };

  const handleBusinessNumberCheck = async () => {
    const companyN = await checkBusinessNumber(businessNumber);
    setCompanyName(companyN);
    if (companyN) {
      setDialogTitle('업체 확인');
      setDialogContent(`업체 명: ${companyN}`);
      setDialog1Open(true);
      setCompChecked(true)
    } else {
      setDialogTitle('업체 확인');
      setDialogContent('등록된 업체가 없습니다. 업체를 등록해 주세요');
      setDialog1Open(true);
    }
    
  };
    
  const registerUser = () => {
    if( !idChecked){
      setDialogTitle('아이디');
      setDialogContent('아이디를 입력해주세요.');
      setDialog1Open(true);
      return;
    }
    if( !emailChecked){
      setDialogTitle('이메일');
      setDialogContent('이메일인증을 진행해주세요.');
      setDialog1Open(true);
      return;
    }
    if(accountType != 0 && !compChecked  ){
      setDialogTitle('사업자 등록번호');
      setDialogContent('사업자 등록번호를 입력해주세요.');
      setDialog1Open(true);
      return;
    }

    axiosPost(`${API_URL}/user/Signup`, {
      user_type: accountType, // 계정 유형에 따라 값 설정
      user_email: email, 
      user_password: password,
      register_num: businessNumber,
      company_address: address,
      manager_name: accountType > 0 ? name : '',
      manager_phone: accountType > 0 ? phone : '',
      manager_depart: department,
      manager_grade: position,
      other: other, // 필요에 따라 설정
      admin_name: accountType == 0 ? name : '', // 필요에 따라 설정
      admin_phone: accountType == 0 ? phone : '', // 필요에 따라 설정
      approval:0,
      id: id,
    })
    .then((response : any) => {
      if (response.data.result === 'success') {
        setDialogTitle('회원가입 신청이 완료되었습니다.');
        setDialogContent('현재 가입 승인 대기중입니다.\n관리자에게 승인이 완료된 후, 로그인이 가능합니다.\n승인처리가 지연될 시, 관리자에게 문의바랍니다.');
        setDialog2Open(true);
      } else if (response.data.result === 'fail') {
          setDialogTitle('계정 생성');
          setDialogContent('계정생성에 실패했습니다.');
          setDialog1Open(true);
      }
    })
    .catch((error:any) => {
      // 액션 실패 시 실행할 로직 (에러 처리)
      console.error("Failed to register the company:", error);
      setDialogTitle('계정 생성 실패');
      setDialogContent('사용자 등록에 실패했습니다. 다시 시도해주세요.');
      setDialog1Open(true);
    }); 
  }
 
  // Dialog close handler
  const handleDialog2Close = () => {
    setDialog2Open(false);
    router.push('/login')
  };
  const handleDialog1Close = () => { 
    setDialog1Open(false);
  };

  // ...other handlers here...

  return (
    <Box sx={{ width: 750, p: 5 }}> 
    <TableContainer component={Paper}>
      <Typography variant="h4" padding={1} marginTop={3}>기본정보</Typography>
      <Table>
      <TableBody>
        {/* ID */}
        
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="id">
              <AccountCircleIcon sx={{ marginRight: 1 }} />
              아이디
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
          {idChecked ? ( // Render input field if editing mode is true
              <Typography  sx={{ml:2}} >{id}</Typography>
            ) : (
              <TextField  
                fullWidth
                variant="outlined" 
                value={id}
              
                onChange={(e) => setId(e.target.value)}
                required
              /> 
            )}
            
          
          </TableCell>
          <TableCell sx={{ padding: 1 }}> 
          {idChecked ? (
            <Fab
                color="success" 
                size="small" 
              >
                <IconCheck width={16} /> 
              </Fab>
          ):(
            <Button onClick={handleIdCheck}>중복확인</Button>
          )}
            
          </TableCell>
        
        </TableRow>
      
        {/* Password */}
        
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="password">
              <LockIcon sx={{ marginRight: 1 }} />
              비밀번호
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }} >
            <TextField
              fullWidth
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </TableCell>
          <TableCell sx={{ padding: 1 }} >
          </TableCell>
        </TableRow> 
        {/* Email */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="email">
              <EmailIcon sx={{ marginRight: 1 }} />
              이메일
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            {emailChecked ? ( // Render input field if editing mode is true
              <Typography  sx={{ml:2}} >{email}</Typography>
            ) : (
              <TextField
                fullWidth 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}
            
          </TableCell>
          <TableCell sx={{p:1}}>
            {emailChecked ? (
              <Fab
                  color="success" 
                  size="small" 
                >
                  <IconCheck width={16} /> 
                </Fab>
            ):(
              <Button onClick={handleSendCode}>인증번호 발송</Button>
            )}
          </TableCell>
        </TableRow>
        
        {!emailChecked && 
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="password">
              인증번호
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }} >
            <TextField
              fullWidth
              variant="outlined"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              required
            />
          </TableCell>
          <TableCell sx={{ padding: 1 }} >
            <Button onClick={verifyPassword}>확인</Button>
          </TableCell>
        </TableRow> 
        }
        
      </TableBody>
      </Table>
        
      <Typography variant="h4" padding={1} marginTop={3}>회사정보</Typography>
        {/* Business Registration Number */}
      <Table>
      <TableBody>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="businessNumber">
              <BusinessIcon sx={{ marginRight: 1 }} />
              사업자 등록번호*
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
          {compChecked ? (
            <Typography  sx={{ml:2}} >{businessNumber}</Typography>
          ):(
            <TextField 
              fullWidth
              variant="outlined"
              value={businessNumber}
              onChange={(e) => setBusinessNumber(e.target.value)}
              required
              error={!isValidRegisterNum(businessNumber)}
              InputProps={{ placeholder: '000-00-00000' }} 
              // helperText={!isValidRegisterNum(businessNumber) && '(000-00-00000)'}
            /> 
          )}
            
          </TableCell>
          <TableCell sx={{ padding: 1 }}> 
          {compChecked ? (
            <Row  align={'middle'}>
            <Fab
                color="success" 
                size="small" 
              >
                <IconCheck width={16} /> 
              </Fab>
              <Typography sx={{mr:2}}>업체 명: {companyName}</Typography>
            </Row>
          
          ):(
            <Button onClick={handleBusinessNumberCheck}>조회</Button>
          )}
            
          </TableCell>
        </TableRow>
        {/* Address */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="address">
              <LocationOnIcon sx={{ marginRight: 1 }} />
              주소*
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </TableCell>
        </TableRow>
      </TableBody>
      </Table>
        <Typography variant="h4" padding={1} marginTop={3}>담당자 정보</Typography>
        {/* Name */}
      <Table>
        <TableBody>
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="name">
              <PersonIcon sx={{ marginRight: 1 }} />
              이름*
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </TableCell>
        </TableRow>
        {/* Phone */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="phone">
              <PhoneIcon sx={{ marginRight: 1 }} />
              연락처*
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </TableCell>
        </TableRow>
        {/* Department */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="department">
              <BusinessCenterIcon sx={{ marginRight: 1 }} />
              부서명
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </TableCell>
        </TableRow>
        {/* 직급 */}
        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="position">
              <AssignmentIndIcon sx={{ marginRight: 1 }} />
              직급
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell sx={{ backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center' }}>
            <InputLabel htmlFor="other">
              <AssignmentIndIcon sx={{ marginRight: 1 }} />
              비고
            </InputLabel>
          </TableCell>
          <TableCell sx={{ padding: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              value={other}
              onChange={(e) => setOther(e.target.value)}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    </TableContainer>


      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button color="primary" variant='contained' onClick={registerUser}>
          회원가입 신청
        </Button>
      </Box>

      {/* Dialog for messages */}
      <Dialog  open={dialog1Open} onClose={()=>setDialog1Open(false)}>
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent sx={{width:200}} >
          <DialogContentText>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialog1Close} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog  open={dialog2Open} onClose={()=>setDialog2Open(false)}>
        <DialogTitle sx={{textAlign: 'center'}}>{dialogTitle}</DialogTitle>
        <DialogContent sx={{width:350}} >
          <DialogContentText sx={{textAlign: 'center'}}>{dialogContent}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{setDialog2Open(false); router.push('/')}} color="primary">
            홈으로 이동
          </Button>
          <Button color="primary" variant='contained' onClick={handleDialog2Close} >
            로그인으로 이동
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AccountTab;

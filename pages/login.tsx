import React, { useState, useEffect } from 'react'; 
import { useRouter } from 'next/router';
import { TextField, Button, Box, Typography, Link, CircularProgress, FormControlLabel, } from '@mui/material';
import { nowEpoch } from '../src/utils/commonFunctions'
import { loginSuccess } from '../src/store/authSlice';
import { AppDispatch, useDispatch } from '../src/store/Store';
import axiosPost from '@pages/axiosWrapper';
import { API_URL } from '@pages/constant';
import CustomCheckbox from '@src/components/forms/theme-elements/CustomCheckbox';
import Cookies from 'js-cookie';

interface LoginResponse {
  loginResult: number;
  loginMessage: string;
  userData?: {
    userEmail: string;
  };
  authRequired?: boolean;
} 
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  const [validCode, setValidCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [authSent, setAuthSent] = useState(false);
  const [timer, setTimer] = useState<number>(180);
  const [checkTwo, setCheckTwo] = React.useState(false)//??
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();  

  const resetLogin = () => {
    setLoginAttempts(0);
    setErrorMessage('');
    setEmail('');
    setPassword(''); 
    setLoading(false);
    setTimer(0);
  };

  useEffect(() => {
    if (authSent) {
      // 5분 타이머 설정
      const countdown = setInterval(() => {
        setTimer((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      // 타이머 종료 시 인증번호 만료 처리
      if (timer === 0) {
        clearInterval(countdown);
        setErrorMessage('인증번호 입력시간이 경과했습니다. 다시 로그인해 주세요.');
        setAuthSent(false);
        setValidCode('');
      }

      return () => clearInterval(countdown);
    }
  }, [authSent, timer]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();  
    //dispatch(loginSuccess({id: 3, email:'123456' }));
    //Cookies.set('user', JSON.stringify({'email': '123', 'nickname': '123123'}))
    
    setLoading(true);

    if (loginAttempts >= 5) {
      setErrorMessage('로그인 시도 횟수 초과');
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      console.log(email, password);
      // postLogin은 로그인 요청을 보내는 비동기 함수입니다. 실제 구현 필요.
       let response: { [key: string]: any };
       response = {};
       if (authSent) {
        response = await axiosPost(`${API_URL}/user/Login`, { email: email, password: password, code: validCode });  
       }else{
        response = await  axiosPost(`${API_URL}/user/Login`, { email: email, password: password });   
       }
    

       response = response.data
       if (response.loginResult === 'send email') {
        if (checkTwo) {
          setErrorMessage('이메일 주소로 인증번호가 전송되었습니다.');
          setAuthSent(true); 
          setTimer(180)
        }
        else {
          sessionStorage.setItem('user', JSON.stringify(response.userData))
          sessionStorage.setItem('consignee_status', '')

          router.push('/');  
        }
       } else if (response.loginResult === 'success') { 
            // 로그인 성공 로직
            sessionStorage.setItem('user', JSON.stringify(response.userData))
            sessionStorage.setItem('consignee_status', '')

            router.push('/');
       } else if (response.loginResult == 'wrong password') {
        setErrorMessage(`입력하신 정보가 맞지 않습니다.(남은 횟수: ${response.remainCnt}번)`);
       }
       else if (response.loginResult == 'locked user') {
        setErrorMessage(`로그인 실패 5회로 10분 동안 로그인할 수 없습니다. ${Math.trunc(response.after / 60)}분 ${Math.trunc(response.after) % 60}초 뒤 다시 시도하세요.`);
       }
       else if (response.loginResult == 'invalid code') {
        setErrorMessage(`인증 번호가 정확하지 않습니다.`);
       }
       else if (response.loginResult == 'code expired') {
        setErrorMessage(`인증 번호 입력시간이 경과했습니다. 다시 로그인해 주세요.`);
        setAuthSent(false)
       }
       else if (response.loginResult == 'no user') {
        setErrorMessage(`사용자가 존재하지 않습니다.`);
       }
       else if (response.loginResult == 'not allowed') {
        setErrorMessage(`승인된 사용자가 아닙니다.`);
       }
       
    } catch (error) {
      console.error('Login error', error);
      setErrorMessage('서버와의 연결에 실패했습니다.');
    }

    setLoading(false);
  };
 
  return (
    <Box>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Box component="form" onSubmit={handleLogin} noValidate={false} sx={{ mt: 1, width:300 }}>
          
          <Typography  component="h1" variant="h5">로그인</Typography>
          
          <TextField margin="normal" disabled={authSent} required fullWidth id="email" label="이메일 주소" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField margin="normal" disabled={authSent} required fullWidth name="password" label="비밀번호" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {authSent && (
            <>
              <TextField margin="normal"   name="authCode" label="인증번호" type="text" id="authCode" value={validCode} onChange={(e) => {
                setValidCode(e.target.value);
                
              }} />
              <Typography variant="body2">남은 시간: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</Typography>
            </>
          )}
          
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : '로그인'}
          </Button>
          {/* <FormControlLabel
            sx={{mr:2}}
            control={
              <CustomCheckbox
                color="success"
                checked={checkTwo}
                onChange={(e:any) => {setCheckTwo(e.target.checked);}}
                inputProps={{ 'aria-label': 'checkbox with default color' }}
              />
            }
            label="2단계 인증"
          /> */}
          {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        </Box>
      </Box>
      <Box sx={{position: 'absolute', alignItems: 'center', bottom:0, height: 50, backgroundColor: 'grey', width: '100%', borderRadius:0, display: "flex"}}>
        <Link href="/introduction" underline="none" sx={{color: 'white', fontSize: 16, ml: 3}}>
            회사소개
        </Link>
        <Typography  sx={{color: 'white', fontSize:20, ml:1, mr: 1}}>
          |
        </Typography>
        <Link href="/privacy_policy" underline="none" sx={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
            개인정보처리방침
        </Link>
      </Box>
    </Box>
  );
}; 

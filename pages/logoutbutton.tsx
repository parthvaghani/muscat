
import React from 'react';
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../src/store/authSlice';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';

const LogoutButton: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    router.push('/login'); // 로그아웃 성공 후 로그인 페이지로 리디렉션
  };

  return (
    <Button variant="outlined" color="secondary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;

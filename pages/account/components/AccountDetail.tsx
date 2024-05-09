import React from 'react';
import { Table, TableBody, TableCell, TableRow, Typography, InputLabel, Divider } from '@mui/material';
import { UserType } from '@src/types/apps/account';

interface AccountDetailProps {
  selectedUserInfo: UserType;
}

const AccountDetail: React.FC<AccountDetailProps> = ({ selectedUserInfo }) => {
  return (
    <>
      <Typography variant="h4" padding={1} >기본정보</Typography>
      <Table> 
        <TableBody  > 
          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',width:'40%', border: '1px solid black' }}>
              <InputLabel htmlFor="id" sx={{ fontWeight: 'bold' , textAlign:'center'}}>아이디</InputLabel>
            </TableCell>
            <TableCell  sx={{ border: '1px solid black' }}>
              <InputLabel htmlFor="id" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.id}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' }}>
              <InputLabel htmlFor="password" sx={{ fontWeight: 'bold', textAlign:'center' }}>비밀번호</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="password" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.admin_name}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' , alignItems: 'center' }}>
              <InputLabel htmlFor="email" sx={{ fontWeight: 'bold',  textAlign:'center' }}>이메일</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="email" sx={{ flex: 1 , textAlign:'center'}}>
                {selectedUserInfo.user_email}
              </InputLabel>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Typography variant={"h4"} padding={1} marginTop={3}>회사정보</Typography>
      <Table > 
        <TableBody    >
        <TableRow sx={{   padding: 1, border: '1px solid black'   }}>
            <TableCell sx={{  backgroundColor: '#f0f0f0',  width: '40%' , border: '1px solid black',alignItems: 'center' }}>
              <InputLabel htmlFor="name" sx={{ fontWeight: 'bold', textAlign:'center' }}>업체명</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black'   }}>
              <InputLabel htmlFor="name" sx={{ flex: 1 , textAlign:'center'}}>
                {selectedUserInfo.company_name}
              </InputLabel>
            </TableCell>
          </TableRow>
          <TableRow sx={{ border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' ,   alignItems: 'center' }}>
              <InputLabel htmlFor="businessNumber" sx={{ fontWeight: 'bold', textAlign:'center' }}>사업자 등록번호</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black'  }}>
              <InputLabel htmlFor="businessNumber" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.register_num}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' ,   alignItems: 'center' }}>
              <InputLabel htmlFor="address" sx={{ fontWeight: 'bold', textAlign:'center' }}>주소</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1,   border: '1px solid black' }}>
              <InputLabel htmlFor="address" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.company_address}
              </InputLabel>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Typography variant="h4" padding={1} marginTop={3}>담당자 정보</Typography>
      <Table>
        <TableBody>
          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0', border: '1px solid black', width:'40%',alignItems: 'center' }}>
              <InputLabel htmlFor="name" sx={{ fontWeight: 'bold', textAlign:'center' }}>이름</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="name" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.manager_name}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' , alignItems: 'center' }}>
              <InputLabel htmlFor="phone" sx={{ fontWeight: 'bold', textAlign:'center' }}>연락처</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="phone" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.manager_phone}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' , alignItems: 'center' }}>
              <InputLabel htmlFor="department" sx={{ fontWeight: 'bold', textAlign:'center' }}>부서명</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="department" sx={{ flex: 1 , textAlign:'center'}}>
                {selectedUserInfo.manager_depart}
              </InputLabel>
            </TableCell>
          </TableRow>

          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' , alignItems: 'center' }}>
              <InputLabel htmlFor="position" sx={{ fontWeight: 'bold', textAlign:'center' }}>직급</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="position" sx={{ flex: 1, textAlign:'center' }}>
                {selectedUserInfo.manager_grade}
              </InputLabel>
            </TableCell>
          </TableRow>


          <TableRow sx={{ padding: 1, border: '1px solid black' }}>
            <TableCell sx={{ backgroundColor: '#f0f0f0',  border: '1px solid black' , alignItems: 'center' }}>
              <InputLabel htmlFor="other" sx={{ fontWeight: 'bold' , textAlign:'center'}}>비고</InputLabel>
            </TableCell>
            <TableCell sx={{ padding: 1, border: '1px solid black' }}>
              <InputLabel htmlFor="other" sx={{ flex: 1 , textAlign:'center'}}>
                {selectedUserInfo.other}
              </InputLabel>
            </TableCell>
          </TableRow>

        </TableBody>
      </Table>
    </>
  );
};

export default AccountDetail;

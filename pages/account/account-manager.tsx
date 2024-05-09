import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer'; 
import BlankCard from '@src/components/shared/BlankCard';
import CompanyList from './components/CompanyList';
import AccountList from './components/AccountList';
import { useState } from 'react';

const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '등록업체 및 계정관리',
  },
];

export default function EcomProductList() {
  const [selectedRegisterNum, setSelectedRegisterNum] = useState('000-00-00000');

  const handleCompanySelect = (registerNum:string) => {
    setSelectedRegisterNum(registerNum);
  };
  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="등록업체 및 계정관리" items={BCrumb} />
      
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <CompanyList handleCompanySelect={handleCompanySelect} />
      
        {/* Right part */}
        <AccountList register_num={selectedRegisterNum} />
       
    </PageContainer>
  );
};


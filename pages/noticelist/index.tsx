import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import NoticeList from './NoticeList';
import BlankCard from '@src/components/shared/BlankCard';

const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '공지사항',
  },
];

export default function EcomProductList() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="공지사항" items={BCrumb} />
      
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <NoticeList />
       
    </PageContainer>
  );
};


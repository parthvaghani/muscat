import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import ProjectList from './ProjectList';

const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '프로젝트관리',
  },
];

export default function EcomProductList() {

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="프로젝트관리" items={BCrumb} />
      
        {/* ------------------------------------------- */}
        {/* Left part */}
        {/* ------------------------------------------- */}
        <ProjectList />
       
    </PageContainer>
  );
};


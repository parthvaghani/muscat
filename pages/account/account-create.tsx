import * as React from 'react';
import PageContainer from '@src/components/container/PageContainer';
import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import { Grid, Tabs, Tab, Box, CardContent, Divider } from '@mui/material';

// components
import AccountTab from 'pages/account/components/AccountCreate'; 
import BlankCard from '@src/components/shared/BlankCard'; 
const BCrumb = [
  {
    to: '/account/account-manager',
    title: '계정관리',
  },
  {
    title: '계정 등록',
  },
];

 

export default function AccountSetting() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <PageContainer>
      {/* breadcrumb */}
      <Breadcrumb title="계정 등록" items={BCrumb} />
      {/* end breadcrumb */}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <BlankCard> 
            <CardContent> 
                <AccountTab /> 
            </CardContent>
          </BlankCard>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

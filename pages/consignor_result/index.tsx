import Breadcrumb from '@src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from '@src/components/container/PageContainer';
import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Box, TextField, InputLabel } from '@mui/material';

const BCrumb = [
  {
    to: '/',
    title: '메인',
  },
  {
    title: '점검 및 결과',
  },
];

export default function EcomProductList() {

  return (
    <PageContainer> 
      <Breadcrumb title="점검 및 결과" items={BCrumb} /> 
    </PageContainer>
  );
};


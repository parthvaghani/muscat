import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

interface DataItem {
  label: string;
  value: number;
}

const data: DataItem[] = [
  { label: 'A', value: 20 },
  { label: 'B', value: 50 },
  { label: 'C', value: 30 },
];

const VerticalBarWidget: React.FC = () => {
  return (
    <Box display="flex" alignItems="flex-end">
      {data.map((item: DataItem) => (
        <Box key={item.label} width="100px" mr={1}>
          <Box textAlign="center">
            <Typography variant="h6">{item.label}</Typography>
          </Box>
          <LinearProgress variant="determinate" value={item.value} />
          <Box textAlign="center">
            <Typography variant="subtitle1">{item.value}%</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default VerticalBarWidget;

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

const HorizontalBarWidget: React.FC = () => {
  return (
    <Box display="flex" flexDirection="column">
      {data.map((item: DataItem) => (
        <Box key={item.label} mb={1}>
          <Box display="flex" alignItems="center">
            <Typography variant="subtitle1">{item.label}</Typography>
            <Box ml={1} width="100%">
              <LinearProgress variant="determinate" value={item.value} />
            </Box>
            <Typography ml={1} variant="subtitle1">
              {item.value}%
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default HorizontalBarWidget;

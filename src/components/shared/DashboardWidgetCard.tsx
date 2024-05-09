import { useTheme } from '@mui/material/styles';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import { useSelector } from '../../store/Store';
import { AppState } from '../../store/Store';
import { IconGridDots } from '@tabler/icons-react';

type Props = {
  title: string;
  subtitle: string;
  dataLabel1: string;
  dataItem1: string;
  dataLabel2: string;
  dataItem2: string;
  children: JSX.Element;
};

const DashboardWidgetCard = ({
  title,
  subtitle,
  children,
  dataLabel1,
  dataItem1,
  dataLabel2,
  dataItem2,
}: Props) => {
  const customizer = useSelector((state: AppState) => state.customizer);

  const theme = useTheme();
  const borderColor = theme.palette.grey[100];

  return (
    <Card
      sx={{ padding: 0, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <CardContent sx={{ p: '30px' }}>
        {title ? (
          <Box>
            {title ? <Typography variant="h5">{title}</Typography> : ''}

            {subtitle ? (
              <Typography variant="subtitle2" color="textSecondary">
                {subtitle}
              </Typography>
            ) : (
              ''
            )}
          </Box>
        ) : null}

        {children}

        
      </CardContent>
    </Card>
  );
};

export default DashboardWidgetCard;

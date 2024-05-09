import React from 'react';
import { Box, Avatar, Typography, IconButton, Tooltip, useMediaQuery } from '@mui/material';
import { useSelector } from '../../../../../store/Store';
import { IconPower } from '@tabler/icons-react';
import { AppState } from '../../../../../store/Store';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const Profile = () => {
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const router = useRouter();

  const [user, setUser] = React.useState({
    type: 0,
    email: '',
    name: '',
    user_id: 0,
  })

  React.useEffect(() => {
    const str = sessionStorage.getItem('user')

    if (str)
      setUser(JSON.parse(str))
    else setUser({
      type: 0,
      email: '',
      name: '',
      user_id: 0
    })
  }, [])

  const onLogout = () => {
    sessionStorage.removeItem('user')
    router.push('/login')
  }

  let typeName = ''

  if (user.type == 0)
    typeName = '어드민'
  else if (user.type == 1)
    typeName = '수탁사'
  else if (user.type == 1)
    typeName = '위탁사'
  else if (user.type == 1)
    typeName = '마스터'

  return (
    <Box
      display={'flex'}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${'secondary.light'}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar alt="Remy Sharp" src={"/images/profile/user-1.jpg"} sx={{height: 40, width: 40}} />

          <Box>
            <Typography variant="h6">{user.name}</Typography>
            <Typography variant="caption">{typeName}</Typography>
          </Box>
          <Box sx={{ ml: 'auto' }}>
            <Tooltip title="Logout" placement="top">
              <IconButton
                color="primary"
                aria-label="logout"
                size="small"
                onClick={onLogout}
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ''
      )}
    </Box>
  );
};

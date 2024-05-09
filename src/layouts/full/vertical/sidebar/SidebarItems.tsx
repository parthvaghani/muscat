import React from 'react';
import { AdminMenuitems, ConsignorMenuitems, ConsigneeMenuitems } from '@pages/MenuItems';
import { useRouter } from 'next/router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useDispatch, useSelector } from '../../../../store/Store';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { AppState } from '../../../../store/Store'
import { toggleMobileSidebar } from '../../../../store/customizer/CustomizerSlice';


const SidebarItems = () => {
  const { pathname } = useRouter();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const customizer = useSelector((state: AppState) => state.customizer);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up('lg'));
  const hideMenu: any = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const [Menuitems, setMenuitems] = React.useState([])

  React.useEffect(() => {
    const str = sessionStorage.getItem('user')
    const type = JSON.parse(str).type
    if (type == 0 || type == 3) {
      setMenuitems(AdminMenuitems)
    }
    else if (type == 1) {
      setMenuitems(ConsigneeMenuitems)
    }
    else if (type == 2)
      setMenuitems(ConsignorMenuitems)
  }, [])

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {Menuitems.map((item) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                pathWithoutLastPart={pathWithoutLastPart}
                level={1}
                key={item.id}
                onClick={() => dispatch(toggleMobileSidebar())}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} hideMenu={hideMenu} onClick={() => dispatch(toggleMobileSidebar())} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;

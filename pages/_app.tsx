import React, { useEffect, useState } from 'react';
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { ThemeSettings } from "../src/theme/Theme";
import createEmotionCache from "../src/createEmotionCache";
import { Provider } from "react-redux";
import Store from "../src/store/Store"; 
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useSelector } from "../src/store/Store";
import { AppState } from "../src/store/Store";
import NextNProgress from "nextjs-progressbar";
import BlankLayout from "../src/layouts/blank/BlankLayout";
import FullLayout from "../src/layouts/full/FullLayout";
import { useRouter } from 'next/router'; 
import "../src/utils/i18n"; 
// CSS FILES
import "react-quill/dist/quill.snow.css";//??
import "./noticelist/notice-edit/Quill.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Login from './login';
import Cookies from 'js-cookie';
import "./calendar/Calendar.css"; 

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const layouts: any = {
  Blank: BlankLayout,
};

const MyApp = (props: MyAppProps) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
  }: any = props;
  const theme = ThemeSettings();
  const customizer = useSelector((state: AppState) => state.customizer);
  const Layout = layouts[Component.layout] || FullLayout;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginUser, setLoginUser] = React.useState('') 
  
  
  useEffect(() => {
    // 로딩 시간을 설정하여 앱이 초기화 될 때까지 기다립니다.
    setTimeout(() => setLoading(true), 1000);
    // 로그인 상태가 아니라면 로그인 페이지로 리다이렉션
    const currentUser = sessionStorage.getItem('user')

    setLoginUser(currentUser)
    
    if (!currentUser && router.pathname !== '/login' && router.pathname !== '/introduction' && router.pathname !== '/privacy_policy' && router.pathname !== '/sign_up') {
      router.push('/login');
    } else if (currentUser && router.pathname === '/login') { // 로그인 후 메인 페이지로 바로 이동
      setLoading(false)
      setTimeout(() => setLoading(true), 1000);
      router.push('/');
    }
    
  }, [router]);

  return ( 
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>수탁사 개인정보 관리 현황 점검 시스템</title>
      </Head>
      <NextNProgress color="#5D87FF" />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading ? (
          loginUser != null ? (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          ) :(<>
              {(router.pathname == '/introduction' ||  router.pathname == '/privacy_policy' ||  router.pathname == '/sign_up') ? (
                <Component {...pageProps} />
              ) : (
                <Login></Login> 
              )}
            </>
          ) 
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        )} 
    </ThemeProvider>
  </CacheProvider>
  );
};

export default (props: MyAppProps) => (
  <Provider store={Store}>
    <MyApp {...props} />
  </Provider>
);

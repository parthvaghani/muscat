import { configureStore } from '@reduxjs/toolkit';
import CustomizerReducer from './customizer/CustomizerSlice';
import CompanyReducer from './apps/CompanySlice'; 
import NoticeReducer from './apps/NoticeSlice';  
import { combineReducers } from 'redux';
import {
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
  TypedUseSelectorHook,
} from 'react-redux';
import authReducer from './authSlice';
import userReducer from './apps/UserSlice';  
  
 
 
export const store = configureStore({
  reducer: {
    auth: authReducer,
    customizer: CustomizerReducer, 
    companyReducer: CompanyReducer, 
    noticeReducer:NoticeReducer, 
    user: userReducer,
  },
});

const rootReducer = combineReducers({
  auth: authReducer,
  customizer: CustomizerReducer, 
  companyReducer: CompanyReducer, 
  noticeReducer:NoticeReducer, 
  user: userReducer,
});

// export type AppState = ReturnType<typeof rootReducer>;
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;
export const useDispatch = () => useAppDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<AppState> = useAppSelector;

export default store;


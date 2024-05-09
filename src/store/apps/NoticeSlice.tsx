import axiosPost,{axiosDelete} from '@pages/axiosWrapper';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { NoticeType } from '../../types/apps/notice'; // Assuming NoticeType is defined elsewhere
import { API_URL } from '@pages/constant';
import { dispatch } from '../Store';
 

interface StateType {
  notices: NoticeType[]; // Assuming NoticeType is defined elsewhere
  searchQuery: string;
  error: string | null;
}

const initialState: StateType = {
  notices: [],
  searchQuery: "",
  error: null,
};

export const registerNotice = createAsyncThunk(
  "notice/Register",
  async (noticeData: any, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/notice/Register`, noticeData);
      return { ...response.data, noticeData: { ...noticeData, id: response.data.id } };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteNotices = createAsyncThunk(
  'notices/deleteMultiple',
  async (noticeIds: string, { rejectWithValue }) => {
    try {
      const response = await axiosDelete(`${API_URL}/notice/Delete`, {
        data: { str_ids: noticeIds }
      });
      
      return { ...response.data, deletedNoticeIds: noticeIds};
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchNotices = createAsyncThunk(
  "notice/List",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/notice/List`,{});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const NoticeSlice = createSlice({
  name: "notice",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    }, 
  },
  extraReducers: (builder) => {
    builder 
      .addCase(registerNotice.fulfilled, (state, action) => {
        const noticeData = action.payload.noticeData; 
        state.notices.push(noticeData);
      })
      .addCase(deleteNotices.fulfilled, (state, action) => {
        if (action.payload.result === "SUCCESS") {
          const deletedNoticeIds = action.payload.deletedNoticeIds;
          state.notices = state.notices.filter(
            notice => !deletedNoticeIds.includes(notice.id)
          );
        } else {
          // Handle deletion failure
        }
      })
      .addCase(fetchNotices.fulfilled, (state, action) => {
        state.notices = action.payload;
      })
      .addMatcher(
        action => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload as string;
        }
      );
  },
});

export const {  
  setSearchQuery, 
} = NoticeSlice.actions;
 

export default NoticeSlice.reducer;

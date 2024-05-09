import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_URL } from '@pages/constant';
import { UserType } from "../../types/apps/account";
import axiosPost,{axiosDelete} from "@pages/axiosWrapper";
 

interface StateType {
  users: UserType[];
  searchQuery: string;
  error: string | null;
}

const initialState: StateType = {
  users: [],
  searchQuery: "",
  error: null,
};

// 유저 등록
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/user/Signup`, userData);
      return { ...response.data, userData: { ...userData,id:response.data.id }  }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
); 

// 유저 삭제
export const deleteUsers = createAsyncThunk(
  'user/deleteMultiple',
  async (userIds: string, { rejectWithValue }) => {
    try {
      const response = await axiosDelete(`${API_URL}/user/Delete`, {data: { str_ids: userIds  }} );
      return { ...response.data, userIds: userIds };
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// 유저 정보 업데이트
export const updateUser = createAsyncThunk(
  "user/update",
  async (userData: UserType, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/user/Update`, userData); // 사용자의 ID를 기반으로 업데이트 요청
      return response.data as UserType; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);


// 유저 정보 가져오기
export const fetchUsers = createAsyncThunk(
  "user/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/user/List`,{});
      return response.data as UserType[]; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        const userData = action.payload.userData; 
        console.log("userData:",userData);
        state.users.push(userData); 
      })
      .addCase(deleteUsers.fulfilled, (state, action) => {
        if (action.payload.result === "SUCCESS") {
          // 삭제된 회사 ID들을 반환하는 것으로 가정 
          const deletedUserIds = action.payload.userIds;
          state.users = state.users.filter(
            user => !deletedUserIds.includes(user.user_id)
          );
        } else {
          // 삭제에 실패한 경우 처리
          // 예를 들어, 에러 처리 또는 알림 표시 등을 수행할 수 있습니다.
        }
 
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        // 업데이트된 사용자 정보로 기존 사용자 정보를 교체
        state.users = state.users.map(user =>
          user.user_id === action.payload.user_id ? action.payload : user
        );
      })
      .addMatcher(
        action => action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.payload as string;
        }
      );
  },
});

export const { setSearchQuery } = UserSlice.actions;

export default UserSlice.reducer;

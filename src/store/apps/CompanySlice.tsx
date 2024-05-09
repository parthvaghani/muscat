import axiosPost,{axiosDelete} from '@pages/axiosWrapper';
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CompanyType } from '../../types/apps/company'; 
import { API_URL } from '@pages/constant';
import { dispatch } from '../Store';
 

interface StateType {
  companies: CompanyType[];
  searchQuery: string;
  error: string | null;
}

const initialState: StateType = {
  companies: [],
  searchQuery: "",
  error: null,
};

export const registerCompany = createAsyncThunk(
  "company/Register",
  async (companyData: any, { rejectWithValue }) => {
    try {
      const response = await axiosPost(`${API_URL}/company/Register`, companyData);
      return { ...response.data, companyData: { ...companyData,id:response.data.id }  }; 
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteCompanies = createAsyncThunk(
  'companies/deleteMultiple',
  async (companyIds: string, { rejectWithValue }) => {
    try {
      const response = await axiosDelete(`${API_URL}/company/Delete`, {
        data: { str_ids: companyIds }
      });
      
      
     return { ...response.data, deletedCompanyIds: companyIds};
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

 

export const fetchCompanies = createAsyncThunk(
  "company/List",
  async (_, { rejectWithValue }) => {
    try {
      console.log(`${API_URL}/company/List`);
      const response = await axiosPost(`${API_URL}/company/List`,{});
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

export const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    }, 
  },
  extraReducers: (builder) => {
    builder 
      .addCase(registerCompany.fulfilled, (state, action) => {
        const companyData = action.payload.companyData; 
        console.log("companyData:",companyData);
        state.companies.push(companyData);
      })
      .addCase(deleteCompanies.fulfilled, (state, action) => {
        if (action.payload.result === "SUCCESS") {
          // 삭제된 회사 ID들을 반환하는 것으로 가정 
          const deletedCompanyIds = action.payload.deletedCompanyIds;
          state.companies = state.companies.filter(
            company => !deletedCompanyIds.includes(company.id)
          );
        } else {
          // 삭제에 실패한 경우 처리
          // 예를 들어, 에러 처리 또는 알림 표시 등을 수행할 수 있습니다.
        }
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
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
} = CompanySlice.actions;
 

export default CompanySlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUerInfo } from "../../Services/user";

export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetch",
  async (id: number) => {
    const data = await getUerInfo(id);
    return data.profile;
  }
);

type userProfileType = {
  avatar: string;
  nickname: string;
  introduction: string;
  GitHub: string;
  email: string;
  discord: string;
  LinkedIn: string;
};

const initialState = {
  userProfile: {} as Record<number, userProfileType>,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.userProfile[action.payload.id] = action.payload;
    });
  },
});

export const { actions } = userSlice;
export default userSlice.reducer;

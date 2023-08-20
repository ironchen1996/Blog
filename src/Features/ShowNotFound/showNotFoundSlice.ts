import { createSlice } from "@reduxjs/toolkit";

const initialState = false;

const showNotFoundSlice = createSlice({
  name: "showNotFound",
  initialState,
  reducers: {
    setShowNotFound: (state, action) => {
      return action.payload;
    },
  },
});

export const { setShowNotFound } = showNotFoundSlice.actions;
export default showNotFoundSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getOptionsById } from "../../Services/options";

type optionsType = {
  logo: string;
  logoDiscribe: string;
  footerInfo: string;
};

export const fetchOptions = createAsyncThunk(
  "options/fetchOptions",
  async (id: number) => {
    const data = await getOptionsById(id);
    return data;
  }
);

const initialState = {
  options: {} as Record<number, optionsType>,
};

const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOptions.fulfilled, (state, action) => {
      state.options[action.payload.id] = action.payload;
    });
  },
});

export const { actions } = optionsSlice;
export default optionsSlice.reducer;

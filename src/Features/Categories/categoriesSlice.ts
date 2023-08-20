import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCategories, getCategoryById } from "../../Services/categories";

type categoryType = {
  id: number;
  name: string;
};

export const fetchCategories = createAsyncThunk(
  "categories/fetch",
  async () => {
    const response = await getCategories();
    return response.data;
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id: number) => {
    const response = await getCategoryById(id);
    return response.data;
  }
);

const initialState = {
  categories: [],
  categoryById: {} as Record<number, categoryType>,
  status: "idle",
};

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categories = action.payload;
    });
    builder.addCase(fetchCategories.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchCategoryById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.categoryById = action.payload;
    });
    builder.addCase(fetchCategoryById.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { actions } = categoriesSlice;
export default categoriesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getArticles, ArticleOption } from "../../Services/articles";
import { ARTICLE_LIST_PAGE_SIZE } from "../../Constants/PathName";

export const fetchSearchResults = createAsyncThunk(
  "searchResults/fetch",
  async ({ keyword, page, limit }: Partial<ArticleOption>) => {
    const data = await getArticles({
      keyword,
      page,
      limit,
    });
    return data;
  }
);

const initialState = {
  searchResults: [],
  status: "idle",
  totalSearchResults: 0,
  page: 1,
  limit: ARTICLE_LIST_PAGE_SIZE,
};

const searchResultsSlice = createSlice({
  name: "searchResults",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSearchResults.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchSearchResults.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.searchResults = action.payload.data;
      state.totalSearchResults = action.payload.total;
    });
    builder.addCase(fetchSearchResults.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { actions } = searchResultsSlice;
export default searchResultsSlice.reducer;

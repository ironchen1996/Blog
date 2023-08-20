import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getTagsService, TagOption } from "../../Services/tags";

export const fetchTags = createAsyncThunk(
  "tags/fetch",
  async ({ keyword }: Partial<TagOption>) => {
    const data = await getTagsService({ keyword });
    return data;
  }
);

const initialState = {
  tags: [],
  status: "idle",
  totalTags: 0,
};

const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.tags = action.payload.data;
      // state.totalTags = action.payload.total;
    });
    builder.addCase(fetchTags.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { actions } = tagsSlice;
export default tagsSlice.reducer;

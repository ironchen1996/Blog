import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getArticles,
  getArticleById,
  ArticleOption,
} from "../../Services/articles";

type articleType = {
  id: number;
  title: string;
  content: string;
  publishTime: string;
  create_time: string;
  category: {
    id: number;
    name: string;
  };
  tags: {
    id: number;
    name: string;
  }[];
  count: number;
  isRecommend: number;
  isTop: number;
};

export const fetchArticles = createAsyncThunk(
  "articles/fetch",
  async ({
    status,
    isRecommend,
    isTop,
    keyword,
    page,
    limit,
    title,
    fazzyTitle,
    categoryId,
    tags,
    create_time,
  }: Partial<ArticleOption>) => {
    const data = await getArticles({
      status,
      isRecommend,
      isTop,
      keyword,
      page,
      limit,
      title,
      fazzyTitle,
      categoryId,
      tags,
      create_time,
    });
    return data;
  }
);

export const fetchArticleById = createAsyncThunk(
  "articles/fetchById",
  async (id: number) => {
    const data = await getArticleById(id);
    return data;
  }
);

const initialState = {
  articles: [],
  articleById: {} as Record<number, articleType>,
  status: "idle",
  totalArticles: 0,
};

const articlesSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchArticles.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.articles = action.payload.data;
      state.totalArticles = action.payload.total;
    });
    builder.addCase(fetchArticles.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchArticleById.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchArticleById.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.articleById[action.payload.id] = action.payload;
    });
    builder.addCase(fetchArticleById.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export const { actions } = articlesSlice;
export default articlesSlice.reducer;

import axios from "./ajax";

export type ArticleOption = {
  page: number;
  limit: number;
  title: string;
  content: string;
  category: string;
  fazzyTitle: string;
  categoryId: string;
  tags: string[];
  keyword: string;
  status: string;
  isRecommend: number;
  isTop: number;
  create_time: Date[];
};

export interface CreateArticleRequest {
  title: string;
  content: string;
  categoryId: number;
  tags: string[];
  status: string;
  isRecommend: number;
  isTop: number;
}

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  categoryId?: number;
  tags?: string[];
  status?: string;
  isRecommend?: number;
  isTop?: number;
}

export async function postArticle(requestData: CreateArticleRequest) {
  const url = `/api/articles`;
  const response = await axios.post(url, requestData);
  return response.data;
}

export async function getArticles(opt: Partial<ArticleOption> = {}) {
  const { create_time } = opt;
  const params = {
    ...opt,
    create_time: create_time
      ? create_time.map((date) => date.toISOString())
      : undefined,
  };
  const url = `/api/articles`;
  const response = await axios.get(url, { params });
  return response.data;
}

export async function getArticleById(id: number) {
  const url = `/api/articles/${id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function updateArticle(
  id: number,
  opt: Partial<CreateArticleRequest> = {}
) {
  const { title, content, categoryId, tags, status, isRecommend, isTop } = opt;
  const url = `/api/articles/${id}`;
  const requestBody: UpdateArticleRequest = {};
  if (title !== undefined) {
    requestBody.title = title;
  }
  if (content !== undefined) {
    requestBody.content = content;
  }
  if (categoryId !== undefined) {
    requestBody.categoryId = categoryId;
  }
  if (tags !== undefined) {
    requestBody.tags = tags;
  }
  if (status !== undefined) {
    requestBody.status = status;
  }
  if (isRecommend !== undefined) {
    requestBody.isRecommend = isRecommend;
  }
  if (isTop !== undefined) {
    requestBody.isTop = isTop;
  }
  const response = await axios.patch(url, requestBody);
  return response.data;
}

export async function updateArticleStatus(
  articleIds: number[],
  opt: Partial<ArticleOption> = {}
) {
  const url = `/api/articles/status`;
  const { status } = opt;
  const response = await axios.post(url, { articleIds, status });
  return response.data;
}

export async function deleteArticle(id: number) {
  const url = `/api/articles/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

export async function deleteArticles(ids: number[]) {
  const url = `/api/articles/delete`;
  console.log(ids);
  const response = await axios.post(url, { ids });
  return response.data;
}

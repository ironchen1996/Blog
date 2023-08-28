import axios from "./ajax";

export type TagOption = {
  keyword: string;
  page: number;
  limit: number;
};

export type tagType = {
  keyword?: string;
};

export async function createTag(name: string) {
  const url = `/api/tags`;
  const response = await axios.post(url, { name });
  return response.data;
}

export async function getTagsService(opt: Partial<TagOption> = {}) {
  const url = `/api/tags`;
  const data = await axios.get(url, { params: opt });
  return data;
}

export async function getAllTagsService(opt: Partial<tagType> = {}) {
  const url = `/api/tags/all`;
  const response = await axios.get(url, { params: opt });
  return response.data;
}

export async function getTagService(opt: Partial<tagType> = {}) {
  const url = `/api/tags/tag`;
  const response = await axios.get(url, { params: opt });
  return response.data;
}

export async function updateTagService(id: number, name: string) {
  const url = `/api/tags/${id}`;
  const response = await axios.patch(url, { name });
  return response.data;
}

export async function deleteTag(id: number) {
  const url = `/api/tags/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

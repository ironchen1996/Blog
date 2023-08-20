import axios from "./ajax";

export async function createCategory(name: string) {
  const url = `/api/categories`;
  const response = await axios.post(url, name);
  return response.data;
}

export async function getCategories() {
  const url = `/api/categories`;
  const data = await axios.get(url);
  return data;
}

export async function getCategoryById(id: number) {
  const url = `/api/categories/${id}`;
  const data = await axios.get(url);
  return data;
}

export async function updateCategory(id: number, name: string) {
  const url = `/api/categories/${id}`;
  const response = await axios.patch(url, name);
  return response.data;
}

export async function deleteCategory(id: number) {
  const url = `/api/categories/${id}`;
  const response = await axios.delete(url);
  return response.data;
}

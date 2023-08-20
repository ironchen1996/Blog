import axios from "./ajax";

export interface updateOptionsRequest {
  logo: string;
  logoDiscribe: string;
  footerInfo: string;
}

export async function getOptionsById(id: number) {
  const url = `/api/options/${id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function updateOptions(id: number, params: updateOptionsRequest) {
  const url = `/api/options/${id}`;
  const response = await axios.patch(url, params);
  return response.data;
}

import axios, { ResDataType } from "./ajax";

export interface updateProfileRequest {
  avatar: string;
  nickname: string;
  introduction: string;
  GitHub?: string;
  email?: string;
  discord?: string;
  LinkedIn?: string;
}

export interface updatePasswordRequest {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export async function loginService(
  username: string,
  password: string
): Promise<ResDataType> {
  const url = `/api/auth/login`;
  const body = { username, password };
  const data = (await axios.post(url, body)) as ResDataType;
  return data;
}

export async function updatePassword(params: updatePasswordRequest) {
  const url = `/api/auth/update-password`;
  const response = await axios.patch(url, params);
  return response.data;
}

export async function getUerInfo(id: number) {
  const url = `/api/user/${id}`;
  const response = await axios.get(url);
  return response.data;
}

export async function updateUserProfile(
  id: number,
  params: updateProfileRequest
) {
  const url = `/api/user/profile/${id}`;
  const response = await axios.patch(url, params);
  return response.data;
}

import axios from "axios";
import { message } from "antd";
import { getToken } from "../Utils/user-token";

const instance = axios.create({
  timeout: 10 * 1000,
});

//response 拦截：每次请求都带上 token
instance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = `Bearer ${getToken()}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// response 拦截：统一处理 errno 和 msg
instance.interceptors.response.use(
  (response) => {
    const { data } = response;
    return data;
  },
  (error) => {
    const { response } = error;
    const { data, status } = response;
    const { message: errorMessage } = data;

    if (status >= 400 && status < 500) {
      // 客户端错误，如 404 Not Found
      console.log(errorMessage);
    } else if (status >= 500) {
      // 服务器错误
      message.error("服务器错误，请稍后重试。");
    }

    throw error;
  }
);

export default instance;

export type ResDataType = {
  [key: string]: any;
};

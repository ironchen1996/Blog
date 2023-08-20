import { useEffect } from "react";
import { KEY } from "../Constants/UserKey";
import { Modal } from "antd";
import { ADMIN_PATHNAME, LOGIN_PATHNAME } from "../Constants/PathName";

function useJWTExpiration() {
  const handleExpiredToken = () => {
    localStorage.removeItem(KEY);
    // 在这里执行其他退出操作
    Modal.warning({
      title: "Token 已过期",
      content: "请您重新登录",
      okText: "重新登录",
      onOk: () => {
        window.location.href = `${ADMIN_PATHNAME}${LOGIN_PATHNAME}`;
      },
    });
  };

  useEffect(() => {
    const token = localStorage.getItem(KEY); // 从 localStorage 获取 token
    if (!token) {
      return; // 如果没有 token，不进行后续操作
    }

    const decodedToken = JSON.parse(atob(token.split(".")[1])); // 解码 token
    const expirationTime = decodedToken.exp * 1000; // 转换为毫秒
    const currentTime = Date.now();

    if (expirationTime <= currentTime) {
      handleExpiredToken();
    }

    // 设置定时器，每隔一段时间检查一次
    const interval = setInterval(() => {
      const currentTime = Date.now();
      if (expirationTime <= currentTime) {
        handleExpiredToken();
        clearInterval(interval); // 清除定时器
      }
    }, 60000); // 每分钟检查一次

    return () => clearInterval(interval); // 在组件卸载时清除定时器
  }, []);
}

export default useJWTExpiration;

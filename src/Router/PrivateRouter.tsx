import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../Utils/user-token";
import { ADMIN_PATHNAME, LOGIN_PATHNAME } from "../Constants/PathName";

type PrivateRouteProps = {
  // 添加一个标志，用于判断是否需要登录验证
  requireAuth?: boolean;
  component: React.ReactNode;
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  requireAuth = true,
  component,
}) => {
  const token = getToken();
  const isAuthenticated = !!token;

  if (requireAuth && !isAuthenticated) {
    // 如果需要登录验证且未登录，直接导航到登录页
    return <Navigate to={`${ADMIN_PATHNAME}${LOGIN_PATHNAME}`} replace />;
  } else {
    return <>{component}</>;
  }
};

export default PrivateRoute;

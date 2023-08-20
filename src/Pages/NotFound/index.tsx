import React, { FC } from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HOME_PATHNAME } from "../../Constants/PathName";

const NotFoundPage: FC = () => {
  const nav = useNavigate();
  const onReturnHome = () => {
    nav(HOME_PATHNAME);
  };

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle="抱歉，您访问的页面不存在"
        extra={
          <Button type="primary" onClick={onReturnHome}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default NotFoundPage;

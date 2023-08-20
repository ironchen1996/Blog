import React, { FC } from "react";
import { Button, Result } from "antd";

type NotFoundPageProps = {
  subTitle: string;
  onReturnHome: () => void;
};

const NotFoundPage: FC<NotFoundPageProps> = ({ subTitle, onReturnHome }) => {
  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle={subTitle}
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

import React, { FC } from "react";
import { Space, Typography } from "antd";
import { Link } from "react-router-dom";
import styles from "./index.module.scss";
import { HOME_PATHNAME } from "../../Constants/PathName";

interface logoInfoProps {
  logoName: string;
  logoDiscribe: string;
}

const { Title } = Typography;

const Logo: FC<logoInfoProps> = ({ logoName, logoDiscribe }) => {
  return (
    <div className={styles.logo}>
      <Link to={HOME_PATHNAME}>
        <Space>
          <Title level={1} style={{ color: "#398EFC" }}>
            {logoName}
          </Title>
          <Title level={3} style={{ color: "#398EFC" }}>
            {logoDiscribe}
          </Title>
        </Space>
      </Link>
    </div>
  );
};

export default Logo;

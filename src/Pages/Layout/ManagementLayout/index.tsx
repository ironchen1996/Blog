import React, { FC, useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  FileTextOutlined,
  ExceptionOutlined,
  SettingOutlined,
  HomeOutlined,
  LogoutOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Layout, Menu, MenuProps, theme } from "antd";

import {
  ADMIN_PATHNAME,
  ARTICLESMANAGEMENT_PATHNAME,
  TRASHCANMANAGEMENT_PATHNAME,
  DRAFTSMANAGEMENT_PATHNAME,
  HOME_PATHNAME,
  LOGIN_PATHNAME,
  PROFILEMANAGEMENT_PATHNAME,
  OPTIONMANAGEMENT_PATHNAME,
} from "../../../Constants/PathName";
import { removeToken } from "../../../Utils/user-token";
import styles from "./index.module.scss";
import useJWTExpiration from "../../../Hooks/useJWTExpiration";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getMenagementItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

function getOtherItem(
  label: React.ReactNode,
  icon?: React.ReactNode,
  onClick?: () => void
): MenuItem {
  return {
    icon,
    label,
    onClick: onClick,
  } as MenuItem;
}

const ManagementItems: MenuItem[] = [
  getMenagementItem(
    "文章管理",
    "1",
    <Link to={`${ADMIN_PATHNAME}${ARTICLESMANAGEMENT_PATHNAME}`}>
      <FileTextOutlined />
    </Link>
  ),
  getMenagementItem(
    "草稿管理",
    "2",
    <Link to={`${ADMIN_PATHNAME}${DRAFTSMANAGEMENT_PATHNAME}`}>
      <ExceptionOutlined />
    </Link>
  ),
  getMenagementItem(
    "垃圾桶",
    "3",
    <Link to={`${ADMIN_PATHNAME}${TRASHCANMANAGEMENT_PATHNAME}`}>
      <DeleteOutlined />
    </Link>
  ),
  getMenagementItem("站点管理", "sub1", <SettingOutlined />, [
    getMenagementItem(
      <Link to={`${ADMIN_PATHNAME}${PROFILEMANAGEMENT_PATHNAME}`}>
        个人信息
      </Link>,
      "4"
    ),
    getMenagementItem(
      <Link
        to={`${ADMIN_PATHNAME}${OPTIONMANAGEMENT_PATHNAME}`}
        onClick={() => {
          localStorage.removeItem("activeKey");
        }}
      >
        系统设置
      </Link>,
      "5"
    ),
  ]),
];

const otherItem: MenuItem[] = [
  getOtherItem(
    "博客首页",
    <Link to={HOME_PATHNAME} target="_blank">
      <HomeOutlined />
    </Link>
  ),
  getOtherItem(
    "退出登录",
    <Link to={`${ADMIN_PATHNAME}${LOGIN_PATHNAME}`}>
      <LogoutOutlined />
    </Link>,
    () => removeToken()
  ),
];

const ManagementLayout: FC = () => {
  useJWTExpiration();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const storedSelectedKeys = localStorage.getItem("selectedKeys");
  const defaultSelectedKeys = storedSelectedKeys ? [storedSelectedKeys] : [];
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);

  useEffect(() => {
    const getPathname = location.pathname.split("/").pop();
    let selectedKey = "";

    switch (getPathname) {
      case "articles":
        selectedKey = "1";
        break;
      case "drafts":
        selectedKey = "2";
        break;
      case "trashes":
        selectedKey = "3";
        break;
      case "profile":
        selectedKey = "4";
        break;
      case "options":
        selectedKey = "5";
        break;
    }

    if (getPathname === "editor") {
      setCollapsed(true);
    }

    setSelectedKeys([selectedKey]);
    localStorage.setItem("selectedKeys", selectedKey);
  }, [location]);

  return (
    <Layout>
      <Sider
        collapsible
        collapsedWidth={"100px"}
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical"></div>
        <div>
          <div className={styles.firstMenu}>
            <Menu
              theme="dark"
              selectedKeys={selectedKeys}
              defaultOpenKeys={
                selectedKeys.includes("4") || selectedKeys.includes("5")
                  ? ["sub1"]
                  : undefined
              }
              mode="inline"
              items={ManagementItems}
            />
          </div>
          {/* <div className={styles.firstBlankBox}></div> */}
          <div className={styles.secondMenu}>
            <Menu
              selectedKeys={selectedKeys}
              theme="dark"
              mode="inline"
              items={otherItem}
            />
          </div>
        </div>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <Content>
          <div
            className={styles.contentPosition}
            style={{
              padding: 24,
              background: colorBgContainer,
              overflow: "hidden",
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer className={styles.footer} style={{ textAlign: "center" }}>
          {" "}
          Blog Management System ©2023 Created by IronChen
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ManagementLayout;

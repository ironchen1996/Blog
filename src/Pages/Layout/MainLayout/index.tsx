import React, { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { FloatButton, Layout } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { fetchOptions } from "../../../Features/Options/optionsSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../../Store";
import Logo from "../../../Components/Logo";
import Menus from "../../../Components/Menus";
import SearchBox from "../../../Components/SearchBox";
import Copyright from "../../../Components/Copyright";
import styles from "./index.module.scss";
import { ADMIN_PATHNAME, LOGIN_PATHNAME } from "../../../Constants/PathName";

const { Header, Content, Footer } = Layout;

const MainLayout: FC = () => {
  const dispatch: RootDispatch = useDispatch();
  const options = useSelector((state: RootState) => state.options.options[1]);

  const toLoginPages = () => {
    window.open(`${ADMIN_PATHNAME}${LOGIN_PATHNAME}`, "_blank");
  };

  useEffect(() => {
    dispatch(fetchOptions(1));
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <div style={{ margin: "0 0 0 80px" }}>
          <Logo
            logoName={options && options.logo}
            logoDiscribe={options && options.logoDiscribe}
          />
        </div>
        <div>
          <Menus />
        </div>
        <div style={{ margin: "0 0 0 100px" }}>
          <SearchBox />
        </div>
        <div>
          <UserOutlined className={styles.icon} onClick={toLoginPages} />
        </div>
      </Header>
      <Content className={styles.content}>
        <Outlet />
      </Content>
      <Footer className={styles.footer}>
        <Copyright footerInfo={options && options.footerInfo} />
      </Footer>
      <FloatButton.BackTop />
    </Layout>
  );
};

export default MainLayout;

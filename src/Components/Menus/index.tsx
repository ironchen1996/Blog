import React, { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootDispatch, RootState } from "../../Store";
import { setShowNotFound } from "../../Features/ShowNotFound/showNotFoundSlice";
import { fetchCategories } from "../../Features/Categories/categoriesSlice";
import { processCategoryData } from "../../Utils/processCategoryData";
import styles from "./index.module.scss";
import { HOME_PATHNAME } from "../../Constants/PathName";

const Menus: FC = () => {
  const dispatch: RootDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const categorys = useSelector(
    (state: RootState) => state.categories.categories
  );

  const processedData = processCategoryData(categorys);

  const location = useLocation();
  const storedSelectedKeys = localStorage.getItem("selectedKeys");
  const defaultSelectedKeys = storedSelectedKeys ? [storedSelectedKeys] : [];
  const [selectedKeys, setSelectedKeys] =
    useState<string[]>(defaultSelectedKeys);

  useEffect(() => {
    const categoryRegex = /^\/category\/(\d+)/;
    const match = location.pathname.match(categoryRegex);
    const key = match ? match[1] : "home";

    setSelectedKeys([key]);
    localStorage.setItem("selectedKeys", key);
  }, [location, dispatch]);

  const onClick: MenuProps["onClick"] = (e) => {
    dispatch(setShowNotFound(false));
    localStorage.setItem("selectedKeys", e.key);
  };

  return (
    <div className={styles.menu}>
      <Menu
        style={{ backgroundColor: "transparent" }}
        onClick={onClick}
        selectedKeys={selectedKeys}
        mode="horizontal"
      >
        <Menu.Item key="home">
          <Link to={HOME_PATHNAME}>首页</Link>
        </Menu.Item>
        {processedData &&
          processedData.map((item: { label: string; key: number }) => (
            <Menu.Item key={item.key}>
              <Link to={`/category/${item.key}`}>{item.label}</Link>
            </Menu.Item>
          ))}
      </Menu>
    </div>
  );
};

export default Menus;

import { Tabs, TabsProps } from "antd";
import React, { FC } from "react";
import SystemInfo from "../SystemInfo";
import CategoriesManagement from "../CategoriesManagement";
import TagsManagement from "../TagsManagement";
import PasswordManagement from "../PasswordManagement";

const items: TabsProps["items"] = [
  {
    key: "1",
    label: `站点信息`,
    children: <SystemInfo />,
  },
  {
    key: "2",
    label: `分类管理`,
    children: <CategoriesManagement />,
  },
  {
    key: "3",
    label: `标签管理`,
    children: <TagsManagement />,
  },
  {
    key: "4",
    label: `密码管理`,
    children: <PasswordManagement />,
  },
];

const SystemOptions: FC = () => {
  const storedActiveKey = localStorage.getItem("activeKey");
  const defaultActiveKey = storedActiveKey ? storedActiveKey : "1";

  const storageActiveKey = (activeKey: string) => {
    localStorage.setItem("activeKey", activeKey);
    console.log(activeKey);
  };

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={items}
      onChange={storageActiveKey}
    />
  );
};

export default SystemOptions;

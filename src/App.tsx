import React from "react";
import { RouterProvider } from "react-router-dom";
import Router from "./Router";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import cn from "antd/es/locale/zh_CN";
import "./App.css";

function App() {
  return (
    <ConfigProvider locale={cn}>
      <RouterProvider router={Router}></RouterProvider>
    </ConfigProvider>
  );
}

export default App;

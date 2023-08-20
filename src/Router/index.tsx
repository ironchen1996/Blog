import React from "react";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Pages/Layout/MainLayout";
import ManagementLayout from "../Pages/Layout/ManagementLayout";
import ArticlesList from "../Pages/ArticlesList";
import Article from "../Pages/Article";
import Login from "../Pages/Login";
import ArticleEditor from "../Pages/Admin/ArticleEditor";
import ArticlesManagement from "../Pages/Admin/ArticlesManagement";
import DraftsManagement from "../Pages/Admin/DraftsManagement";
import TrashCanManagement from "../Pages/Admin/TrashCanManagement";
import BlogerProfile from "../Pages/Admin/BlogerProfile";
import SystemOptions from "../Pages/Admin/SystemOptions";
import NotFound from "../Pages/NotFound";
import {
  ADMIN_PATHNAME,
  ARTICLESMANAGEMENT_PATHNAME,
  ARTICLE_PATHNAME,
  TRASHCANMANAGEMENT_PATHNAME,
  EDITOR_PATHNAME,
  CATEGORY_PATHNAME,
  DRAFTSMANAGEMENT_PATHNAME,
  HOME_PATHNAME,
  LOGIN_PATHNAME,
  PROFILEMANAGEMENT_PATHNAME,
  OPTIONMANAGEMENT_PATHNAME,
} from "../Constants/PathName";
import PrivateRoute from "./PrivateRouter";
import LoginRoute from "./LoginRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: `${HOME_PATHNAME}`,
        element: <ArticlesList />,
      },
      {
        path: `${CATEGORY_PATHNAME}/:id`,
        element: <ArticlesList />,
      },
      {
        path: `${CATEGORY_PATHNAME}/:id${ARTICLE_PATHNAME}/:id`,
        element: <Article />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: `${ADMIN_PATHNAME}${LOGIN_PATHNAME}`,
    element: <LoginRoute requireAuth component={<Login />} />,
  },
  {
    path: "",
    element: <PrivateRoute requireAuth component={<ManagementLayout />} />,
    children: [
      {
        path: `${ADMIN_PATHNAME}${EDITOR_PATHNAME}`,
        element: <ArticleEditor />,
      },
      {
        path: `${ADMIN_PATHNAME}${EDITOR_PATHNAME}/:id`,
        element: <ArticleEditor />,
      },
      {
        path: `${ADMIN_PATHNAME}${ARTICLESMANAGEMENT_PATHNAME}`,
        element: <ArticlesManagement />,
      },
      {
        path: `${ADMIN_PATHNAME}${DRAFTSMANAGEMENT_PATHNAME}`,
        element: <DraftsManagement />,
      },
      {
        path: `${ADMIN_PATHNAME}${TRASHCANMANAGEMENT_PATHNAME}`,
        element: <TrashCanManagement />,
      },
      {
        path: `${ADMIN_PATHNAME}${PROFILEMANAGEMENT_PATHNAME}`,
        element: <BlogerProfile />,
      },
      {
        path: `${ADMIN_PATHNAME}${OPTIONMANAGEMENT_PATHNAME}`,
        element: <SystemOptions />,
      },
    ],
  },
]);

export default router;

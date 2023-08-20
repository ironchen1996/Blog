import React, { FC } from "react";
import SearchBar from "../../../Components/SearchBar";
import ManagementList from "../../../Components/ManagementList";

const ArticlesManagement: FC = () => {
  return (
    <>
      <SearchBar />
      <ManagementList name="文章管理" pageName="publishing" />
    </>
  );
};

export default ArticlesManagement;

import React, { FC } from "react";
import SearchBar from "../../../Components/SearchBar";
import ManagementList from "../../../Components/ManagementList";

const TrashCanManagement: FC = () => {
  return (
    <>
      <SearchBar />
      <ManagementList name="分类管理" pageName="deletion" />
    </>
  );
};

export default TrashCanManagement;

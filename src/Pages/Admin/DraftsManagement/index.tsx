import React, { FC } from "react";
import SearchBar from "../../../Components/SearchBar";
import ManagementList from "../../../Components/ManagementList";

const DraftsManagement: FC = () => {
  return (
    <>
      <SearchBar />
      <ManagementList name="草稿管理" pageName="draft" />
    </>
  );
};

export default DraftsManagement;

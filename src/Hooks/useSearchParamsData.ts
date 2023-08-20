import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  LIST_PAGE_PARAM_KEY,
  ARTICLE_LIST_PAGE_SIZE,
  LIST_PAGE_SIZE_PARAM_KEY,
  MANAGEMENT_LIST_PAGE_SIZE,
} from "../Constants/PathName";

const useSearchParamsData = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const admin = pathSegments[1];

  const page = parseInt(searchParams.get(LIST_PAGE_PARAM_KEY) || "") || 1;
  const limit =
    parseInt(searchParams.get(LIST_PAGE_SIZE_PARAM_KEY) || "") ||
    (admin === "admin" ? MANAGEMENT_LIST_PAGE_SIZE : ARTICLE_LIST_PAGE_SIZE);

  const nav = useNavigate();
  const { pathname } = useLocation();
  const handlePageChange = (page: number, limit: number) => {
    searchParams.set(LIST_PAGE_PARAM_KEY, page.toString());
    searchParams.set(LIST_PAGE_SIZE_PARAM_KEY, limit.toString());
    nav({
      pathname,
      search: searchParams.toString(),
    });
  };

  return { page, limit, searchParams, handlePageChange };
};

export default useSearchParamsData;

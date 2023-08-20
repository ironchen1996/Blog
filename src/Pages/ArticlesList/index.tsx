import React, { FC, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, List, Pagination, Row, Typography } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import Profile from "../../Components/Profile";
import NotFoundPage from "../../Pages/NotFound/NotFoundPage";
import { setShowNotFound } from "../../Features/ShowNotFound/showNotFoundSlice";
import { fetchArticles } from "../../Features/Articles/articlesSlice";
import { fetchCategoryById } from "../../Features/Categories/categoriesSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootDispatch, RootState } from "../../Store";
import useSearchParamsData from "../../Hooks/useSearchParamsData";
import { processedArticlesListDate } from "../../Utils/processedArticlesListDate";
import styles from "./index.module.scss";
import {
  ARTICLE_PATHNAME,
  CATEGORY_PATHNAME,
  HOME_PATHNAME,
} from "../../Constants/PathName";
import MDEditor from "@uiw/react-md-editor";

const { Title, Text } = Typography;

const ArticlesList: FC = () => {
  const { id: categoryId } = useParams();
  const nav = useNavigate();

  const dispatch: RootDispatch = useDispatch();
  const showNotFound = useSelector((state: RootState) => state.showNotFound);
  const articles = useSelector((state: RootState) => state.articles.articles);
  const totalArticles = useSelector(
    (state: RootState) => state.articles.totalArticles
  );
  const articlesStatus = useSelector(
    (state: RootState) => state.articles.status
  );
  const categoryById = useSelector((state: RootState) => {
    if (categoryId) {
      return state.categories.categoryById[Number(categoryId)];
    }
  });

  const { page, limit, handlePageChange } = useSearchParamsData();

  const processedData = processedArticlesListDate(articles);

  const handleReturnHome = () => {
    dispatch(setShowNotFound(false));
    nav(HOME_PATHNAME);
  };

  useEffect(() => {
    const fetchArticlesData = async () => {
      await dispatch(
        fetchArticles({ page, limit, categoryId, status: "publishing" })
      );
    };
    fetchArticlesData();

    if (!categoryById) {
      const fetchCategoryByIdDate = async () => {
        if (categoryId) {
          const response = await dispatch(
            fetchCategoryById(Number(categoryId))
          );
          if (!response.payload) {
            dispatch(setShowNotFound(true));
          }
        }
      };
      fetchCategoryByIdDate();
    }
  }, [categoryId, dispatch, categoryById, page, limit]);

  return (
    <>
      {showNotFound ? (
        <NotFoundPage
          subTitle="抱歉，您访问的页面不存在"
          onReturnHome={handleReturnHome}
        />
      ) : (
        <Row gutter={10} className={styles.home}>
          <Col xs={4} sm={4} md={4} lg={4} xl={4}></Col>
          <Col xs={20} sm={20} md={12} lg={12} xl={12} className={styles.list}>
            <List
              size="large"
              footer={
                <Pagination
                  current={page}
                  pageSize={limit}
                  total={totalArticles}
                  onChange={handlePageChange}
                />
              }
              bordered={false}
              loading={articlesStatus === "loading"}
              dataSource={processedData}
              renderItem={(item: {
                id: number;
                title: string;
                content: string;
                publishTime: string;
                category: {
                  id: number;
                  name: string;
                };
                tags: {
                  id: number;
                  name: string;
                };
                count: number;
              }) => (
                <List.Item>
                  <Link
                    to={`${CATEGORY_PATHNAME}/${item.category.id}${ARTICLE_PATHNAME}/${item.id}`}
                  >
                    <div>
                      <Title level={2} className={styles.title}>
                        {item.title}
                      </Title>
                      <div className={styles.title}>
                        <p className={styles.p}>
                          <CalendarOutlined /> {item.publishTime}
                        </p>
                        <p className={styles.p}>
                          <FolderOpenOutlined /> {item.category.name}
                        </p>
                        <p className={styles.p}>
                          <EyeOutlined /> {item.count}
                        </p>
                      </div>
                      <MDEditor.Markdown
                        className={styles.textOverflowEllipsis}
                        style={{ backgroundColor: "#fff", color: "#000" }}
                        source={item.content}
                      />
                    </div>
                  </Link>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={0} sm={0} md={8} lg={8} xl={8}>
            <div className={styles.profile}>
              <Profile />
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ArticlesList;

import React, { FC, useEffect } from "react";
import { Card, Col, Row, Space, Spin, Tag, Typography } from "antd";
import {
  CalendarOutlined,
  EyeOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";
import Profile from "../../Components/Profile";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootDispatch, RootState } from "../../Store";
import { fetchArticleById } from "../../Features/Articles/articlesSlice";
import { fetchCategoryById } from "../../Features/Categories/categoriesSlice";
import { setShowNotFound } from "../../Features/ShowNotFound/showNotFoundSlice";
import moment from "moment";
import NotFoundPage from "../NotFound/NotFoundPage";
import { HOME_PATHNAME } from "../../Constants/PathName";
import MDEditor from "@uiw/react-md-editor";
import MarkdownNavbar from "markdown-navbar";
import { processedTagNameData } from "../../Utils/processedTagNameData";
import styles from "./index.module.scss";
import "markdown-navbar/dist/navbar.css";

const { Title, Text } = Typography;

const Article: FC = () => {
  const nav = useNavigate();
  const { id: articleId } = useParams<{ id: string }>();
  const categoryRegex = /^\/category\/(\d+)/;
  const location = useLocation();
  const match = location.pathname.match(categoryRegex);
  const categoryId = match?.[1];
  const dispatch: RootDispatch = useDispatch();
  const showNotFound = useSelector((state: RootState) => state.showNotFound);
  const article = useSelector((state: RootState) => {
    if (articleId) {
      return state.articles.articleById[Number(articleId)];
    }
  });
  // const [tags, SetTags] = useState([]);

  const tags = processedTagNameData(article?.tags ?? []);

  const handleReturnHome = () => {
    dispatch(setShowNotFound(false));
    nav(HOME_PATHNAME);
  };

  useEffect(() => {
    if (articleId) {
      const fetchArticleData = async () => {
        await dispatch(fetchArticleById(Number(articleId)));
      };

      fetchArticleData();
    }

    const fetchCategoryByIdDate = async () => {
      if (categoryId) {
        const response = await dispatch(fetchCategoryById(Number(categoryId)));
        if (!response.payload) {
          dispatch(setShowNotFound(true));
        }
      }
    };
    fetchCategoryByIdDate();
  }, [articleId, categoryId, dispatch]);

  if (!articleId || article === undefined) {
    return (
      <div className={styles.loading}>
        <Spin />
      </div>
    );
  }

  return (
    <div>
      {showNotFound ||
      article?.category.id != Number(categoryId) ||
      !article ? (
        <NotFoundPage
          subTitle={
            showNotFound
              ? "抱歉，您查看的页面不存在"
              : "抱歉，您查看的文章不存在"
          }
          onReturnHome={handleReturnHome}
        />
      ) : (
        <Row gutter={20}>
          <Col span={2}></Col>
          <Col
            xs={20}
            sm={20}
            md={12}
            lg={12}
            xl={12}
            span={12}
            className={styles.articleBox}
          >
            <Title level={3} className={styles.articleTitle}>
              {article?.title}
            </Title>
            <div className={styles.pBox}>
              <p className={styles.p}>
                <CalendarOutlined />{" "}
                {moment(article?.publishTime).format("YYYY-MM-DD")}
              </p>
              <p className={styles.p}>
                <FolderOpenOutlined /> {article?.category.name}
              </p>
              <p className={styles.p}>
                <EyeOutlined /> {article?.count}
              </p>
            </div>
            <MDEditor.Markdown
              source={article?.content}
              style={{ backgroundColor: "#fff", color: "#000" }}
            />
            <Space size={[0, "small"]} wrap className={styles.tagBox}>
              <Text style={{ color: "#000", fontWeight: "700" }}>标签：</Text>
              {tags.map((tag) => (
                <Tag key={tag.id} bordered={false} color="processing">
                  {tag.name}
                </Tag>
              ))}
            </Space>
          </Col>

          <Col xs={0} sm={0} md={8} lg={8} xl={8} span={8}>
            <div className={styles.profile}>
              <Profile />
              <Card className={styles.markdownNav}>
                <Title level={4} style={{ color: "#398EFC" }}>
                  文章目录
                </Title>
                <MarkdownNavbar
                  source={article?.content}
                  headingTopOffset={0}
                />
              </Card>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Article;

import React, { FC, useEffect, useState } from "react";
// import MarkdownGuide from "./MarkdownGuide";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Spin,
  Switch,
  message,
} from "antd";
import { fetchCategories } from "../../../Features/Categories/categoriesSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../../Store";
import MDEditor from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
// import ReactMarkdown from "react-markdown";
// import emoji from "remark-emoji";
// import gfm from "remark-gfm";
// import math from "remark-math";
import styles from "./index.module.scss";
import { processCategoryOptionData } from "../../../Utils/processCategoryOptionData";
import TagPicker from "../../../Components/TagPicker";
import { useRequest } from "ahooks";
import {
  CreateArticleRequest,
  UpdateArticleRequest,
  postArticle,
  updateArticle,
} from "../../../Services/articles";
import {
  ADMIN_PATHNAME,
  ARTICLESMANAGEMENT_PATHNAME,
} from "../../../Constants/PathName";
import { useNavigate, useParams } from "react-router-dom";
import { fetchArticleById } from "../../../Features/Articles/articlesSlice";

const ArticleEditor: FC = () => {
  const [form] = Form.useForm();
  const { id: articleId } = useParams<{ id: string }>();
  const [markdownValue, setMarkdownValue] = useState<string | undefined>("");
  const [status, setStatus] = useState("");
  const [isRecommend, setIsRecommend] = useState(0);
  const [isTop, setIsTop] = useState(0);
  const nav = useNavigate();

  const dispatch: RootDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );
  const article = useSelector((state: RootState) => {
    if (articleId) {
      return state.articles.articleById[Number(articleId)];
    }
  });
  const tags = article?.tags.map((tag) => {
    return tag.name;
  });

  console.log(isRecommend, isTop);

  const catogoryOption = processCategoryOptionData(categories);

  const { run, loading } = useRequest(
    async (requestData: CreateArticleRequest | UpdateArticleRequest) => {
      let data;
      if (article) {
        data = await updateArticle(
          Number(articleId),
          requestData as UpdateArticleRequest
        );
      } else {
        data = await postArticle(requestData as CreateArticleRequest);
      }
      return data;
    },
    {
      manual: true,
      onSuccess() {
        if (status === "draft") {
          message.success("保存成功");
        } else if (status === "publishing") {
          message.success("发布成功");
        }
        nav(`${ADMIN_PATHNAME}${ARTICLESMANAGEMENT_PATHNAME}`);
      },
      onError() {
        if (status === "draft") {
          message.error("保存失败");
        } else if (status === "publishing") {
          message.error("发布失败");
        }
      },
    }
  );

  const onFinish = async (value: any) => {
    const { title, content, categoryId, tags } = value;

    console.log(title, content, categoryId, tags, status, isRecommend, isTop);

    run({
      title,
      content,
      categoryId,
      tags,
      status,
      isRecommend,
      isTop,
    });
  };

  useEffect(() => {
    dispatch(fetchCategories());
    if (articleId) {
      dispatch(fetchArticleById(Number(articleId)));
    }
  }, []);

  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        categoryId: article.category.id,
        tags: tags,
      });
      setMarkdownValue(article.content);
      setIsRecommend(article.isRecommend);
      setIsTop(article.isTop);
    }
  }, [article, form]);

  return (
    <div>
      {loading ? (
        <Spin className={styles.loading} />
      ) : (
        <Form form={form} onFinish={onFinish}>
          <Row gutter={5}>
            <Col span={18}>
              <Row gutter={10}>
                <Col span={20}>
                  <Form.Item
                    label="标题"
                    name="title"
                    rules={[{ required: true, message: "文章标题不能为空" }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    label="分类"
                    name="categoryId"
                    rules={[{ required: true, message: "请选择分类" }]}
                  >
                    <Select size="large" options={catogoryOption} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="内容"
                    name="content"
                    rules={[{ required: true, message: "文章内容不能为空" }]}
                  >
                    <div data-color-mode="light">
                      <MDEditor
                        height={670}
                        value={markdownValue}
                        onChange={setMarkdownValue}
                        previewOptions={{
                          rehypePlugins: [[rehypeSanitize]],
                        }}
                      />
                    </div>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col span={6}>
              <Row gutter={10}>
                <Col span={24}>
                  <Form.Item>
                    <Button
                      className={styles.buttonOfSave}
                      size="large"
                      htmlType="submit"
                      onClick={() => {
                        setStatus("draft");
                      }}
                    >
                      保存草稿
                    </Button>
                    <Button
                      className={styles.marginLeft}
                      type="primary"
                      size="large"
                      htmlType="submit"
                      onClick={() => {
                        setStatus("publishing");
                      }}
                    >
                      发布文章
                    </Button>
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <TagPicker
                    mode="tags"
                    size="large"
                    styleStatus={true}
                    rules={[{ required: true, message: "标签不能为空" }]}
                  />
                </Col>
                <Col span={24}>
                  <Form.Item
                    className={styles.marginLeft}
                    label="是否推荐"
                    valuePropName="checked"
                  >
                    <Switch
                      checked={isRecommend === 1}
                      onChange={(checked) => {
                        setIsRecommend(checked ? 1 : 0);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    className={styles.marginLeft}
                    label="是否置顶"
                    valuePropName="checked"
                  >
                    <Switch
                      checked={isTop === 1}
                      onChange={(checked) => {
                        setIsTop(checked ? 1 : 0);
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default ArticleEditor;

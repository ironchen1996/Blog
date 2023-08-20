import React, { FC, useEffect, useState } from "react";
import { Col, Form, Input, Row, Select, DatePicker, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { fetchCategories } from "../../Features/Categories/categoriesSlice";
import { useSelector, useDispatch } from "react-redux";
import { RootState, RootDispatch } from "../../Store";
import { processCategoryOptionData } from "../../Utils/processCategoryOptionData";
import styles from "./index.module.scss";
import { MANAGEMENT_LIST_PAGE_SIZE } from "../../Constants/PathName";
import { fetchArticles } from "../../Features/Articles/articlesSlice";
import { useLocation } from "react-router-dom";
import TagPicker from "../TagPicker";

const { RangePicker } = DatePicker;

const SearchBar: FC = () => {
  const [form] = Form.useForm();
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const location = useLocation();
  const pathname = location.pathname.split("/")[2];

  let status: string;

  switch (pathname) {
    case "articles":
      status = "publishing";
      break;
    case "drafts":
      status = "draft";
      break;
    case "trashes":
      status = "deletion";
      break;
  }

  const handleExpandOn = () => {
    setExpanded(true);
  };

  const handleExpandOff = () => {
    setExpanded(false);
  };

  const dispatch: RootDispatch = useDispatch();
  const categories = useSelector(
    (state: RootState) => state.categories.categories
  );

  const catogoryOption = processCategoryOptionData(categories);

  const onFinish = async (values: any) => {
    const { title, category, tags, createTime } = values;

    dispatch(
      fetchArticles({
        fazzyTitle: title,
        categoryId: category,
        tags,
        create_time: createTime,
        status,
        limit: MANAGEMENT_LIST_PAGE_SIZE,
      })
    );

    setPage(1);
  };

  const reset = () => {
    dispatch(fetchArticles({ limit: MANAGEMENT_LIST_PAGE_SIZE, status }));
    setPage(1);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        <Row gutter={10}>
          <Col span={24}>
            <Row gutter={10}>
              <Col span={expanded ? 10 : 8}>
                <Form.Item label="标题" name="title">
                  <Input size="large" allowClear />
                </Form.Item>
              </Col>
              <Col span={expanded ? 4 : 3}>
                <Form.Item label="分类" name="category">
                  <Select size="large" options={catogoryOption} />
                </Form.Item>
              </Col>
              <Col span={expanded ? 10 : 9}>
                <TagPicker mode="multiple" size="large" resetPage={page} />
              </Col>
              {!expanded && (
                <Col span={4}>
                  <Form.Item>
                    <Button onClick={reset} size="large" htmlType="reset">
                      重置
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      htmlType="submit"
                      className={styles.marginLeft}
                    >
                      查询
                    </Button>
                    <Button
                      size="small"
                      className={styles.expandButton}
                      onClick={handleExpandOn}
                    >
                      展开 <DownOutlined />
                    </Button>
                  </Form.Item>
                </Col>
              )}
            </Row>
            {expanded && (
              <Row gutter={10}>
                <Col span={20}>
                  <Form.Item label="创建时间" name="createTime">
                    <RangePicker size="large" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item>
                    <Button onClick={reset} size="large" htmlType="reset">
                      重置
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      className={styles.marginLeft}
                      htmlType="submit"
                    >
                      查询
                    </Button>
                    <Button
                      size="small"
                      className={styles.expandButton}
                      onClick={handleExpandOff}
                    >
                      收起 <UpOutlined />
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchBar;

import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Col,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSelector, useDispatch } from "react-redux";
import { fetchArticles } from "../../Features/Articles/articlesSlice";
import { RootState, RootDispatch } from "../../Store";
import useSearchParamsData from "../../Hooks/useSearchParamsData";
import { processedManagementListData } from "../../Utils/processedManagementListData";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  ADMIN_PATHNAME,
  ARTICLE_PATHNAME,
  CATEGORY_PATHNAME,
  EDITOR_PATHNAME,
} from "../../Constants/PathName";
import styles from "./index.module.scss";
import {
  deleteArticle,
  deleteArticles,
  updateArticle,
  updateArticleStatus,
} from "../../Services/articles";

interface managementTitleProps {
  name: string;
  pageName: string;
}

const { Title } = Typography;

interface DataType {
  key: React.Key;
  id: number;
  title: string;
  category: {
    id: number;
    name: string;
  };
  tags: string[];
  createTime: string;
  isRecommend: number;
  isRecommendResult: string;
  isTop: number;
  isTopResult: string;
  count: number;
}

const ManagementList: FC<managementTitleProps> = ({ name, pageName }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const articleListIds = selectedRowKeys.map((key) =>
    parseInt(key as string, 10)
  );

  const dispatch: RootDispatch = useDispatch();
  const articles = useSelector((state: RootState) => state.articles.articles);
  const totalArticles = useSelector(
    (state: RootState) => state.articles.totalArticles
  );
  const status = useSelector((state: RootState) => state.articles.status);

  const [shouldFetchData, setShouldFetchData] = useState(false);

  const { page, limit, handlePageChange } = useSearchParamsData();

  const processedData: DataType[] = processedManagementListData(articles);

  const handleDataBulk = (status: string) => {
    updateArticleStatus(articleListIds, { status });
    setSelectedRowKeys([]);
    setShouldFetchData(true);
  };

  const handleDeleteDataBulk = () => {
    deleteArticles(articleListIds);
    setSelectedRowKeys([]);
    setShouldFetchData(true);
  };

  const confirm = (value: string, msg: string, id?: number) => {
    // console.log(e);
    switch (value) {
      case "publishing":
        if (id !== undefined) {
          updateArticle(id, { status: "publishing" });
          setShouldFetchData(true);
        }
        break;
      case "draft":
        if (id !== undefined) {
          updateArticle(id, { status: "draft" });
          setShouldFetchData(true);
        }
        break;
      case "deletion":
        console.log(id);
        if (id !== undefined) {
          updateArticle(id, { status: "deletion" });
          setShouldFetchData(true);
        }
        break;
      case "delete":
        if (id !== undefined) {
          deleteArticle(id);
          setShouldFetchData(true);
        }
        break;
      case "draftBulk":
        handleDataBulk("draft");
        break;
      case "deletionBulk":
        handleDataBulk("deletion");
        break;
      case "deleteBulk":
        handleDeleteDataBulk();
        break;
    }
    message.success(msg);
  };

  const cancel = () => {
    message.error("已取消");
  };

  const columns: ColumnsType<DataType> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "标题", dataIndex: "title", key: "title" },
    {
      title: "分类",
      dataIndex: "category",
      key: "category",
      render: (_, record) => record.category.name,
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
      sorter: {
        compare: (a, b) =>
          new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
      },
      render: (createTime) => moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "置顶",
      dataIndex: "isTopResult",
      key: "isTopResult",
      sorter: { compare: (a, b) => a.isTop - b.isTop },
    },
    {
      title: "推荐",
      dataIndex: "isRecommendResult",
      key: "isRecommendResult",
      sorter: { compare: (a, b) => a.isRecommend - b.isRecommend },
    },
    {
      title: "阅读量",
      dataIndex: "count",
      key: "count",
      sorter: { compare: (a, b) => a.count - b.count },
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {pageName === "publishing" || pageName === "draft" ? (
            <Link to={`${ADMIN_PATHNAME}${EDITOR_PATHNAME}/${record.id}`}>
              编辑
            </Link>
          ) : null}
          {pageName === "publishing" && (
            <Link
              to={`${CATEGORY_PATHNAME}/${record.category.id}${ARTICLE_PATHNAME}/${record.id}`}
              target="_blank"
            >
              查看
            </Link>
          )}
          {pageName === "publishing" || pageName === "deletion" ? (
            <Popconfirm
              title="存为草稿"
              description="确定将文章保存为草稿吗？"
              onConfirm={() => {
                confirm("draft", "已存为草稿", record.id);
              }}
              onCancel={cancel}
              okText="确认"
              cancelText="取消"
            >
              <a>{pageName === "publishing" ? "下架" : "草稿"}</a>
            </Popconfirm>
          ) : null}
          {pageName === "draft" && (
            <Popconfirm
              title="发布文章"
              description="确定要发布文章吗？"
              onConfirm={() => {
                confirm("publishing", "文章已发布", record.id);
              }}
              onCancel={cancel}
              okText="确认"
              cancelText="取消"
            >
              <a>发布</a>
            </Popconfirm>
          )}
          <Popconfirm
            title={
              pageName === "publishing" || pageName === "draft"
                ? "丢入垃圾桶"
                : "彻底删除"
            }
            description={
              pageName === "publishing" || pageName === "draft"
                ? "确定将文章丢入垃圾桶吗？"
                : "确定彻底删除文章吗？"
            }
            onConfirm={() => {
              confirm(
                pageName === "publishing" || pageName === "draft"
                  ? "deletion"
                  : "delete",
                pageName === "publishing" || pageName === "draft"
                  ? "已丢入垃圾桶"
                  : "已删除文章",
                record.id
              );
            }}
            onCancel={cancel}
            okText="确认"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const onSelectChange = (
    newSelectedRowKeys: React.Key[]
    // selectedRowKeys: DataType[]
  ) => {
    // console.log(
    //   "selectedRowKeys changed: ",
    //   newSelectedRowKeys,
    //   selectedRowKeys
    // );
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    if (page > 1 && articles.length === 1) {
      handlePageChange(page - 1, 10);
      dispatch(fetchArticles({ page, limit, status: pageName }));
      console.log(articles.length);
    } else {
      dispatch(fetchArticles({ page, limit, status: pageName }));
    }
    setShouldFetchData(false);
  }, [dispatch, page, limit, pageName, shouldFetchData]);

  return (
    <div>
      <Row>
        <Col span={22}>
          <Title level={3}>{name}</Title>
        </Col>
        <Col span={2}>
          {pageName === "publishing" && (
            <Link to={`${ADMIN_PATHNAME}${EDITOR_PATHNAME}`}>
              <Button type="primary" size="middle">
                新建文章
              </Button>
            </Link>
          )}
        </Col>
      </Row>
      {hasSelected && (
        <Row style={{ marginBottom: "10px" }}>
          <Col span={20}>
            <span style={{ marginLeft: 8 }}>
              {`已选择 ${selectedRowKeys.length} 项`}
            </span>
          </Col>
          <Col span={4} style={{ display: "flex" }}>
            <div style={{ marginLeft: "40px", marginRight: "10px" }}>
              {pageName === "publishing" || pageName === "deletion" ? (
                <Popconfirm
                  title="批量存为草稿"
                  description="确定将文章存为草稿吗？"
                  onConfirm={() => {
                    confirm("draftBulk", "已存为草稿");
                  }}
                  onCancel={cancel}
                  okText="确认"
                  cancelText="取消"
                >
                  <Button type="default" disabled={!hasSelected}>
                    {pageName === "publishing" ? "批量下架" : "恢复草稿"}
                  </Button>
                </Popconfirm>
              ) : null}
            </div>
            <div
              style={pageName === "draft" ? { marginLeft: "80px" } : undefined}
            >
              <Popconfirm
                title={
                  pageName === "publishing" || pageName === "draft"
                    ? "批量丢入垃圾桶"
                    : "批量删除"
                }
                description={
                  pageName === "publishing" || pageName === "draft"
                    ? "确定将文章丢入垃圾桶吗？"
                    : "确定彻底删除文章吗？"
                }
                onConfirm={() => {
                  confirm(
                    pageName === "publishing" || pageName === "draft"
                      ? "deletionBulk"
                      : "deleteBulk",
                    pageName === "publishing" || pageName === "draft"
                      ? "已丢入垃圾桶"
                      : "已删除文章"
                  );
                }}
                onCancel={cancel}
                okText="确认"
                cancelText="取消"
              >
                <Button type="default" disabled={!hasSelected}>
                  批量删除
                </Button>
              </Popconfirm>
            </div>
          </Col>
        </Row>
      )}
      <Table
        loading={status === "loading"}
        className={styles.containerStyle}
        rowSelection={{ ...rowSelection }}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          current: page,
          pageSize: limit,
          total: totalArticles,
          onChange: handlePageChange,
          showSizeChanger: true,
        }}
        dataSource={processedData}
      />
    </div>
  );
};

export default ManagementList;

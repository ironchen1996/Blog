import React, {
  ChangeEvent,
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Input, Modal, List, Spin, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { processedArticlesOfSearchBar } from "../../Utils/processedArticlesOfSearchBar";
import styles from "./index.module.scss";
import { ARTICLE_LIST_PAGE_SIZE } from "../../Constants/PathName";
import { useDebounceFn, useRequest } from "ahooks";
import { ArticleOption, getArticles } from "../../Services/articles";

const SearchBox: FC = () => {
  const [value, setValue] = useState("");
  const [totalResults, setTotalResults] = useState(0);
  const [inputting, setInputting] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [articlesList, setArticlesList] = useState<
    | {
        id: number;
        title: string;
        publishTime: string;
        categoryId: number;
      }[]
    | null
  >(null);
  const [searchParams] = useSearchParams();

  const { run, loading } = useRequest(
    async (requestData: Partial<ArticleOption> = {}) => {
      const data = await getArticles(requestData);
      return data;
    },
    {
      manual: true,
      onSuccess(result) {
        console.log(result);
        const processData = processedArticlesOfSearchBar(result.data);
        setArticlesList(articlesList?.concat(processData) ?? []);
        console.log(processData);
        setTotalResults(result.total);
        setPage(page + 1);
      },
      onError() {
        message.error("获取数据失败");
      },
    }
  );

  const haveMoreData = totalResults > (articlesList ? articlesList?.length : 0);

  const showModal = () => {
    setIsModalOpen(true);
    setValue("");
    setPage(1);
    setArticlesList([]);
  };

  const handleCancle = () => {
    setIsModalOpen(false);
    setValue("");
    setPage(1);
    setArticlesList([]);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setValue(searchValue);
    setInputting(false);
    setPage(1);
    setArticlesList([]);
  };

  const listRef = useRef<HTMLDivElement>(null);
  const listElem = listRef.current;

  const { run: delayedSearch } = useDebounceFn(
    () => {
      setInputting(true);
      if (value.trim() !== "") {
        run({
          keyword: value,
          status: "publishing",
          page,
          limit: ARTICLE_LIST_PAGE_SIZE,
        });
      }
    },
    {
      wait: 500,
    }
  );

  const { run: handleLoadMore } = useDebounceFn(
    () => {
      if (listElem === null) return;

      const scrolledToBottom =
        listElem.scrollHeight - listElem.scrollTop === listElem.clientHeight;

      if (scrolledToBottom) {
        run({
          keyword: value,
          status: "publishing",
          page,
          limit: ARTICLE_LIST_PAGE_SIZE,
        });
      }
    },
    {
      wait: 500,
    }
  );

  const loadMoreContentElem = useMemo(() => {
    if (loading) return <Spin />;
    if (
      value.trim() !== "" &&
      totalResults != 0 &&
      totalResults === (articlesList?.length ?? [])
    )
      return <span>没有更多了...</span>;
  }, [loading, value, articlesList]);

  useEffect(() => {
    if (value === "") {
      setInputting(true);
      setArticlesList([]);
    }

    delayedSearch();
  }, [value]);

  useEffect(() => {
    if (haveMoreData) {
      listElem?.addEventListener("scroll", handleLoadMore);
    }

    return () => {
      listElem?.removeEventListener("scroll", handleLoadMore);
    };
  }, [searchParams, haveMoreData]);

  return (
    <>
      <div onClick={showModal}>
        <SearchOutlined style={{ fontSize: "20px" }} />
      </div>
      <Modal open={isModalOpen} onCancel={handleCancle} centered footer={null}>
        <div>
          <Input
            size="large"
            placeholder="请输入关键词"
            allowClear
            prefix={<SearchOutlined />}
            bordered={false}
            className={styles.inputBar}
            value={value}
            onChange={handleChange}
          />
        </div>
        <div className={styles.listContainer} ref={listRef}>
          <List
            dataSource={articlesList ?? []}
            locale={{
              emptyText: (
                <span className={styles.emptyText}>
                  {!inputting ? (
                    <span>正在输入...</span>
                  ) : value.trim() !== "" && articlesList?.length === 0 ? (
                    <span>暂无搜索结果</span>
                  ) : (
                    <span>请输入内容并搜索</span>
                  )}
                </span>
              ),
            }}
            renderItem={(item: {
              id: number;
              title: string;
              publishTime: string;
              categoryId: number;
            }) => (
              <List.Item>
                <Link to={`/category/${item.categoryId}/article/${item.id}`}>
                  <div className={styles.dataList} onClick={handleCancle}>
                    <div className={styles.date}>{item.publishTime}</div>
                    <div>{item.title}</div>
                  </div>
                </Link>
              </List.Item>
            )}
          />
          <div className={styles.noMoreData}>{loadMoreContentElem}</div>
        </div>
      </Modal>
    </>
  );
};

export default SearchBox;

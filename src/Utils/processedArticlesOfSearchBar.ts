import moment from "moment";

//首页搜索栏数据处理
export function processedArticlesOfSearchBar(
  articles: {
    id: number;
    title: string;
    publishTime: string;
    category: {
      id: number;
    };
  }[]
) {
  return articles.map((item) => ({
    id: item.id,
    title: item.title,
    publishTime: moment(item.publishTime).format("YYYY-MM-DD"),
    categoryId: item.category.id,
  }));
}

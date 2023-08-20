import moment from "moment";

// 首页数据处理
export function processedArticlesListDate(
  articles:
    | {
        id: number;
        title: string;
        content: string;
        publishTime: string;
        create_time: string;
        update_time: string;
        category: {
          id: number;
          name: string;
        };
        tags: {
          id: number;
          name: string;
        };
        count: number;
      }[]
    | undefined
) {
  if (!articles) {
    return [];
  }

  return articles.map((item) => ({
    id: item.id,
    title: item.title,
    content: item.content,
    publishTime: moment(item.publishTime).format("YYYY-MM-DD"),
    create_time: moment(item.create_time).format("YYYY-MM-DD"),
    update_time: moment(item.update_time).format("YYYY-MM-DD"),
    category: {
      id: item.category.id,
      name: item.category.name,
    },
    tags: {
      id: item.tags.id,
      name: item.tags.name,
    },
    count: item.count,
  }));
}

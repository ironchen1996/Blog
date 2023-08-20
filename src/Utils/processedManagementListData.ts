//管理列表数据处理
export function processedManagementListData(
  articles: {
    id: number;
    title: string;
    category: {
      id: number;
      name: string;
    };
    tags: {
      id: number;
      name: string;
    }[];
    create_time: string;
    isRecommend: number;
    isTop: number;
    count: number;
  }[]
) {
  return articles.map((item) => ({
    key: item.id,
    id: item.id,
    title: item.title,
    category: {
      id: item.category.id,
      name: item.category.name,
    },
    tags: item.tags.map((tag) => tag.name),
    createTime: item.create_time,
    isRecommend: item.isRecommend,
    isRecommendResult: item.isRecommend === 1 ? "是" : "否",
    isTop: item.isTop,
    isTopResult: item.isTop === 1 ? "是" : "否",
    count: item.count,
  }));
}

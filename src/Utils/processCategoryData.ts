//Layout菜单数据处理
export function processCategoryData(
  categories: { id: number; name: string }[]
) {
  return categories.map((item) => ({
    key: item.id,
    label: item.name,
  }));
}

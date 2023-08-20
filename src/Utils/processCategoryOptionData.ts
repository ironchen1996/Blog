//Layout菜单数据处理
export function processCategoryOptionData(
  categories: { id: number; name: string }[]
) {
  return categories.map((item) => ({
    value: item.id,
    label: item.name,
  }));
}

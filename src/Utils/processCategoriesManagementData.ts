export function processCategoriesManagementData(
  categories: {
    id: number;
    name: string;
  }[]
) {
  return categories.map((item) => ({
    key: item.id,
    id: item.id,
    name: item.name,
  }));
}

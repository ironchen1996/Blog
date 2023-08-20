export function processedTagNameData(data: { id: number; name: string }[]) {
  return data.map((tag) => ({
    id: tag.id,
    name: tag.name,
  }));
}

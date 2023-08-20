export function processTagOptionData(data: { id: number; name: string }[]) {
  return data.map((tag) => ({
    key: tag.id.toString(),
    label: tag.name,
    value: tag.name,
  }));
}

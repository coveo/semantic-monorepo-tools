export default function (key: string, value?: string): string[] {
  if (value !== undefined) {
    return [key, value];
  }
  return [];
}

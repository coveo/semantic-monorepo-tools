export default function (key: string, value?: boolean): string[] {
  return value ? [key] : [];
}

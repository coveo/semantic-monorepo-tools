export default function (key: string, value?: string): string[] {
  return value ?? [key, value]  : [];
}

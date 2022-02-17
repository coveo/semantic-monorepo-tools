export default function (excludePackages: string[]) {
  return excludePackages.map((exclude: string) => `--filter="!${exclude}"`);
}

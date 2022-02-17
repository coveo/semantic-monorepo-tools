export default function (includePackages: string[]) {
  return includePackages.map((include: string) => `--filter="${include}"`);
}

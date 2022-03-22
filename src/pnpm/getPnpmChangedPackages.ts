import { runOnChanged } from "./utils/runOnChanged.js";

/**
 * Get the name of every package that changed
 * @param since selects all the packages changed since the specified commit/branch/tag
 * @param excludePackages filter out the specified packages/directory from the output
 * @return an array representing the output of the command in each changed package
 */
export default function (
  since: string,
  excludePackages: string[] = []
): string[] {
  const out = runOnChanged(
    "printenv PNPM_PACKAGE_NAME",
    since,
    [],
    excludePackages
  ).stdout.trim();
  if (out.includes("No projects matched the filters in")) {
    return [];
  }
  return out.split("\n");
}

import { runOnChanged } from "./utils/runOnChanged";

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
  return runOnChanged("printenv PNPM_PACKAGE_NAME", since, [], excludePackages);
}

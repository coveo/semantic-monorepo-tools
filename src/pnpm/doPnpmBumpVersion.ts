import { runOnChanged } from "./utils/runOnChanged.js";

/**
 * Bump all changed packages to version {newVersion}
 * @param newVersion the version to bump can be a version number or bump type
 * @param since selects all the packages changed since the specified commit/branch/tag
 * @param forcePackages also bump the version in those packages
 * @param excludePackages filter out the specified packages/directory from the output
 */
export default function (
  newVersion: string,
  since: string,
  forcePackages: string[] = [],
  excludePackages: string[] = []
) {
  return runOnChanged(
    `pnpm version ${newVersion} --no-git-tag-version`,
    since,
    forcePackages,
    excludePackages
  );
}

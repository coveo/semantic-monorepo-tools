import spawnSync from "../utils/spawnSync.js";
import getOptionalArgument from "../utils/getOptionalArgument.js";
import getExclusionFilters from "./utils/getExclusionFilters.js";
import getIncludeFilters from "./utils/getIncludeFilters.js";
import pnpmLogger from "./utils/pnpmLogger.js";

/**
 * Bump all changed packages to version {newVersion}
 * @param since selects all the packages changed since the specified commit/branch/tag
 * @param tag publishes the package with the given tag
 * @param branch primary branch of the repository which is used for publishing the latest changes
 * @param forcePackages also bump the version in those packages
 * @param excludePackages filter out the specified packages/directory from the output
 */
export default function (
  since: string,
  tag?: string,
  branch?: string,
  forcePackages: string[] = [],
  excludePackages: string[] = []
) {
  const pnpmArgs = [
    "--recursive",
    `--filter="...[${since}]"`,
    ...getIncludeFilters(forcePackages),
    ...getExclusionFilters(excludePackages),
    "publish",
  ].concat(
    getOptionalArgument("--tag", tag),
    getOptionalArgument("--publish-branch", branch)
  );
  spawnSync("pnpm", pnpmArgs, pnpmLogger);
}

import spawn from "../utils/spawn.js";
import pnpmLogger from "./utils/pnpmLogger.js";

/**
 * Update a package's tag in the npm registry to a specific version
 * @param packageName The name of the package to update
 * @param version The version to use for the update
 * @param tag The tag to update
 */
export default async function (
  packageName: string,
  version: string,
  tag: string,
) {
  const params = ["dist-tag", "add", `${packageName}@${version}`, tag];
  const pnpmPs = await spawn("pnpm", params, pnpmLogger);
  return pnpmPs.stdout.toString().trim();
}

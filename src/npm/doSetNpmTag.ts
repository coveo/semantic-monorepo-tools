import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

/**
 * Update a package's tag in the npm registry to a specific version
 * @param packageName The name of the package to update
 * @param version The version to use for the update
 * @param tag Th tag to update
 */
export default async function (
  packageName: string,
  version: string,
  tag: string,
) {
  const params = ["dist-tag", "add", [packageName, version].join("@"), tag];
  const npmPs = await spawn(appendCmdIfWindows`npm`, params, npmLogger);
  return npmPs.stdout.toString().trim();
}

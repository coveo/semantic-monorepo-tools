import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

/**
 * Get the tag of the last release
 * @param prefix only consider tag that has this prefix. Will return the last tag of the current branch by default.
 * @return an array containing the last tag and the process that was spawned
 */
export default async function (prefix?: string): Promise<string> {
  const gitParams = ["describe", "--tags", "--abbrev=0"];
  if (prefix) {
    gitParams.push(`--match='${prefix}*'`);
  }
  console.log(process.cwd());
  const gitPs = await spawn("git", gitParams, gitLogger, {
    cwd: process.cwd(),
  });

  return gitPs.stdout.trim();
}

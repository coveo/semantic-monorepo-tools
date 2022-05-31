import { randomBytes } from "node:crypto";
import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

/**
 * Get the commits for a specific path between from and to
 * @param projectPath only consider tag that has this prefix. Will return the last tag of the current branch by default.
 * @param from initial commit to consider
 * @param to last commit to consider, defaults to HEAD
 * @return an array containing the commits and the process that was spawned
 */
export default async function (
  projectPath: string,
  from: string,
  to = "HEAD"
): Promise<string[]> {
  const delimiter = `<--- ${randomBytes(64).toString("hex")} --->`;
  const gitParams = [
    "log",
    `--pretty=format:%B%n-hash-%n%H ${delimiter}`,
    "--dense",
    `${from}..${to}`,
    projectPath,
  ];
  const gitPs = await spawnSync("git", gitParams, gitLogger, {
    encoding: "ascii",
  });
  const commits = gitPs.stdout
    .split(delimiter)
    .map((str) => str.trim())
    .filter((str) => Boolean(str));

  return commits;
}

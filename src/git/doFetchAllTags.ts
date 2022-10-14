import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

/**
 * Get the all the tags.
 * @param remote which remote to use to fetch the tags.
 * @return an array containing the last tag and the process that was spawned
 */
export default async function (remote = "origin"): Promise<void> {
  await spawn(
    "git",
    ["fetch", "--depth=1", remote, "+refs/tags/*:refs/tags/*"],
    gitLogger
  );
}

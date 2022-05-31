import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (repo: string, branch: string) {
  await spawnSync("git", ["push", "-u", repo, branch], gitLogger);
}

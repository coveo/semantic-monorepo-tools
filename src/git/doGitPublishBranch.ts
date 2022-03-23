import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (repo: string, branch: string) {
  return spawnSync("git", ["push", "-u", repo, branch], gitLogger);
}

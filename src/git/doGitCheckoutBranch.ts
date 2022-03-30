import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (branchName: string) {
  return spawnSync("git", ["checkout", branchName], gitLogger);
}

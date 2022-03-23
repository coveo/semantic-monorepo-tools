import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function () {
  return spawnSync("git", ["write-tree"], gitLogger).stdout.trim();
}

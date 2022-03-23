import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (path: string) {
  return spawnSync("git", ["add", path], gitLogger);
}

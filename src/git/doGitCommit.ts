import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (message: string, PATH: string) {
  spawnSync("git", ["add", PATH], gitLogger);

  return spawnSync("git", ["commit", "-m", message], gitLogger);
}

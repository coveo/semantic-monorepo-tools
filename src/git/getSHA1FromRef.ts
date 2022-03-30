import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (ref: string) {
  return spawnSync("git", ["rev-parse", ref], gitLogger).stdout.trim();
}

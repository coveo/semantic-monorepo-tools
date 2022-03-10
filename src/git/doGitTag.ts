import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (tag: string) {
  return spawnSync(`git`, ["tag", tag], gitLogger);
}

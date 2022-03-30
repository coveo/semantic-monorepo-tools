import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function () {
  return spawnSync(
    "git",
    ["rev-parse", "--abbrev-ref", "HEAD"],
    gitLogger
  ).stdout.trim();
}

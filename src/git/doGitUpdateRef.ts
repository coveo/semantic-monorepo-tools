import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (ref: string, newValue: string) {
  return spawnSync(
    "git",
    ["update-ref", ref, newValue],
    gitLogger
  ).stdout.trim();
}

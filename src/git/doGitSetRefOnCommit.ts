import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (
  remote: string,
  completeRef: string,
  commitSha1: string
) {
  return spawnSync(
    "git",
    ["fetch", remote, `${commitSha1}:${completeRef}`],
    gitLogger
  );
}

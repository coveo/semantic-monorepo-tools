import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  remote: string,
  completeRef: string,
  commitSha1: string
) {
  await spawnSync(
    "git",
    ["fetch", remote, `${commitSha1}:${completeRef}`],
    gitLogger
  );
}

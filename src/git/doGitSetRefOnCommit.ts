import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  remote: string,
  completeRef: string,
  commitSha1: string
) {
  await spawn(
    "git",
    ["fetch", remote, `${commitSha1}:${completeRef}`],
    gitLogger
  );
}

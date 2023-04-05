import getOptionalBooleanFlagArgument from "../utils/getOptionalBooleanFlagArgument.js";
import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  remote: string,
  completeRef: string,
  commitSha1: string,
  force = false
) {
  const refPair = `${commitSha1}:${completeRef}`;
  if (refPair.startsWith("--") || remote.startsWith("--")) {
    throw new Error(
      `invalid param:${[remote, completeRef, commitSha1].join(",")}`
    );
  }
  await spawn(
    "git",
    ["fetch", remote, refPair].concat(
      getOptionalBooleanFlagArgument("--force", force)
    ),
    gitLogger
  );
}

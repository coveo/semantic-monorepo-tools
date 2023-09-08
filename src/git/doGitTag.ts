import getOptionalPositionalArgument from "../utils/getOptionalPositionalArgument.js";
import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (tag: string, commitSHA?: string) {
  await spawn(
    `git`,
    ["tag", tag].concat(getOptionalPositionalArgument(commitSHA)),
    gitLogger,
  );
}

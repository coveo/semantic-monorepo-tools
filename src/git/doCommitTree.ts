import getOptionalFlagArgument from "../utils/getOptionalFlagArgument.js";
import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  tree: string,
  parent?: string,
  message?: string,
) {
  return (
    await spawn(
      "git",
      ["commit-tree", tree].concat(
        getOptionalFlagArgument("-p", parent),
        getOptionalFlagArgument("-m", message),
      ),
      gitLogger,
    )
  ).stdout.trim();
}

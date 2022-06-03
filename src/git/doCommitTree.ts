import getOptionalArgument from "../utils/getOptionalArgument.js";
import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  tree: string,
  parent?: string,
  message?: string
) {
  return (
    await spawn(
      "git",
      ["commit-tree", tree].concat(
        getOptionalArgument("-p", parent),
        getOptionalArgument("-m", message)
      ),
      gitLogger
    )
  ).stdout.trim();
}

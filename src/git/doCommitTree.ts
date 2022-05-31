import getOptionalArgument from "../utils/getOptionalArgument.js";
import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  tree: string,
  parent?: string,
  message?: string
) {
  return (
    await spawnSync(
      "git",
      ["commit-tree", tree].concat(
        getOptionalArgument("-p", parent),
        getOptionalArgument("-m", message)
      ),
      gitLogger
    )
  ).stdout.trim();
}

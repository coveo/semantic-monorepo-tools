import getOptionalBooleanFlagArgument from "../utils/getOptionalBooleanFlagArgument.js";
import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

type GitPushFlags = {
  force: boolean;
};

const defaultGitPushFlag = { force: false };
export default async function (
  { force }: GitPushFlags | undefined = defaultGitPushFlag,
  remote = "origin",
  ...refs: string[]
) {
  await spawn(
    "git",
    ["push"]
      .concat(getOptionalBooleanFlagArgument("--force", force))
      .concat([remote, ...refs]),
    gitLogger
  );
}

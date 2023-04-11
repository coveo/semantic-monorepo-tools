import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

interface GitPushParams {
  force?: boolean;
  remote?: string;
  refs?: string[];
}

const defaultGitPushParams: GitPushParams = {
  force: false,
  remote: "origin",
  refs: [],
};
export default async function (opts: GitPushParams = defaultGitPushParams) {
  const { force, remote, refs } = { ...defaultGitPushParams, ...opts };
  await spawn(
    "git",
    ["push"].concat(force ? ["--force"] : []).concat([remote, ...refs]),
    gitLogger
  );
}

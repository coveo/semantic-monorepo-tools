import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

/**
 * Parameters of `gitPush`
 */
interface GitPushParams {
  /**
   * Use `--force` flag if true
   * @type {boolean}
   * @default [false]
   */
  force?: boolean;
  /**
   * Which remote to push to
   * @see https://git-scm.com/docs/git-push#_remotes
   * @default {'origin'}
   */
  remote?: string;
  /**
   * Which refs to push
   * @see {@link https://git-scm.com/docs/git-push#Documentation/git-push.txt-ltrefspecgt82308203| Git-SCM, git push, refspec}
   * @default {[]} @see {@link https://git-scm.com/docs/git-config#Documentation/git-config.txt-pushdefault| git config, push.default}}
   */
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
    gitLogger,
  );
}

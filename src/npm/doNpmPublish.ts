import getOptionalFlagArgument from "../utils/getOptionalFlagArgument.js";
import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

interface NpmOptions {
  /**
   * If you ask npm to install a package and don't tell it a specific version, then it will install the specified tag.
   * Also the tag that is added to the `package@version` specified by the npm tag command, if no explicit tag is given.
   * When used by the npm diff command, this is the tag used to fetch the tarball that will be compared with the local files by default.
   * @default "latest"
   * @see {@link https://docs.npmjs.com/cli/v8/commands/npm-publish#tag}
   */
  tag: string;
}

export default async function (PATH: string, npmOpts?: NpmOptions) {
  const params = ["publish"];
  for (const opt in npmOpts) {
    params.push(...getOptionalFlagArgument(`--${opt}`, npmOpts[opt]));
  }
  await spawn(appendCmdIfWindows`npm`, params, npmLogger, {
    cwd: PATH,
  });
}

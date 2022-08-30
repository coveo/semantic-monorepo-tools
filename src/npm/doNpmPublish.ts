import getOptionalFlagArgument from "../utils/getOptionalFlagArgument.js";
import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

interface NpmOptions {
  /**
   * Specify the tag to publish on
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

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
  tag?: string;
  /**
   * Indicates that a provenance statement should be generated.
   * @default false
   * @see {@link https://docs.npmjs.com/cli/v8/commands/npm-publish#provenance}
   */
  provenance?: boolean;
  /**
   * Specify the registry to publish to, overriding the default registry.
   * @default undefined
   * @see {@link https://docs.npmjs.com/cli/v9/using-npm/config#registry}
   */
  registry?: string;
}

export default async function (PATH: string, npmOpts?: NpmOptions) {
  const params = ["publish"];
  for (const optKey in npmOpts) {
    const optValue = npmOpts[optKey];
    switch (typeof optValue) {
      case "boolean":
        if (optValue) {
          params.push(`--${optKey}`);
        }
        break;
      case "string":
      case "number":
        params.push(...getOptionalFlagArgument(`--${optKey}`, npmOpts[optKey]));
        break;
    }
  }
  await spawn(appendCmdIfWindows`npm`, params, npmLogger, {
    cwd: PATH,
  });
}

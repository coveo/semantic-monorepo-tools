import getOptionalFlagArgument from "../utils/getOptionalFlagArgument.js";
import spawn from "../utils/spawn.js";
import pnpmLogger from "./utils/pnpmLogger.js";

interface PnpmOptions {
  /**
   * Specify the tag to publish on
   * @default "latest"
   * @see {@link https://pnpm.io/cli/publish#--tag-tag}
   */
  tag?: string;
  /**
   * Indicates that a provenance statement should be generated.
   * @default false
   * @see {@link https://pnpm.io/cli/publish#--provenance}
   */
  provenance?: boolean;
  /**
   * Specify the registry to publish to, overriding the default registry.
   * @default undefined
   * @see {@link https://pnpm.io/cli/publish#--registry-url}
   */
  registry?: string;
}

export default async function (PATH: string, pnpmOpts?: PnpmOptions) {
  const params = ["publish"];

  for (const [optKey, optValue] of Object.entries(pnpmOpts ?? {})) {
    switch (typeof optValue) {
      case "boolean":
        if (optValue) {
          params.push(`--${optKey}`);
        }
        break;
      case "string":
        params.push(...getOptionalFlagArgument(`--${optKey}`, optValue));
        break;
      case "number":
        params.push(
          ...getOptionalFlagArgument(`--${optKey}`, optValue.toString()),
        );
        break;
    }
  }

  await spawn("pnpm", params, pnpmLogger, {
    cwd: PATH,
  });
}

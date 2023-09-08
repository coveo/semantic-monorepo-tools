import spawn from "../../utils/spawn.js";
import getExclusionFilters from "./getExclusionFilters.js";
import getIncludeFilters from "./getIncludeFilters.js";
import pnpmLogger from "./pnpmLogger.js";

export const runOnChanged = async (
  cmd: string,
  since: string,
  forcePackages: string[],
  excludePackages: string[],
) => {
  const pnpmArgs = [
    "--recursive",
    `--filter="...[${since}]"`,
    ...getIncludeFilters(forcePackages),
    ...getExclusionFilters(excludePackages),
    "exec",
    cmd,
  ];
  return spawn("pnpm", pnpmArgs, pnpmLogger, {
    shell: true,
  });
};

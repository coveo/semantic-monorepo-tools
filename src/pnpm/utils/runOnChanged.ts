import { spawnSync } from "node:child_process";
import getExclusionFilters from "./getExclusionFilters.js";
import getIncludeFilters from "./getIncludeFilters.js";

export const runOnChanged = (
  cmd: string,
  since: string,
  forcePackages: string[],
  excludePackages: string[]
) => {
  const pnpmArgs = [
    "--recursive",
    `--filter="...[${since}]"`,
    ...getIncludeFilters(forcePackages),
    ...getExclusionFilters(excludePackages),
    "exec",
    "--",
    cmd,
  ];
  return spawnSync("pnpm", pnpmArgs, {
    encoding: "utf-8",
    shell: true,
  });
};

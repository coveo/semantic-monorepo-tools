import { spawnSync } from "node:child_process";
import getExclusionFilters from "./getExclusionFilters.js";
import getIncludeFilters from "./getIncludeFilters.js";

export const runOnChanged = (
  cmd: string,
  since: string,
  forcePackages: string[],
  excludePackages: string[]
): string[] => {
  const pnpmArgs = [
    "--recursive",
    `--filter="...[${since}]"`,
    ...getIncludeFilters(forcePackages),
    ...getExclusionFilters(excludePackages),
    "exec",
    "--",
    cmd,
  ];

  try {
    const out = spawnSync("pnpm", pnpmArgs, {
      encoding: "utf-8",
      shell: true,
    }).stdout.trim();
    if (out.includes("No projects matched the filters in")) {
      return [];
    }
    return out.split("\n");
  } catch (e) {
    // pnpm throws an error if no packages changed.
    return [];
  }
};

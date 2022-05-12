import semver from "semver";
import spawnSync from "../../utils/spawnSync.js";
import getExclusionFilters from "./getExclusionFilters.js";
import getIncludeFilters from "./getIncludeFilters.js";
import pnpmLogger from "./pnpmLogger.js";

export const runOnChanged = (
  cmd: string,
  since: string,
  forcePackages: string[],
  excludePackages: string[]
) => {
  const pnpmVersion = semver.parse(
    spawnSync("pnpm", ["--version"], pnpmLogger).stdout.trim()
  );
  const pnpmArgs = [
    "--recursive",
    `--filter="...[${since}]"`,
    ...getIncludeFilters(forcePackages),
    ...getExclusionFilters(excludePackages),
    "exec",
    // pnpm@6 requires "--" before the command, pnpm@7 doesn't
    ...(pnpmVersion.major === 6 ? ["--"] : []),
    cmd,
  ];
  return spawnSync("pnpm", pnpmArgs, pnpmLogger, {
    shell: true,
  });
};

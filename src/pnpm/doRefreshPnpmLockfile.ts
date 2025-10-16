import spawn from "../utils/spawn.js";
import pnpmLogger from "./utils/pnpmLogger.js";

export default async function (PATH: string) {
  await spawn("pnpm", ["install", "--lockfile-only"], pnpmLogger, {
    cwd: PATH,
  });
}

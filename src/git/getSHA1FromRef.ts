import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (
  ref: string,
  args: string[] = [],
): Promise<string> {
  return (
    await spawn("git", ["rev-parse", ...args, ref], gitLogger)
  ).stdout.trim();
}

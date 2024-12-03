import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function gitDiff(args: string[] = []): Promise<string[]> {
  return (
    await spawn(
      "git",
      ["--no-pager", "diff", "--name-only", ...args],
      gitLogger,
    )
  ).stdout
    .trim()
    .split("\n");
}

import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function gitDiff() {
  return (
    await spawn("git", ["--no-pager", "diff", "--name-only"], gitLogger)
  ).stdout
    .trim()
    .split("\n");
}

import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function gitDiff() {
  await spawn("git", ["diff"], gitLogger);
}

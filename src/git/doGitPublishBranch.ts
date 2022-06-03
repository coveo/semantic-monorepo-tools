import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (repo: string, branch: string) {
  await spawn("git", ["push", "-u", repo, branch], gitLogger);
}

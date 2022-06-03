import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (branchName: string) {
  await spawn("git", ["checkout", branchName], gitLogger);
}

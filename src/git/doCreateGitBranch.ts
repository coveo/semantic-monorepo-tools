import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (branchName: string) {
  await spawnSync("git", ["branch", branchName], gitLogger);
}

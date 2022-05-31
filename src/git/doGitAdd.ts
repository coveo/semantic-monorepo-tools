import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (path: string) {
  await spawnSync("git", ["add", path], gitLogger);
}

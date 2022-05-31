import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (message: string, PATH: string) {
  await spawnSync("git", ["add", PATH], gitLogger);

  await spawnSync("git", ["commit", "-m", message], gitLogger);
}

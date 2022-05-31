import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function () {
  await spawnSync("git", ["push", "--tags"], gitLogger);
}

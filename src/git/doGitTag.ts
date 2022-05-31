import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (tag: string) {
  await spawnSync(`git`, ["tag", tag], gitLogger);
}

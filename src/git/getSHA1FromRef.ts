import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (ref: string) {
  return (await spawnSync("git", ["rev-parse", ref], gitLogger)).stdout.trim();
}

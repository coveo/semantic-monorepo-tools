import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (ref: string, newValue: string) {
  return (
    await spawnSync("git", ["update-ref", ref, newValue], gitLogger)
  ).stdout.trim();
}

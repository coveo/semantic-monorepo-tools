import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (remote = "origin", ...refs: string[]) {
  await spawnSync("git", ["push", remote, ...refs], gitLogger);
}

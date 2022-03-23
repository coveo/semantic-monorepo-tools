import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (remote = "origin", ...refs: string[]) {
  return spawnSync("git", ["push", remote, "--delete", ...refs], gitLogger);
}

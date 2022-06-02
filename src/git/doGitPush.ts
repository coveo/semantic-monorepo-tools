import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (remote = "origin", ...refs: string[]) {
  await spawn("git", ["push", remote, ...refs], gitLogger);
}

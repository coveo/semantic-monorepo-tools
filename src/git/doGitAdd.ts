import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (path: string) {
  await spawn("git", ["add", path], gitLogger);
}

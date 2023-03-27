import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function () {
  await spawn("git", ["pull"], gitLogger);
}

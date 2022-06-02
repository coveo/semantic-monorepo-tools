import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (message: string, PATH: string) {
  await spawn("git", ["add", PATH], gitLogger);

  await spawn("git", ["commit", "-m", message], gitLogger);
}

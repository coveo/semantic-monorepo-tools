import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (tag: string) {
  await spawn(`git`, ["tag", tag], gitLogger);
}

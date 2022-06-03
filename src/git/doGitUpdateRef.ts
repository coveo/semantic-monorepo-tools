import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (ref: string, newValue: string) {
  return (
    await spawn("git", ["update-ref", ref, newValue], gitLogger)
  ).stdout.trim();
}

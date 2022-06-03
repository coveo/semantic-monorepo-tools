import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function () {
  return (await spawn("git", ["remote"], gitLogger)).stdout.trim();
}

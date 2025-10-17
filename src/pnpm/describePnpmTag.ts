import spawn from "../utils/spawn.js";
import pnpmLogger from "./utils/pnpmLogger.js";

export default async function (packageName: string, tag = "latest") {
  const params = ["view", `${packageName}@${tag}`, "version"];
  const pnpmPs = await spawn("pnpm", params, pnpmLogger);
  return pnpmPs.stdout.toString().trim();
}

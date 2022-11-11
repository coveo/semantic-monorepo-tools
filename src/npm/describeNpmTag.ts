import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

export default async function (packageName: string, tag = "latest") {
  const params = ["view", [packageName, tag].join("@"), "version"];
  const npmPs = await spawn(appendCmdIfWindows`npm`, params, npmLogger);
  return npmPs.stdout.toString().trim();
}

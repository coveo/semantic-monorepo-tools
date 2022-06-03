import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

export default async function (PATH: string) {
  await spawn(
    appendCmdIfWindows`npm`,
    ["install", "--package-lock-only"],
    npmLogger,
    {
      cwd: PATH,
    }
  );
}

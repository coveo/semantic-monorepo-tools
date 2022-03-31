import spawnSync from "../utils/spawnSync.js";
import { appendCmdIfWindows } from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

export default function (PATH: string) {
  return spawnSync(
    appendCmdIfWindows`npm`,
    ["install", "--package-lock-only"],
    npmLogger,
    {
      cwd: PATH,
    }
  );
}

import spawnSync from "../utils/spawnSync.js";
import { appendCmdIfWindows } from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

export default function (newVersion: string, PATH: string) {
  const npmArgs = ["version", newVersion, "--git-tag-version=false"];

  return spawnSync(appendCmdIfWindows`npm`, npmArgs, npmLogger, {
    cwd: PATH,
  });
}

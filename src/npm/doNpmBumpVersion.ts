import { spawnSync } from "node:child_process";
import { appendCmdIfWindows } from "./utils/appendCmdIfWindows.js";
export default function (newVersion: string, PATH: string) {
  return spawnSync(
    appendCmdIfWindows`npm`,
    ["version", newVersion, "--git-tag-version=false"],
    {
      cwd: PATH,
      encoding: "utf-8",
    }
  );
}

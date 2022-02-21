import { spawnSync } from "node:child_process";
import { appendCmdIfWindows } from "./utils/appendCmdIfWindows.js";

export default function (PATH: string) {
  spawnSync(appendCmdIfWindows`npm`, ["publish"], { cwd: PATH });
}

import { spawnSync } from "node:child_process";

export default function (message: string, PATH: string) {
  spawnSync("git", ["add", PATH]);
  return spawnSync("git", ["commit", "-m", message], { encoding: "utf-8" });
}

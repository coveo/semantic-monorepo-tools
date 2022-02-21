import { spawnSync } from "node:child_process";

export default function (tag: string) {
  return spawnSync(`git`, ["tag", tag], { encoding: "utf-8" });
}

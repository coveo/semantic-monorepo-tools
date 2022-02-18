import { spawnSync } from "node:child_process";

export default function () {
  return spawnSync("git", ["remote"], { encoding: "utf-8" }).stdout.trim();
}

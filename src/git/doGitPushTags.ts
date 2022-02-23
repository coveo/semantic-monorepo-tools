import { spawnSync } from "node:child_process";

export default function () {
  return spawnSync("git", ["push", "--tags"], { encoding: "utf-8" });
}

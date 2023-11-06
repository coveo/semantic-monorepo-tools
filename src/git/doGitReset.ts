import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function ({
  resetMode,
  ref,
}: {
  resetMode: "hard" | "soft" | "mixed";
  ref: string;
}) {
  await spawn("git", ["reset", `--${resetMode}`, ref], gitLogger);
}

import { Debugger } from "debug";
import {
  spawnSync,
  SpawnSyncReturns,
  SpawnSyncOptions,
} from "node:child_process";
import defaultLogger from "./logger.js";

interface Options extends SpawnSyncOptions {
  encoding?: "ascii" | "utf8" | "utf-8";
}

export default function (
  command: string,
  args: string[],
  logger: Debugger = defaultLogger,
  options: Options = {}
): SpawnSyncReturns<string> {
  logger?.('executing "%s %s"', command, args.join(" "));
  return spawnSync(command, args, { encoding: "utf-8", ...options });
}

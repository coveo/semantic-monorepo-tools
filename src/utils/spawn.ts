import { Debugger } from "debug";
import { spawn, SpawnOptions } from "node:child_process";
import defaultLogger from "./logger.js";

interface Options extends SpawnOptions {
  encoding?: "ascii" | "utf8" | "utf-8";
}

type spawnOutputs = {
  stdout: string;
  stderr: string;
};

export default function (
  command: string,
  args: string[],
  logger: Debugger = defaultLogger,
  options: Options = {},
): Promise<{ stdout: string; stderr: string }> {
  const loggableArgs = args.join(" ");
  logger?.('executing "%s %s"', command, loggableArgs);
  let stdout = "";
  let stderr = "";
  const { encoding, ...spawnOptions } = { encoding: "utf-8", ...options };

  return new Promise<spawnOutputs>((resolve, reject) => {
    const childProcess = spawn(command, args, spawnOptions);

    childProcess.stdout.on("data", (data) => {
      logger?.(`STDOUT: ${data}`);
      stdout += data.toString(encoding);
    });

    childProcess.stderr.on("data", (data) => {
      logger?.(`STDERR: ${data}`);
      stderr += data.toString(encoding);
    });

    childProcess.on("close", (code, signal) => {
      logger?.(
        `${command} ${loggableArgs} finished with code ${code} and signal '${signal}'`,
      );
      if (code) {
        reject({ stdout, stderr });
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

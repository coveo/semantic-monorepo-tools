import type { Readable } from "node:stream";
import type { ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";

type SpawnFunction = typeof import("node:child_process").spawn;

interface Options {
  stdoutData?: Array<string | Buffer>;
  exitCode?: number;
}

export function createMockedChildProcess({
  stdoutData = [],
  exitCode = 0,
}: Options = {}): ChildProcess {
  const childProcess: ChildProcess = new EventEmitter() as ChildProcess;
  const stdoutEventEmitter = new EventEmitter();
  const stderrEventEmitter = new EventEmitter();
  childProcess.stdout = stdoutEventEmitter as Readable;
  childProcess.stderr = stderrEventEmitter as Readable;

  setTimeout(() => {
    stdoutData.forEach((chunk) => stdoutEventEmitter.emit("data", chunk));
    childProcess.emit("close", exitCode);
  }, 0);

  return childProcess;
}

export function mockSpawnSuccess(
  mockedSpawn: jest.MockedFunction<SpawnFunction>,
  options?: Options,
) {
  mockedSpawn.mockImplementation(() => createMockedChildProcess(options));
}

export function mockSpawnSuccessOnce(
  mockedSpawn: jest.MockedFunction<SpawnFunction>,
  options?: Options,
) {
  mockedSpawn.mockImplementationOnce(() => createMockedChildProcess(options));
}

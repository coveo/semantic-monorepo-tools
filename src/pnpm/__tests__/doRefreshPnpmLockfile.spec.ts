import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import refreshPnpmLockfile from "../doRefreshPnpmLockfile.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

const doMockDummySpawn = () => {
  mockedSpawn.mockImplementation(() => {
    const cpEventEmitter: ChildProcess = new EventEmitter() as ChildProcess;
    const stdoutEventEmitter = new EventEmitter();
    const stderrEventEmitter = new EventEmitter();
    cpEventEmitter.stdout = stdoutEventEmitter as Readable;
    cpEventEmitter.stderr = stderrEventEmitter as Readable;
    setTimeout(() => {
      cpEventEmitter.emit("close", 0);
    }, 0);
    return cpEventEmitter;
  });
};

describe("refreshPnpmLockfile()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  it("calls `pnpm install --lockfile-only`", async () => {
    await refreshPnpmLockfile("somepath");

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      ["install", "--lockfile-only"],
      { cwd: "somepath" },
    );
  });
});

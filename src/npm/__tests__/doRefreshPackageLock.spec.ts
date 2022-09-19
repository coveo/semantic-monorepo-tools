import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import refreshPackageLock from "../doRefreshPackageLock.js";
import appendCmdIfWindows from "../utils/appendCmdIfWindows.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

jest.mock("../utils/appendCmdIfWindows.js");
jest.mocked(appendCmdIfWindows).mockImplementation((string: string) => string);

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
describe("refreshPackageLock()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  it("calls `npm i --package-lock-only`", async () => {
    await refreshPackageLock("somepath");

    expect(mockedSpawn).toHaveBeenCalledWith(
      appendCmdIfWindows`npm`,
      ["install", "--package-lock-only"],
      { cwd: "somepath" }
    );
  });
});

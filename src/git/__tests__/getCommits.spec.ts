import type { Readable } from "node:stream";
import { randomBytes } from "node:crypto";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import getCommits from "../getCommits.js";

jest.mock("node:child_process");
jest.mock("node:crypto");

const mockedSpawn = jest.mocked(spawn);
const mockedRandomBytes = jest.mocked(randomBytes);

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

const doMockRandomBytes = () => {
  mockedRandomBytes.mockImplementation(() => {
    return Buffer.from([0x123]);
  });
};

describe("getCommits()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
    doMockRandomBytes();
  });

  it("should call git log with a path if provided", async () => {
    await getCommits("somePath", "someTag");
    expect(mockedSpawn).toHaveBeenCalledWith(
      "git",
      [
        "log",
        '--pretty="format:%B%n-hash-%n%H <--- 23 --->"',
        "--dense",
        "someTag..HEAD",
        "somePath",
      ],
      {},
    );
  });

  it("should call git log without any path nor empty args if the provided path is an empty string", async () => {
    await getCommits("", "someTag");
    expect(mockedSpawn).toHaveBeenCalledWith(
      "git",
      [
        "log",
        '--pretty="format:%B%n-hash-%n%H <--- 23 --->"',
        "--dense",
        "someTag..HEAD",
      ],
      {},
    );
  });
});

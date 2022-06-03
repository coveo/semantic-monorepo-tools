import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import bump from "../doPnpmBumpVersion.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn, true);

describe("doPnpmBumpVersion", () => {
  const doMockSpawnWithStdout = (mockedStdout?: string) => {
    mockedSpawn.mockImplementationOnce(() => {
      const cpEventEmitter: ChildProcess = new EventEmitter() as ChildProcess;
      const stdoutEventEmitter = new EventEmitter();
      const stderrEventEmitter = new EventEmitter();
      cpEventEmitter.stdout = stdoutEventEmitter as Readable;
      cpEventEmitter.stderr = stderrEventEmitter as Readable;
      setTimeout(() => {
        if (mockedStdout) {
          stdoutEventEmitter.emit("data", mockedStdout);
        }
        cpEventEmitter.emit("close", 0);
      }, 0);
      return cpEventEmitter;
    });
  };

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

  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
    doMockSpawnWithStdout("7.0.0");
  });

  it("bumps the version recursively", async () => {
    await bump("v1.0.0", "v0.0.0");

    expect(mockedSpawn).toHaveBeenNthCalledWith(
      2,
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true }
    );
  });

  it("filters in the forced packages", async () => {
    await bump("v1.0.0", "v0.0.0", ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="@org/package-a"',
        '--filter="@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true }
    );
  });

  it("filters out the excluded packages", async () => {
    await bump("v1.0.0", "v0.0.0", [], ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="!@org/package-a"',
        '--filter="!@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true }
    );
  });

  it("combines all the options", async () => {
    await bump(
      "v1.0.0",
      "v1.0.0-rc.1",
      ["package-a", "package-b"],
      ["package-c", "package-d"]
    );

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v1.0.0-rc.1]"',
        // include
        '--filter="package-a"',
        '--filter="package-b"',
        // exclude
        '--filter="!package-c"',
        '--filter="!package-d"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true }
    );
  });

  it("separates the command with dashes on pnpm@6", async () => {
    mockedSpawn.mockRestore();
    doMockDummySpawn();
    doMockSpawnWithStdout("6.31.0");

    await bump("v1.0.0", "v0.0.0");

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        "exec",
        "--",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true }
    );
  });
});

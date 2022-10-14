import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import getLastGitTag from "../getLastGitTag.js";

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

describe("getLastGitTag()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  describe("when a prefix is provided", () => {
    it("should call git describe with the --match flag set to the double-quoted prefix", async () => {
      await getLastGitTag("somePrefix");
      expect(mockedSpawn).toHaveBeenCalledWith(
        "git",
        ["describe", "--tags", "--abbrev=0", "--match='somePrefix*'"],
        {}
      );
    });
  });

  describe("when no prefix is provided", () => {
    it("should call git describe without the match flag", async () => {
      await getLastGitTag();
      expect(mockedSpawn).toHaveBeenCalledWith(
        "git",
        ["describe", "--tags", "--abbrev=0"],
        {}
      );
    });
  });
});

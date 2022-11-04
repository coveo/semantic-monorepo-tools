import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import appendCmdIfWindows from "../utils/appendCmdIfWindows.js";
import describeNpmTag from "../describeNpmTag.js";

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

describe("describeNpmTag()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  describe("when no tag is given", () => {
    it("calls `npm show somepackage@latest version`", async () => {
      await describeNpmTag("somepackage");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["show", "somepackage@latest", "version"],
        {}
      );
    });
  });

  describe("when a tag is given", () => {
    it("calls `npm show somepackage@sometag`", async () => {
      await describeNpmTag("somepackage", "sometag");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["show", "somepackage@sometag", "version"],
        {}
      );
    });
  });
});

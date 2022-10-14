import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import npmBump from "../doNpmBumpVersion.js";
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

describe("npmBump()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  describe("when no options is given", () => {
    it("calls `npm version` with only --git-tag-version=false flag", async () => {
      await npmBump("0.1.2", "somepath");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["version", "0.1.2", "--git-tag-version=false"],
        { cwd: "somepath" }
      );
    });
  });

  describe("when options.NoUpdate is given", () => {
    it("calls `npm version` with only --git-tag-version=false flag", async () => {
      await npmBump("0.1.2", "somepath", {
        workspaceUpdateStrategy: "NoUpdate",
      });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["version", "0.1.2", "--git-tag-version=false"],
        { cwd: "somepath" }
      );
    });
  });

  describe("when options.UpdateWithCarret is given", () => {
    it("calls `npm version` with --save flag", async () => {
      await npmBump("0.1.2", "somepath", {
        workspaceUpdateStrategy: "UpdateWithCarret",
      });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["version", "0.1.2", "--git-tag-version=false", "--save"],
        { cwd: "somepath" }
      );
    });
  });

  describe("when options.UpdateExact is given", () => {
    it("calls `npm version` with --save and -E flag", async () => {
      await npmBump("0.1.2", "somepath", {
        workspaceUpdateStrategy: "UpdateExact",
      });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["version", "0.1.2", "--git-tag-version=false", "--save", "-E"],
        { cwd: "somepath" }
      );
    });
  });
});

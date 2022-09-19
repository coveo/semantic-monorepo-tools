import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import npmPublish from "../doNpmPublish.js";
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

describe("npmPublish()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  describe("when no npmOpts is given", () => {
    it("calls `npm publish`", async () => {
      await npmPublish("somepath");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish"],
        { cwd: "somepath" }
      );
    });
  });

  describe("when npmOpts.tag is given", () => {
    it("calls `npm publish` with the --tag flag", async () => {
      await npmPublish("somepath", { tag: "sometag" });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish", "--tag", "sometag"],
        { cwd: "somepath" }
      );
    });
  });
});

import { spawn } from "node:child_process";
import npmBump from "../doNpmBumpVersion.js";
import appendCmdIfWindows from "../utils/appendCmdIfWindows.js";
import { mockSpawnSuccess } from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

jest.mock("../utils/appendCmdIfWindows.js");
jest.mocked(appendCmdIfWindows).mockImplementation((string: string) => string);

describe("npmPublish()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
  });

  describe("when no options is given", () => {
    it("calls `npm version` with only --git-tag-version=false flag", async () => {
      await npmBump("0.1.2", "somepath");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["version", "0.1.2", "--git-tag-version=false"],
        { cwd: "somepath" },
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
        { cwd: "somepath" },
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
        { cwd: "somepath" },
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
        { cwd: "somepath" },
      );
    });
  });
});

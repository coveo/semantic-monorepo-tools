import { spawn } from "node:child_process";
import npmPublish from "../doNpmPublish.js";
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

  describe("when no npmOpts is given", () => {
    it("calls `npm publish` without any flags", async () => {
      await npmPublish("somepath");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish"],
        { cwd: "somepath" },
      );
    });
  });

  describe("when npmOpts.tag is given", () => {
    it("calls `npm publish` with the --tag flag", async () => {
      await npmPublish("somepath", { tag: "sometag" });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish", "--tag", "sometag"],
        { cwd: "somepath" },
      );
    });
  });

  describe("when npmOpts.provenance is set to true", () => {
    it("calls `npm publish` with the --provenance flag", async () => {
      await npmPublish("somepath", { provenance: true });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish", "--provenance"],
        { cwd: "somepath" },
      );
    });
  });

  describe("when npmOpts.provenance is set to false", () => {
    it("calls `npm publish` without the --provenance flag", async () => {
      await npmPublish("somepath", { provenance: false });

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["publish"],
        { cwd: "somepath" },
      );
    });
  });
});

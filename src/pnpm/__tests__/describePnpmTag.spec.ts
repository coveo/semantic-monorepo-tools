import spawn from "../../utils/spawn.js";
import pnpmLogger from "../utils/pnpmLogger.js";
import describePnpmTag from "../describePnpmTag.js";

jest.mock("../../utils/spawn.js");
jest.mock("../utils/pnpmLogger.js");

const mockedSpawn = jest.mocked(spawn);

describe("describePnpmTag()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSpawn.mockResolvedValue({ stdout: "", stderr: "" });
  });

  describe("when no tag is given", () => {
    it("calls `pnpm view somepackage@latest version`", async () => {
      await describePnpmTag("somepackage");

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["view", "somepackage@latest", "version"],
        pnpmLogger,
      );
    });
  });

  describe("when a tag is given", () => {
    it("calls `pnpm view somepackage@sometag version`", async () => {
      await describePnpmTag("somepackage", "sometag");

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["view", "somepackage@sometag", "version"],
        pnpmLogger,
      );
    });
  });

  it("trim the output", async () => {
    mockedSpawn.mockResolvedValue({ stdout: "1.2.3\n ", stderr: "" });

    expect(await describePnpmTag("foo")).toBe("1.2.3");
  });
});

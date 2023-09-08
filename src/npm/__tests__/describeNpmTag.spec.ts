import spawn from "../../utils/spawn.js";
import appendCmdIfWindows from "../utils/appendCmdIfWindows.js";
import npmLogger from "../utils/npmLogger.js";
import describeNpmTag from "../describeNpmTag.js";

jest.mock("../../utils/spawn.js");
jest.mock("../utils/npmLogger.js");
jest.mock("../utils/appendCmdIfWindows.js");

const mockedSpawn = jest.mocked(spawn);

jest.mocked(appendCmdIfWindows).mockImplementation((string: string) => string);

describe("describeNpmTag()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSpawn.mockResolvedValue({ stdout: "", stderr: "" });
  });

  describe("when no tag is given", () => {
    it("calls `npm show somepackage@latest version`", async () => {
      await describeNpmTag("somepackage");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["view", "somepackage@latest", "version"],
        npmLogger,
      );
    });
  });

  describe("when a tag is given", () => {
    it("calls `npm show somepackage@sometag`", async () => {
      await describeNpmTag("somepackage", "sometag");

      expect(mockedSpawn).toHaveBeenCalledWith(
        appendCmdIfWindows`npm`,
        ["view", "somepackage@sometag", "version"],
        npmLogger,
      );
    });
  });

  it("trim the output", async () => {
    mockedSpawn.mockResolvedValue({ stdout: "1.2.3\n ", stderr: "" });

    expect(await describeNpmTag("foo")).toBe("1.2.3");
  });
});

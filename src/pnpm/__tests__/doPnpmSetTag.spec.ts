import spawn from "../../utils/spawn.js";
import pnpmLogger from "../utils/pnpmLogger.js";
import pnpmSetTag from "../doPnpmSetTag.js";

jest.mock("../../utils/spawn.js");
jest.mock("../utils/pnpmLogger.js");

const mockedSpawn = jest.mocked(spawn);

describe("pnpmSetTag()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSpawn.mockResolvedValue({ stdout: "", stderr: "" });
  });

  it("calls `pnpm dist-tag add` with the expected arguments", async () => {
    await pnpmSetTag("somepackage", "1.2.3", "latest");

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      ["dist-tag", "add", "somepackage@1.2.3", "latest"],
      pnpmLogger,
    );
  });

  it("returns a trimmed stdout", async () => {
    mockedSpawn.mockResolvedValue({ stdout: "done\n", stderr: "" });

    expect(await pnpmSetTag("pkg", "1.0.0", "beta")).toBe("done");
  });
});

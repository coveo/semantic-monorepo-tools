import { spawn } from "node:child_process";
import refreshPackageLock from "../doRefreshPackageLock.js";
import appendCmdIfWindows from "../utils/appendCmdIfWindows.js";
import { mockSpawnSuccess } from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

jest.mock("../utils/appendCmdIfWindows.js");
jest.mocked(appendCmdIfWindows).mockImplementation((string: string) => string);

describe("refreshPackageLock()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
  });

  it("calls `npm i --package-lock-only`", async () => {
    await refreshPackageLock("somepath");

    expect(mockedSpawn).toHaveBeenCalledWith(
      appendCmdIfWindows`npm`,
      ["install", "--package-lock-only"],
      { cwd: "somepath" },
    );
  });
});

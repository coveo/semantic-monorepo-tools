import { spawn } from "node:child_process";
import refreshPnpmLockfile from "../doRefreshPnpmLockfile.js";
import { mockSpawnSuccess } from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

describe("refreshPnpmLockfile()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
  });

  it("calls `pnpm install --lockfile-only`", async () => {
    await refreshPnpmLockfile("somepath");

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      ["install", "--lockfile-only"],
      { cwd: "somepath" },
    );
  });
});

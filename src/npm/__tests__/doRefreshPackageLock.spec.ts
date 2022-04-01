import refreshPackageLock from "../doRefreshPackageLock.js";

import { spawnSync } from "node:child_process";
jest.mock("node:child_process");
const mockedSpawnSync = jest.mocked(spawnSync, true);

import { appendCmdIfWindows } from "../utils/appendCmdIfWindows.js";
jest.mock("../utils/appendCmdIfWindows.js");
jest
  .mocked(appendCmdIfWindows, true)
  .mockImplementation((string: string) => string);

describe("refreshPackageLock()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("calls `npm i --package-lock-only`", () => {
    refreshPackageLock("somepath");

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      appendCmdIfWindows`npm`,
      ["install", "--package-lock-only"],
      { encoding: "utf-8", cwd: "somepath" }
    );
  });
});

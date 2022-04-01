import { spawnSync } from "node:child_process";
import refreshPackageLock from "../doRefreshPackageLock.js";
import { appendCmdIfWindows } from "../utils/appendCmdIfWindows.js";

jest.mock("node:child_process", () => ({
  spawnSync: jest.fn(),
}));

describe("refreshPackageLock()", () => {
  it("do call `npm i --package-lock-only`", () => {
    refreshPackageLock("somepath");

    expect(spawnSync).toHaveBeenCalledWith(
      appendCmdIfWindows`npm`,
      ["install", "--package-lock-only"],
      { encoding: "utf-8", cwd: "somepath" }
    );
  });
});

import { spawnSync, SpawnSyncReturns } from "node:child_process";
import bump from "../doPnpmBumpVersion.js";

jest.mock("node:child_process");
const mockedSpawnSync = jest.mocked(spawnSync, true);

describe("doPnpmBumpVersion", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSpawnSync.mockReturnValueOnce({
      stdout: "7.0.0",
    } as SpawnSyncReturns<string>);
  });

  it("bumps the version recursively", () => {
    bump("v1.0.0", "v0.0.0");

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { encoding: "utf-8", shell: true }
    );
  });

  it("filters in the forced packages", () => {
    bump("v1.0.0", "v0.0.0", ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="@org/package-a"',
        '--filter="@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { encoding: "utf-8", shell: true }
    );
  });

  it("filters out the excluded packages", () => {
    bump("v1.0.0", "v0.0.0", [], ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="!@org/package-a"',
        '--filter="!@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { encoding: "utf-8", shell: true }
    );
  });

  it("combines all the options", () => {
    bump(
      "v1.0.0",
      "v1.0.0-rc.1",
      ["package-a", "package-b"],
      ["package-c", "package-d"]
    );

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v1.0.0-rc.1]"',
        // include
        '--filter="package-a"',
        '--filter="package-b"',
        // exclude
        '--filter="!package-c"',
        '--filter="!package-d"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { encoding: "utf-8", shell: true }
    );
  });

  it("returns the spawned process", () => {
    const returned = bump("v2.0.0", "v1.0.0");
    expect(returned).toBe(mockedSpawnSync.mock.results[1].value);
  });

  it("separates the command with dashes on pnpm@6", () => {
    mockedSpawnSync.mockRestore();
    mockedSpawnSync.mockReturnValueOnce({
      stdout: "6.31.0",
    } as SpawnSyncReturns<string>);

    bump("v1.0.0", "v0.0.0");

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        "exec",
        "--",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { encoding: "utf-8", shell: true }
    );
  });
});

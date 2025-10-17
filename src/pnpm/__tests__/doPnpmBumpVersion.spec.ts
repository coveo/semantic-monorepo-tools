import { spawn } from "node:child_process";
import bump from "../doPnpmBumpVersion.js";
import {
  mockSpawnSuccess,
  mockSpawnSuccessOnce,
} from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

describe("doPnpmBumpVersion", () => {
  const doMockSpawnWithStdout = (mockedStdout?: string) => {
    mockSpawnSuccessOnce(mockedSpawn, {
      stdoutData: mockedStdout ? [mockedStdout] : [],
    });
  };

  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
    doMockSpawnWithStdout("7.0.0");
  });

  it("bumps the version recursively", async () => {
    await bump("v1.0.0", "v0.0.0");

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true },
    );
  });

  it("filters in the forced packages", async () => {
    await bump("v1.0.0", "v0.0.0", ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="@org/package-a"',
        '--filter="@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true },
    );
  });

  it("filters out the excluded packages", async () => {
    await bump("v1.0.0", "v0.0.0", [], ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v0.0.0]"',
        '--filter="!@org/package-a"',
        '--filter="!@org/package-b"',
        "exec",
        "pnpm version v1.0.0 --no-git-tag-version",
      ],
      { shell: true },
    );
  });

  it("combines all the options", async () => {
    await bump(
      "v1.0.0",
      "v1.0.0-rc.1",
      ["package-a", "package-b"],
      ["package-c", "package-d"],
    );

    expect(mockedSpawn).toHaveBeenCalledWith(
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
      { shell: true },
    );
  });
});

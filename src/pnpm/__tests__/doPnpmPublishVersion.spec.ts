import { spawnSync } from "node:child_process";
import publish from "../doPnpmPublishVersions.js";

jest.mock("node:child_process");
const mockedSpawnSync = jest.mocked(spawnSync, true);

describe("doPnpmPublishVersions", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it.each(["v1.0.0", "release-42"])(
    `publishes recursively with the since %s filter`,
    (since) => {
      publish(since);

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "pnpm",
        ["--recursive", `--filter="...[${since}]"`, "publish"],
        { encoding: "utf-8" }
      );
    }
  );

  it.each(["next", "alpha", "latest"])("publishes with the %s tag", (tag) => {
    publish("v1.0.0", tag);

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      ["--recursive", '--filter="...[v1.0.0]"', "publish", "--tag", tag],
      { encoding: "utf-8" }
    );
  });

  it.each(["main", "master", "release-1.0"])(
    "publishes on the %s branch",
    (branch) => {
      publish("v1.0.0", "", branch);

      expect(mockedSpawnSync).toHaveBeenCalledWith(
        "pnpm",
        [
          "--recursive",
          '--filter="...[v1.0.0]"',
          "publish",
          "--publish-branch",
          branch,
        ],
        { encoding: "utf-8" }
      );
    }
  );

  it("filters in the forced packages", () => {
    publish("v1.0.0", "", "", ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v1.0.0]"',
        '--filter="@org/package-a"',
        '--filter="@org/package-b"',
        "publish",
      ],
      { encoding: "utf-8" }
    );
  });

  it("filters out the excluded packages", () => {
    publish("v1.0.0", "", "", [], ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v1.0.0]"',
        '--filter="!@org/package-a"',
        '--filter="!@org/package-b"',
        "publish",
      ],
      { encoding: "utf-8" }
    );
  });

  it("combines all the options", () => {
    publish(
      "v1.0.0-next.1",
      "next",
      "next-branch",
      ["package-a", "package-b"],
      ["package-c", "package-d"]
    );

    expect(mockedSpawnSync).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        '--filter="...[v1.0.0-next.1]"',
        // include
        '--filter="package-a"',
        '--filter="package-b"',
        // exclude
        '--filter="!package-c"',
        '--filter="!package-d"',
        "publish",
        "--tag",
        "next",
        "--publish-branch",
        "next-branch",
      ],
      { encoding: "utf-8" }
    );
  });

  it("returns the spawned process", () => {
    const returned = publish("v1.0.0");
    expect(returned).toBe(mockedSpawnSync.mock.results[0].value);
  });
});

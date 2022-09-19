import type { Readable } from "node:stream";
import { spawn, ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import publish from "../doPnpmPublishVersions.js";

jest.mock("node:child_process");
const mockedSpawn = jest.mocked(spawn);

describe("doPnpmPublishVersions", () => {
  const doMockDummySpawn = () => {
    mockedSpawn.mockImplementation(() => {
      const cpEventEmitter: ChildProcess = new EventEmitter() as ChildProcess;
      const stdoutEventEmitter = new EventEmitter();
      const stderrEventEmitter = new EventEmitter();
      cpEventEmitter.stdout = stdoutEventEmitter as Readable;
      cpEventEmitter.stderr = stderrEventEmitter as Readable;
      setTimeout(() => {
        cpEventEmitter.emit("close", 0);
      }, 0);
      return cpEventEmitter;
    });
  };
  beforeEach(() => {
    jest.resetAllMocks();
    doMockDummySpawn();
  });

  it.each(["v1.0.0", "release-42"])(
    `publishes recursively with the since %s filter if defined`,
    async (since) => {
      await publish(since);

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["--recursive", "--filter", `...[${since}]`, "publish"],
        {}
      );
    }
  );

  it(`publishes recursively without the since %s filter if not defined`, async () => {
    await publish();

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      ["--recursive", "publish"],
      {}
    );
  });

  it.each(["next", "alpha", "latest"])(
    "publishes with the %s tag",
    async (tag) => {
      await publish("v1.0.0", tag);

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        ["--recursive", "--filter", "...[v1.0.0]", "publish", "--tag", tag],
        {}
      );
    }
  );

  it.each(["main", "master", "release-1.0"])(
    "publishes on the %s branch",
    async (branch) => {
      await publish("v1.0.0", "", branch);

      expect(mockedSpawn).toHaveBeenCalledWith(
        "pnpm",
        [
          "--recursive",
          "--filter",
          "...[v1.0.0]",
          "publish",
          "--publish-branch",
          branch,
        ],
        {}
      );
    }
  );

  it("filters in the forced packages", async () => {
    await publish("v1.0.0", "", "", ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        "--filter",
        "...[v1.0.0]",
        '--filter="@org/package-a"',
        '--filter="@org/package-b"',
        "publish",
      ],
      {}
    );
  });

  it("filters out the excluded packages", async () => {
    await publish("v1.0.0", "", "", [], ["@org/package-a", "@org/package-b"]);

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        "--filter",
        "...[v1.0.0]",
        '--filter="!@org/package-a"',
        '--filter="!@org/package-b"',
        "publish",
      ],
      {}
    );
  });

  it("combines all the options", async () => {
    await publish(
      "v1.0.0-next.1",
      "next",
      "next-branch",
      ["package-a", "package-b"],
      ["package-c", "package-d"]
    );

    expect(mockedSpawn).toHaveBeenCalledWith(
      "pnpm",
      [
        "--recursive",
        "--filter",
        "...[v1.0.0-next.1]",
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
      {}
    );
  });
});

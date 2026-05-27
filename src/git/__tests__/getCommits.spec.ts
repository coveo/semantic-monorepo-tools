import { randomBytes } from "node:crypto";
import { spawn } from "node:child_process";
import getCommits from "../getCommits.js";
import { mockSpawnSuccess } from "../../test-helpers/mockSpawn.js";

jest.mock("node:child_process");
jest.mock("node:crypto");

const mockedSpawn = jest.mocked(spawn);
const mockedRandomBytes = jest.mocked(randomBytes);

const doMockRandomBytes = () => {
  mockedRandomBytes.mockImplementation(() => {
    return Buffer.from([0x123]);
  });
};

describe("getCommits()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockSpawnSuccess(mockedSpawn);
    doMockRandomBytes();
  });

  it("should call git log with a path if provided", async () => {
    await getCommits("somePath", "someTag");
    expect(mockedSpawn).toHaveBeenCalledWith(
      "git",
      [
        "log",
        "--format=%B%n-hash-%n%H%n<--- 23 --->",
        "--dense",
        "someTag..HEAD",
        "somePath",
      ],
      {},
    );
  });

  it("should call git log without any path nor empty args if the provided path is an empty string", async () => {
    await getCommits("", "someTag");
    expect(mockedSpawn).toHaveBeenCalledWith(
      "git",
      [
        "log",
        "--format=%B%n-hash-%n%H%n<--- 23 --->",
        "--dense",
        "someTag..HEAD",
      ],
      {},
    );
  });
});

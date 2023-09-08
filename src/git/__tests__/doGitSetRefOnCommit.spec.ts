import spawn from "../../utils/spawn.js";
import gitSetRef from "../doGitSetRefOnCommit.js";

jest.mock("../../utils/spawn.js");
jest.mock("../utils/gitLogger.js");

const mockedSpawn = jest.mocked(spawn);

describe("doGitSetRef()", () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockedSpawn.mockResolvedValue({ stdout: "", stderr: "" });
  });

  describe.each(["--upload-pack", "--whatever --upload-pack"])(
    "with invalid params",
    (remote) => {
      it("should throw when called with a bad remote", () => {
        expect(
          gitSetRef(remote, "a", "b"),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
      it("should throw when called with a bad commitSHA1", () => {
        expect(
          gitSetRef("a", "a", remote),
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    },
  );

  it("should append --force when force=true", async () => {
    await gitSetRef("origin", "a", "b", true);
    expect(mockedSpawn.mock.lastCall[1].pop()).toBe("--force");
  });

  it("should not append --force when force is unset", async () => {
    await gitSetRef("origin", "a", "b");
    expect(mockedSpawn.mock.lastCall[1].pop()).not.toBe("--force");
  });

  it("should not append --force when force=false", async () => {
    await gitSetRef("origin", "a", "b", false);
    expect(mockedSpawn.mock.lastCall[1].pop()).not.toBe("--force");
  });
});

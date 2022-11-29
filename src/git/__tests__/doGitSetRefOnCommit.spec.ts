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
          gitSetRef(remote, "a", "b")
        ).rejects.toThrowErrorMatchingSnapshot();
      });
      it("should throw when called with a bad commitSHA1", () => {
        expect(
          gitSetRef("a", "a", remote)
        ).rejects.toThrowErrorMatchingSnapshot();
      });
    }
  );
});

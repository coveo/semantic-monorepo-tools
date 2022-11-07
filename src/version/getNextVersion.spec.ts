jest.mock("semver");

import semver, { SemVer } from "semver";
import getNextVersion from "./getNextVersion.js";

describe("getNextVersion()", () => {
  const initialTestVersion = new SemVer("1.2.3");
  const mockedInc = jest.mocked(semver.inc);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when called with BumpInfoWithLevel", () => {
    it.each([
      [{ level: 0 }, "major"],
      [{ level: 1 }, "minor"],
      [{ level: 2 }, "patch"],
      [{ level: 0, isPrerelease: false }, "major"],
      [{ level: 1, isPrerelease: false }, "minor"],
      [{ level: 2, isPrerelease: false }, "patch"],
      [{ level: 0, isPrerelease: true }, "premajor"],
      [{ level: 1, isPrerelease: true }, "preminor"],
      [{ level: 2, isPrerelease: true }, "prepatch"],
    ] as const)(
      "should call semver.inc with the good ReleaseType",
      (params, expectedBumpInfo) => {
        getNextVersion(initialTestVersion, params);
        expect(mockedInc).toBeCalledWith(initialTestVersion, expectedBumpInfo);
      }
    );
  });

  describe("when called with BumpInfoWithType", () => {
    it("should just act as proxy  to semver.inc", () => {
      getNextVersion(initialTestVersion, { type: "patch", preid: "foobarbaz" });
      expect(mockedInc).toBeCalledWith(
        initialTestVersion,
        "patch",
        "foobarbaz"
      );
    });
  });
});

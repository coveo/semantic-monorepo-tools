import type { ReleaseType, SemVer } from "semver";
import semver from "semver";
const { inc } = semver;

const VERSION_LEVEL = ["major", "minor", "patch"] as const;

type BumpInfoWithLevel = { level: 0 | 1 | 2; isPrerelease?: boolean };
type BumpInfoWithType = { type: ReleaseType; preid?: string };
type BumpInfo = BumpInfoWithLevel | BumpInfoWithType;

function getNextVersion(version: SemVer, bumpInfo: BumpInfoWithLevel): string;
function getNextVersion(version: SemVer, bumpInfo: BumpInfoWithType): string;

function getNextVersion(version: SemVer, bumpInfo: BumpInfo) {
  if ("level" in bumpInfo) {
    return inc(
      version,
      `${bumpInfo.isPrerelease ? "pre" : ""}${VERSION_LEVEL[bumpInfo.level]}`,
    );
  } else {
    return inc(version, bumpInfo.type, bumpInfo.preid);
  }
}

export default getNextVersion;

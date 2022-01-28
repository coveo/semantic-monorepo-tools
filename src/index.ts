import angular from "conventional-changelog-angular";
import getCommits from "./git/getCommits";
import getLastTag from "./git/getLastGitTag";
import gitPush from "./git/doGitPush";
import gitCommit from "./git/doGitCommit";
import gitTag from "./git/doGitTag";

import npmBumpVersion from "./npm/doNpmBumpVersion";
import npmPublish from "./npm/doNpmPublish";

import writeChangelog from "./changelog/doWriteChangelog";
import generateChangelog from "./changelog/getChangelog";

import getNextVersion from "./version/getNextVersion";
import getCurrentVersion from "./version/getCurrentVersion";

import parseCommits from "./semantic/getParsedCommits";

let awaitedangular = await angular;

const PATH = "."; // Will be a param
const prefix = "v";
const lastTag =
  getLastTag(prefix) || "c8d337b6477761afe97d66e18bee62b5e889019a"; //Initial commit for demo purpose
const commits = getCommits(PATH, lastTag);
const parsedCommits = parseCommits(commits, awaitedangular.parserOpts);
const bumpInfo = awaitedangular.recommendedBumpOpts.whatBump(parsedCommits);
const currentVersion = getCurrentVersion(PATH);
const newVersion = getNextVersion(currentVersion, bumpInfo);
const changelog = await generateChangelog(
  parsedCommits,
  newVersion,
  {
    host: "https://github.com",
    owner: "coveo",
    repository: "cli",
  },
  awaitedangular.writerOpts
);
await writeChangelog(PATH, changelog);
npmBumpVersion(newVersion, PATH);
gitCommit(`chore(release): Release ${prefix}${newVersion} [skip ci]`, PATH);
gitTag(newVersion, prefix);
/* Done, but unwise to run here
 * TODO: Dry run for demo?
gitPush();
npmPublish(PATH);
*/
// gitCreateRelease(); //Can be discussions.
console.log(`${currentVersion}->${newVersion}`);

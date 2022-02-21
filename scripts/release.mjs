import {
  getLastTag,
  parseCommits,
  getCommits,
  getCurrentVersion,
  getNextVersion,
  npmBumpVersion,
  generateChangelog,
  writeChangelog,
  gitPush,
  gitPushTags,
  gitTag,
  npmPublish,
} from "@coveo/semantic-monorepo-tools";
import angularChangelogConvention from "conventional-changelog-angular";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { spawnSync } from "child_process";
import { chmodSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { homedir } from "os";

// Get all commits since last release bump the root package.json version.
(async () => {
  //#region Constants
  const PATH = ".";
  const VERSION_PREFIX = "v";
  const CONVENTION = await angularChangelogConvention;
  const REPO_OWNER = "coveo";
  const REPO_NAME = "semantic-monorepo-tools";
  //#endregion

  //#region GitHub authentication
  setupGitCredentials(REPO_OWNER, REPO_NAME);
  const authSecrets = {
    appId: process.env.RELEASER_APP_ID,
    privateKey: process.env.RELEASER_PRIVATE_KEY,
    clientId: process.env.RELEASER_CLIENT_ID,
    clientSecret: process.env.RELEASER_CLIENT_SECRET,
    installationId: process.env.RELEASER_INSTALLATION_ID,
  };

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: authSecrets,
  });
  //#endregion

  //#region Find current and new versions.
  const lastTag = getLastTag(VERSION_PREFIX);
  const commits = getCommits(PATH, lastTag);
  const parsedCommits = parseCommits(commits, CONVENTION.parserOpts);
  const bumpInfo = CONVENTION.recommendedBumpOpts.whatBump(parsedCommits);
  const currentVersion = getCurrentVersion(PATH);
  const newVersion = getNextVersion(currentVersion, bumpInfo);
  const newVersionTag = `${VERSION_PREFIX}${newVersion}`;
  //#endregion

  // Bump the NPM version.
  npmBumpVersion(newVersion, PATH);

  //#region Generate changelog if needed.
  let changelog = "";
  if (parseCommits.length > 0) {
    changelog = await generateChangelog(
      parsedCommits,
      newVersion,
      {
        host: "https://github.com",
        owner: "coveo",
        repository: "cli",
        linkReferences: true,
        currentTag: newVersionTag,
        previousTag: lastTag,
      },
      CONVENTION.writerOpts
    );
    await writeChangelog(PATH, changelog);
  }
  //#endregion

  //#region Commit changelog, tag version and push.
  gitTag(newVersionTag);
  const tempBranchName = "cd-test";
  const mainBranchName = "cd";
  const mainBranchCurrentSHA = spawnSync("git", ["rev-parse", mainBranchName])
    .stdout.toString()
    .trim();
  spawnSync("git", ["branch", tempBranchName]);
  spawnSync("git", ["checkout", tempBranchName]);
  writeFileSync("some-file.txt", "some awesome content to commit and push");
  spawnSync("git", ["add", "."]);
  const treeSHA = spawnSync("git", ["write-tree"]).stdout.toString().trim();
  const commitTree = spawnSync("git", [
    "commit-tree",
    treeSHA,
    "-p",
    tempBranchName,
    "-m",
    "temp commit",
    // `chore(release): ${newVersion}`,
  ]);

  console.log(commitTree.stdout.toString());
  console.log(commitTree.stderr.toString());

  spawnSync("git", ["update-ref", "HEAD", commitTree.stdout.toString().trim()]);
  spawnSync("git", ["push", "-u", "origin", tempBranchName]);

  const commit = await octokit.rest.git.createCommit({
    message: "beep boop I'm almost a bot [ci skip]",
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree: treeSHA,
    parents: [mainBranchCurrentSHA],
  });
  spawnSync("git", [
    "fetch",
    "deploy",
    `${commit.data.sha}:refs/heads/${mainBranchName}`,
  ]);
  spawnSync("git", ["checkout", mainBranchName]);
  const push = spawnSync("git", ["push", "deploy", mainBranchName]);
  console.log(push.stdout.toString());
  console.log(push.stderr.toString());
  spawnSync("git", ["push", "deploy", "--delete", tempBranchName]);
  //#endregion

  //#region Create & push tag.
  gitTag(newVersionTag);
  gitPushTags();
  //#endregion

  // Publish the new version on NPM.
  // npmPublish(PATH);

  //#region Create GitHub Release on last tag.
  const [, ...bodyArray] = changelog.split("\n");
  await octokit.rest.repos.createRelease({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tag_name: newVersionTag,
    name: `Release ${newVersionTag}`,
    body: bodyArray.join("\n"),
  });
  //#endregion
})();

function setupGitCredentials(REPO_OWNER, REPO_NAME) {
  mkdirSync(join(homedir(), ".ssh"), { recursive: true });
  writeFileSync(join(homedir(), ".ssh", "id_rsa"), process.env.DEPLOY_KEY);
  chmodSync(join(homedir(), ".ssh", "id_rsa"), 0o400);
  writeFileSync(
    join(homedir(), ".ssh", "config"),
    `Host deploy
Hostname github.com
PreferredAuthentications publickey
IdentityFile ${join(homedir(), ".ssh", "id_rsa")}`
  );

  spawnSync("git", [
    "remote",
    "add",
    "deploy",
    `git@deploy:${REPO_OWNER}/${REPO_NAME}.git`,
  ]);

  const gitConfigMail = spawnSync("git", [
    "config",
    "--global",
    "user.email",
    `91079284+developer-experience-bot[bot]@users.noreply.github.com`,
  ]);

  const gitConfigName = spawnSync("git", [
    "config",
    "--global",
    "user.name",
    "developer-experience-bot[bot]",
  ]);
}

import {
  getLastTag,
  parseCommits,
  getCommits,
  getCurrentVersion,
  getNextVersion,
  npmBumpVersion,
  generateChangelog,
  writeChangelog,
  gitCommit,
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
import retry from "async-retry";

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
  const authSecrets = {
    appId: process.env.RELEASER_APP_ID,
    privateKey: process.env.RELEASER_PRIVATE_KEY,
    clientId: process.env.RELEASER_CLIENT_ID,
    clientSecret: process.env.RELEASER_CLIENT_SECRET,
    installationId: process.env.RELEASER_INSTALLATION_ID,
  };

  setupGitCredentials(REPO_OWNER, REPO_NAME);
  //#endregion

  //#region Find current and new versions.
  // const lastTag = getLastTag(VERSION_PREFIX);
  // const commits = getCommits(PATH, lastTag);
  // const parsedCommits = parseCommits(commits, CONVENTION.parserOpts);
  // const bumpInfo = CONVENTION.recommendedBumpOpts.whatBump(parsedCommits);
  // const currentVersion = getCurrentVersion(PATH);
  // const newVersion = getNextVersion(currentVersion, bumpInfo);
  // const newVersionTag = `${VERSION_PREFIX}${newVersion}`;
  //#endregion

  // Bump the NPM version.
  // npmBumpVersion(newVersion, PATH);

  //#region Generate changelog if needed.
  // let changelog = "";
  // if (parseCommits.length > 0) {
  //   let changelog = await generateChangelog(
  //     parsedCommits,
  //     newVersion,
  //     {
  //       host: "https://github.com",
  //       owner: "coveo",
  //       repository: "cli",
  //       linkReferences: true,
  //       currentTag: newVersionTag,
  //       previousTag: lastTag,
  //     },
  //     CONVENTION.writerOpts
  //   );
  //   await writeChangelog(PATH, changelog);
  // }
  //#endregion

  //#region Commit changelog, tag version and push.
  // gitCommit(PATH, `chore(release): ${newVersion}`);
  // gitCommit(PATH, `beep boop I'm a bot [ci skip]`);
  // gitTag(newVersionTag);
  const mainBranchCurrentSHA = spawnSync("git", ["rev-parse", "cd"])
    .stdout.toString()
    .trim();
  const tempBranchName = "cd-test";
  // const tempBranchName = `release/${newVersionTag}`;
  spawnSync("git", ["branch", tempBranchName]);
  spawnSync("git", ["checkout", tempBranchName]);
  writeFileSync("some-file.txt", "some content");
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

  spawnSync("git", ["push", "-u", "origin", tempBranchName]);
  const push = spawnSync("git", [
    "push",
    "origin",
    `${commitTree.stdout.toString().trim()}:${tempBranchName}`,
  ]);

  console.log(push.stdout.toString());
  console.log(push.stderr.toString());
  spawnSync("git", ["config", "--global", "--unset", "user.name"]);
  spawnSync("git", ["config", "--global", "--unset", "user.email"]);

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: authSecrets,
  });

  const commit = await octokit.rest.git.createCommit({
    message: "beep boop I'm almost a bot [ci skip]",
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree: treeSHA,
    parents: [mainBranchCurrentSHA],
  });

  await octokit.rest.git.updateRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "heads/cd",
    sha: commit.data.sha,
  });

  await octokit.rest.git.deleteRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "heads/cd-test",
  });

  spawnSync("git", ["checkout", "cd"]);
  //#endregion

  //#region Publish to NPM.
  // npmPublish(PATH);
  //#endregion
  // gitPush();
  // gitPushTags();
  //#endregion

  // Publish the new version on NPM.
  // npmPublish(PATH);

  //#region Create GitHub Release on last tag.
  // const [, ...bodyArray] = changelog.split("\n");
  // await octokit.rest.repos.createRelease({
  //   owner: REPO_OWNER,
  //   repo: REPO_NAME,
  //   tag_name: newVersionTag,
  //   name: `Release ${newVersionTag}`,
  //   body: bodyArray.join("\n"),
  // });

  //#endregion
})();

function setupGitCredentials(REPO_OWNER, REPO_NAME, installationToken) {
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

  // const gitRemote = spawnSync("git", [
  //   "remote",
  //   "set-url",
  //   "origin",
  //   `https://x-access-token:${installationToken}@github.com/${REPO_OWNER}/${REPO_NAME}.git`,
  // ]);

  // console.log(gitRemote.stdout.toString());
  // console.log(gitRemote.stderr.toString());

  const gitConfigMail = spawnSync("git", [
    "config",
    "--global",
    "user.email",
    `91079284+developer-experience-bot[bot]@users.noreply.github.com`,
  ]);

  console.log(gitConfigMail.stdout.toString());
  console.log(gitConfigMail.stderr.toString());

  const gitConfigName = spawnSync("git", [
    "config",
    "--global",
    "user.name",
    "developer-experience-bot[bot]",
  ]);

  console.log(gitConfigName.stdout.toString());
  console.log(gitConfigName.stderr.toString());
}

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
  const authStrategy = createAppAuth(authSecrets);

  const installationToken = await authStrategy({
    type: "installation",
  });

  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: authSecrets,
  });

  setupGitCredentials(REPO_OWNER, REPO_NAME, installationToken.token);
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

  const branching = spawnSync("git", ["branch", "cd-test"]);
  spawnSync("git", ["checkout", "cd-test"]);
  const uhoh = spawnSync("git", [
    "commit",
    "-m",
    "beep boop I'm a bot [ci skip]",
    "--allow-empty",
  ]);
  console.log(uhoh.stdout.toString());
  console.log(uhoh.stderr.toString());
  const push = spawnSync("git", ["push", "-u", "origin", "cd-test"]);
  spawnSync("git", ["config", "--global", "--unset", "user.name"]);
  spawnSync("git", ["config", "--global", "--unset", "user.email"]);
  const commitSHA = spawnSync("git", ["rev-parse", "HEAD"])
    .stdout.toString()
    .trim();
  console.log(`commitSHA: ${commitSHA} end`);
  const commitObject = await octokit.rest.git.getCommit({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    commit_sha: commitSHA,
  });
  const previousCommitSHA = spawnSync("git", ["rev-parse", "HEAD"])
    .stdout.toString()
    .trim();

  console.log(`previouscommitSHA: ${previousCommitSHA} end`);
  await octokit.rest.git.createCommit({
    message: "beep boop I'm a bot [ci skip]",
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree: commitObject.data.tree.sha,
    parents: [previousCommitSHA],
  });
  await octokit.rest.git.updateRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "heads/cd",
    sha: commitSHA,
  });
  await octokit.rest.git.deleteRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "heads/cd-test",
  });

  console.log(push.stdout.toString());
  console.log(push.stderr.toString());

  spawnSync("git", ["checkout", "cd"]);
  //#endregion

  //#region Publish to NPM.
  // npmPublish(PATH);
  //#endregion
  gitPush();
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

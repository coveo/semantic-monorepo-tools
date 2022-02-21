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

  await authStrategy({
    type: "installation",
  });

  const octokit = new Octokit({
    authStrategy,
    auth: { ...authSecrets, type: "installation" },
  });

  setupGitCredentials(REPO_OWNER, REPO_NAME);
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
  spawnSync("git", [
    "commit",
    "-m",
    "beep boop I'm a bot [ci skip]",
    "--allow-empty",
  ]);
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
    "set-url",
    "origin",
    `git@deploy:${REPO_OWNER}/${REPO_NAME}.git`,
  ]);

  spawnSync("git", [
    "config",
    "--global",
    "user.email",
    `${process.env.RELEASER_INSTALLATION_ID}+developer-experience-bot[bot]@users.noreply.github.com`,
  ]);

  spawnSync("git", [
    "config",
    "--global",
    "user.name",
    "developer-experience-bot[bot]",
  ]);
}

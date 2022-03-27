import {
  getLastTag,
  parseCommits,
  getCommits,
  getCurrentVersion,
  getNextVersion,
  npmBumpVersion,
  generateChangelog,
  writeChangelog,
  gitPushTags,
  gitTag,
  npmPublish,
  gitCreateBranch,
  gitCheckoutBranch,
  gitAdd,
  gitSetupSshRemote,
  gitSetupUser,
  getCurrentBranch,
  getSHA1fromRef,
  gitWriteTree,
  gitCommitTree,
  gitUpdateRef,
  gitPublishBranch,
  gitSetRefOnCommit,
  gitPush,
  gitDeleteRemoteBranch,
} from "@coveo/semantic-monorepo-tools";
import angularChangelogConvention from "conventional-changelog-angular";
import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

// Get all commits since last release bump the root package.json version.
(async () => {
  //#region Constants
  const PATH = ".";
  const VERSION_PREFIX = "v";
  const CONVENTION = await angularChangelogConvention;
  const REPO_OWNER = "coveo";
  const REPO_NAME = "semantic-monorepo-tools";
  const GIT_USERNAME= "developer-experience-bot[bot]";
  const GIT_EMAIL = "91079284+developer-experience-bot[bot]@users.noreply.github.com"
  const GIT_SSH_REMOTE = "deploy"
  //#endregion

  //#region GitHub authentication
  gitSetupSshRemote(REPO_OWNER, REPO_NAME, process.env.DEPLOY_KEY, GIT_SSH_REMOTE);
  gitSetupUser(
    GIT_USERNAME,
    GIT_EMAIL
  );

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
        owner: REPO_OWNER,
        repository: REPO_NAME,
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
  const tempBranchName = `release/${newVersion}`;
  const mainBranchName = getCurrentBranch();
  const mainBranchCurrentSHA = getSHA1fromRef(mainBranchName);

  gitCreateBranch(tempBranchName);
  gitCheckoutBranch(tempBranchName);

  gitAdd(".");

  const treeSHA = gitWriteTree();
  const commitTree = gitCommitTree(treeSHA, tempBranchName, "tempcommit");

  gitUpdateRef("HEAD", commitTree);
  gitPublishBranch("origin", tempBranchName);

  const commit = await octokit.rest.git.createCommit({
    message: `chore(release): ${newVersion} [skip ci]`,
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree: treeSHA,
    parents: [mainBranchCurrentSHA],
  });

  gitSetRefOnCommit(GIT_SSH_REMOTE, `refs/heads/${mainBranchName}`, commit.data.sha);

  gitCheckoutBranch(mainBranchName);
  gitPush(GIT_SSH_REMOTE, mainBranchName);
  gitDeleteRemoteBranch(GIT_SSH_REMOTE, tempBranchName);
  //#endregion

  //#region Create & push tag.
  gitTag(newVersionTag);
  gitPushTags();
  //#endregion

  // Publish the new version on NPM.
  npmPublish(PATH);

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

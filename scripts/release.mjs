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
  gitSetupUser,
  getCurrentBranchName,
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
import retry from "async-retry";

// Get all commits since last release bump the root package.json version.
(async () => {
  //#region Constants
  const PATH = ".";
  const VERSION_PREFIX = "v";
  const CONVENTION = await angularChangelogConvention;
  const REPO_OWNER = "coveo";
  const REPO_NAME = "semantic-monorepo-tools";
  const GIT_USERNAME = "developer-experience-bot[bot]";
  const GIT_EMAIL =
    "91079284+developer-experience-bot[bot]@users.noreply.github.com";
  //#endregion

  // #region Setup Git
  gitSetupUser(GIT_USERNAME, GIT_EMAIL);
  // #endregion

  //#region GitHub authentication
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

  //#region Find current and new versions
  const lastTag = getLastTag(VERSION_PREFIX)[0];
  const commits = getCommits(PATH, lastTag)[0];
  const parsedCommits = parseCommits(commits, CONVENTION.parserOpts);
  const bumpInfo = CONVENTION.recommendedBumpOpts.whatBump(parsedCommits);
  const currentVersion = getCurrentVersion(PATH);
  const newVersion = getNextVersion(currentVersion, bumpInfo);
  const newVersionTag = `${VERSION_PREFIX}${newVersion}`;
  //#endregion

  // Bump the NPM version.
  npmBumpVersion(newVersion, PATH);

  //#region Generate changelog if needed
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

  //#region Commit changelog, tag version and push
  const tempBranchName = `release/${newVersion}`;
  const mainBranchName = getCurrentBranchName();
  const mainBranchCurrentSHA = getSHA1fromRef(mainBranchName);

  // Create a temporary branch and check it out.
  gitCreateBranch(tempBranchName);
  gitCheckoutBranch(tempBranchName);
  // Stage all the changes (mainly the changelog)...
  gitAdd(".");

  //... and create a Git tree object with the changes).
  const treeSHA = gitWriteTree();
  // Create a new commit that references the Git tree object.
  const commitTree = gitCommitTree(treeSHA, tempBranchName, "tempcommit");

  // Update the HEAD of the temp branch to point to the new commit, then publish the temp branch.
  gitUpdateRef("HEAD", commitTree);
  gitPublishBranch("origin", tempBranchName);

  /**
   * Once we pushed the temp branch, the tree object is then known to the remote repository.
   * We can now create a new commit that references the tree object using the GitHub API.
   * The fact that we use the API makes the commit 'verified'.
   * The commit is directly created on the GitHub repository, not on the local repository.
   */
  const commit = await octokit.rest.git.createCommit({
    message: `chore(release): ${newVersion} [skip ci]`,
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tree: treeSHA,
    parents: [mainBranchCurrentSHA],
  });

  // Forcefully reset our local `main` to the commit we just created with the GitHub API.
  gitSetRefOnCommit("origin", `refs/heads/${mainBranchName}`, commit.data.sha);
  gitCheckoutBranch(mainBranchName);
  //#endregion

  //#region Create & push tag
  gitTag(newVersionTag);
  gitPushTags();
  //#endregion

  // Publish the new version on NPM
  npmPublish(PATH);

  //#region Create GitHub Release on last tag
  const [, ...bodyArray] = changelog.split("\n");
  await octokit.rest.repos.createRelease({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    tag_name: newVersionTag,
    name: `Release ${newVersionTag}`,
    body: bodyArray.join("\n"),
  });
  //#endregion

  //#region Wait for CI to validate the released commit.
  await retry(
    async (bail) => {
      const releaseCheck = await octokit.rest.checks.listForRef({
        owner: REPO_OWNER,
        repo: REPO_NAME,
        ref: commit.data.sha,
        status: "completed",
        filter: "latest",
      });
      if (releaseCheck.data.check_runs.length === 0) {
        throw "No checks detected yet";
      }
      if (releaseCheck.data.check_runs[0].conclusion !== "success") {
        bail(new Error("Check unsuccessful"));
      }
    },
    { retries: 30 }
  );
  //#endregion

  //#region Set `main` to the proper release.
  await octokit.rest.git.updateRef({
    owner: REPO_OWNER,
    repo: REPO_NAME,
    ref: "refs/heads/main",
    sha: commit.data.sha,
  });
  // Finally, delete the temp branch.
  gitDeleteRemoteBranch("origin", tempBranchName);
  //#endregion
})();

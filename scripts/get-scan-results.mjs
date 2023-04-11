import { Octokit } from "octokit";

const owner = "coveo";
const repo = "semantic-monorepo-tools";
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const alerts = await octokit.rest.dependabot.listAlertsForRepo({
  owner,
  repo,
  state: "open",
});

const hasAtLeastOneUnaddressedAlert = alerts.data.length > 0;

process.exit(hasAtLeastOneUnaddressedAlert ? 1 : 0);

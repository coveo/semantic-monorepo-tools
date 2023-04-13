import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

const owner = "coveo";
const repo = "semantic-monorepo-tools";
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
const alerts = await octokit.rest.dependabot.listAlertsForRepo({
  owner,
  repo,
  state: "open",
});

const hasAtLeastOneUnaddressedAlert = alerts.data.length > 0;

process.exit(hasAtLeastOneUnaddressedAlert ? 1 : 0);

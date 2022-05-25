import { getOctokit } from "@actions/github";

const owner = "coveo";
const repo = "semantic-monorepo-tools";
const octokit = getOctokit(process.env.GITHUB_TOKEN);

const getSnykCodeAlerts = () => {
  return octokit.rest.codeScanning.listAlertsForRepo({
    owner,
    repo,
    ref: "main",
    tool_name: "SnykCode",
    state: "open",
  });
};

const isHighSeverity = (alert) => alert.rule.severity === "error";
(async () => {
  const alerts = (await getSnykCodeAlerts()).data;
  const hasAtLeastOneHighAlert = alerts.some(isHighSeverity);
  process.exit(hasAtLeastOneHighAlert ? 1 : 0);
})();

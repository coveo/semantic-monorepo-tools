import { Octokit } from "octokit";
import { createAppAuth } from "@octokit/auth-app";
import { join } from "node:path";
import { readFileSync } from "node:fs";
import { parse as yamlParse } from "yaml";

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

const sbom = (
  await octokit.request("GET /repos/{owner}/{repo}/dependency-graph/sbom", {
    owner,
    repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  })
).data.sbom;

const authorizedLicenseFilename =
  process.env.public === "true"
    ? "public"
    : process.env.distributed === "true"
    ? "private-distributed"
    : "private-undistributed";

const licensePath = join(
  "coveo-dependency-allowed-licenses",
  `${authorizedLicenseFilename}.yml`
);

const allowedLicenses = yamlParse(
  readFileSync(licensePath, { encoding: "utf-8" })
)["allow-licenses"];

for (const dependency of sbom.packages) {
  if (!allowedLicenses.includes(dependency.licenseConcluded)) {
    process.exit(1);
  }
}

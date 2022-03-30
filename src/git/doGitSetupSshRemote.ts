import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export default function (
  REPO_OWNER: string,
  REPO_NAME: string,
  sshKey: string,
  remoteName: string
) {
  const sshDirPath = join(homedir(), ".ssh");
  const pemPath = join(sshDirPath, "id_rsa");
  const sshConfigPath = join(sshDirPath, "config");
  mkdirSync(sshDirPath, { recursive: true });
  writeFileSync(pemPath, sshKey);
  chmodSync(pemPath, 0o400);
  writeFileSync(
    sshConfigPath,
    `Host ${remoteName}
  Hostname github.com
  PreferredAuthentications publickey
  IdentityFile ${pemPath}`
  );

  spawnSync(
    "git",
    [
      "remote",
      "add",
      remoteName,
      `git@${remoteName}:${REPO_OWNER}/${REPO_NAME}.git`,
    ],
    gitLogger
  );
}

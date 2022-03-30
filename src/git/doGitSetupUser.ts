import spawnSync from "../utils/spawnSync.js";
import gitLogger from "./utils/gitLogger.js";

export default function (name?: string, email?: string) {
  if (name) {
    setUserProperty("name", name);
  }
  if (email) {
    setUserProperty("email", email);
  }
}

function setUserProperty(key: string, value: string) {
  spawnSync("git", ["config", "--global", `user.${key}`, value], gitLogger);
}

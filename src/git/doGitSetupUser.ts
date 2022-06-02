import spawn from "../utils/spawn.js";
import gitLogger from "./utils/gitLogger.js";

export default async function (name?: string, email?: string) {
  if (name) {
    await setUserProperty("name", name);
  }
  if (email) {
    await setUserProperty("email", email);
  }
}

async function setUserProperty(key: string, value: string) {
  await spawn("git", ["config", "--global", `user.${key}`, value], gitLogger);
}

import spawn from "../utils/spawn.js";
import appendCmdIfWindows from "./utils/appendCmdIfWindows.js";
import npmLogger from "./utils/npmLogger.js";

type WorkspaceUpdateStrategy = "NoUpdate" | "UpdateWithCarret" | "UpdateExact";

const DefaultOptions: Required<Options> = {
  workspaceUpdateStrategy: "NoUpdate",
};
interface Options {
  /**
   * Define how to update the other packages of the workspace:
   *  * `NoUpdate`: Do not update the other packages of the workspaces
   *  * `UpdateWithCarret`: Update the other packages of the workspaces, with a loose specifier matching the inputed version
   *  * `UpdateExact`: Update the other packages of the workspaces, with the inputed version (strict).
   *
   * @default {'NoUpdate'}
   */
  workspaceUpdateStrategy?: WorkspaceUpdateStrategy;
}

export default async function (
  newVersion: string,
  PATH: string,
  options?: Options,
) {
  const completeOptions: Required<Options> = { ...DefaultOptions, ...options };

  const npmArgs = ["version", newVersion, "--git-tag-version=false"].concat(
    computeFlagsFromOptions(completeOptions),
  );

  await spawn(appendCmdIfWindows`npm`, npmArgs, npmLogger, {
    cwd: PATH,
  });
}
function computeFlagsFromOptions(options: Required<Options>) {
  switch (options.workspaceUpdateStrategy) {
    case "NoUpdate":
      return [];
    case "UpdateExact":
      return ["--save", "-E"];
    case "UpdateWithCarret":
      return ["--save"];
  }
}

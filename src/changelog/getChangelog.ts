import {
  Context,
  Options,
  writeChangelogStream as changelogWriter,
} from "conventional-changelog-writer";
import type { Commit } from "conventional-commits-parser";

interface WriterContext extends Context {
  currentTag: string;
  previousTag: string;
}

export default function (
  parsedCommits: Array<Commit>,
  newVersion: string,
  writerContext: Partial<WriterContext> = {},
  writerOpts: Options = {},
) {
  const ctx = {
    ...writerContext,
    version: newVersion,
  };
  let changelog = "";
  const changelogStream = changelogWriter(ctx, writerOpts);
  changelogStream.on("data", (data) => (changelog += data.toString()));
  parsedCommits.forEach((commit) => changelogStream.write(commit));
  changelogStream.end();
  return new Promise<string>((resolve) =>
    changelogStream.on("finish", () => resolve(changelog)),
  );
}

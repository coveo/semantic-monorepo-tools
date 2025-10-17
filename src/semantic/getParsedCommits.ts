import {
  Commit,
  parseCommits,
  ParserStreamOptions as Options,
} from "conventional-commits-parser";

/**
 * Format raw commits into objects
 * @param commits array of commits formated in an acceptable format for `conventional-commits-parser`. See https://www.npmjs.com/package/conventional-commits-parser#Usage
 * @returns {Commit} array of conventional commit objects
 */
export default async function (
  commits: string[],
  opts?: Options,
): Promise<Array<Commit>> {
  return await Array.fromAsync(parseCommits(opts)(commits));
}

# semantic-monorepo-tools

A library of helper functions to do [SemVer2](https://semver.org/) compliant releases from [Conventional Commits](https://www.conventionalcommits.org/) in monorepos.

## Why?

Before, one would use `lerna version` to make semantic releases in a monorepo, but [lerna is dead](https://github.com/lerna/lerna/issues/3062).

The most predominant tools in the field, [`standard-version`](https://github.com/conventional-changelog/standard-version) and [`semantic-release`](https://github.com/semantic-release/semantic-release) do not offer the level of flexibility that `lerna` did offer (e.g. it's hard to do semantic releases when packages do not share the same version and Changelog generation are sometimes tangled).

Because there are so many ways to do semantic releases in a monorepo, and that an opinionated way could result in releases that make less sense for the user of the published packages, `semantic-monorepo-tools` took the approach to leave the implementation process in the hand of the user, and instead focus on providing functions to 'get what you need' and 'do what you need to do' directly with JavaScript.

## What?

`semantic-monorepo-tools` aims to take the functions of a single-package release flow such as `standard-version` and make them available as standalone building blocks.
The goal is to make abstractions of the inner working of the tools (e.g. `git`, `npm`) behind simple pure (ish) functions.

## Examples

`semantic-monorepo-tools` is used for the release processes of monorepo at Coveo, you can find implementations examples on some of our repository:
 - [`coveo/cli`](https://github.com/coveo/cli/blob/master/scripts/releaseV2)
 - [`coveo/plasma`](https://github.com/coveo/plasma/blob/master/build/publishNewVersion.mjs)

# serverless-plugin-git-variables
[![Coverage Status](https://coveralls.io/repos/github/jacob-meacham/serverless-plugin-git-variables/badge.svg?branch=develop)](https://coveralls.io/github/jacob-meacham/serverless-plugin-git-variables?branch=develop)
[![Build Status](https://travis-ci.org/jacob-meacham/serverless-plugin-git-variables.svg?branch=develop)](https://travis-ci.org/jacob-meacham/serverless-plugin-git-variables)

Expose git variables (HEAD description, branch name, short commit hash, message, and if the local repo has changed files) to your serverless services.
Moreover, it adds GIT related environment variables and tags (GIT_COMMIT_SHORT, GIT_COMMIT_LONG, GIT_BRANCH, GIT_IS_DIRTY) for each defined function in the serverless file. You can disable this by adding the following custom variable in your serverless.yml file:

```
custom:
  exportGitVariables: false
```

# Usage
```yaml

functions:
  processEventBatch:
    name: ${self:provider.stage}-${self:service}-process-event-batch
    description: ${git:branch} - ${git:describe} - ${git:sha1}

  processEventBatch2:
    name: ${self:provider.stage}-${self:service}-process-event-batch-2
    description: ${git:describeLight} - ${git:branch}

plugins:
  - serverless-plugin-git-variables
```

## describe and describeLight
The describe (`${git:describe}`) and the describeLight (`${git:describeLight}`) variables are both used to return the most recent tag of the repo. However the difference is that whilst `describe` evaluates to `git describe --always`, the `describeLight` variable evaluates to `git describe --always --tags`.
`--always` will ensure that if no tags are present, the commit hash is shown as a fallback option. (See [git describe documentation](https://git-scm.com/docs/git-describe) for more information).

Annotated tags are shown by both `describe` and `describeLight`, only `describeLight` will show lightweight tags (such as those generated when using GitHub's releases feature).

For more information on annotated and lightweight tags go to the [git documentation on tagging](https://git-scm.com/book/en/v2/Git-Basics-Tagging).

# Serverless Version Support
* If you're using serverless 1.12.x or below, use the 1.x.x version of this plugin.
* This plugin is currently broken for serverless versions between 1.13 and 1.15 (inclusive).
* If you're using serverless 1.16.x or above, use the >=2.x.x version of this plugin.

# Version History
* 3.2.0
  - Added a describeLight git variable, which allows use of lightweight tags (Thanks to @domroutley)
* 3.1.1
  - Fix issue that occurs if a function has no environment specified (Thanks to @arnaudh-nutonomy)
* 3.1.0
  - Plugin now also adds environment variables that are accessible at runtime (Thanks to @chechu)
* 3.0.0
  - Add support for long commit hash (Thanks to @e-e-e)
  - backwards incompatible change: git describe now uses --always, so if there are not tags it returns a hash instead of failing (Thanks to @e-e-e)
* 2.1.1
  - Fix packaging issue
* 2.1.0
  - Add support for git message (Thanks to @campadrenalin)
* 2.0.0
  - support Serverless >= 1.16.0
* 1.0.1
  - list babel-runtime as a dependency
* 1.0.0
  - Initial release

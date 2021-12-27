# PR (Pull Request) Workflow

Let's say you've been assigned to work on a bug or story... where do you branch from and where do you create a PR to merge into?  Our current process of maintaining Dawson involves needing to deal with two separate forks of the repository.  Knowing where to branch off of when working on bugs and stories can get confusing.  This part of the documentation is to help clarify the exact process a developer should follow if assigned to an issue.

## Branches of Interest

Since we mentioned we worked off of two forks of the repo, it will be useful to understand the main branches we typically develop off of on this project.  A majority of us (Flexion) will work off of the flexion fork, but we often need to get work merged into the Court's repo.  Take note of the following branches:

### Flexion Fork Branches
- `origin/develop` (for **passive** branch development)
- `origin/staging` (for **active** branch development)
- `origin/experimental1` (for deploying to a test environment)
- `origin/experimental2` (for deploying to a test environment)
- `origin/experimental3` (for deploying to a test environment)
- `origin/experimental4` (for deploying to a test environment)
- `origin/experimental5` (for deploying to a test environment)

We will discuss what **passive** and **active** means lower in this documentation, but for the most part you will work off of develop or staging when dealing with refactoring or story work, and occionasily push your change to an experimental branch to verify your changes if major devops or AWS work was required.

Multiple times during a sprint we will need to interact with the US Tax Court fork.  Take note of the following branches:

### US Tax Court Fork Branches
- `upstream/migration` (a staging environment for the PO to verify story work)
- `upstream/test` (kept up to date with `prod`, but a staging environment for PO to verify bug fixes)
- `upstream/staging` (kept up to date with `prod`, but also a staging environment for the upcoming deploy)
- `upstream/prod` (the current version which is running on production)

If you are at Flexion, you will never need to touch `upstream/prod`.

?> The court often commits code to their staging branch which requires us to back merge changes into our Flexion fork.  See the [Environment Shuffle](/pr-workflow.md?id=environment-shuffle) section below for more information.

## Story PR Workflow

To understand how to work on non bug features, we need to talk about a Dawson specific concept of **batches of work**.  Over time, our process has landed on batching groups of stories together so that they are all deployed to the court as one deliverable.  The main driving factor for this approach is that the Tax Court does **NOT** want unfinished stories deployed to production.  Because of this, we will take 2 or 3 stories, attach a specific batch label to those stories, and try to get them all deployed in a single PR to the Tax Court.

Due to the size of our team, we often require two batches to be worked on in parallel.  Some developers will be trying to wrap up the **active** batch, while other developers who are looking for work will focus on the **passive** batch.  The batches will increment after each successful deployment to production; therefore, batch 14 might be our **active** batch, and batch 15 will be the **passive** batch.

The **active** batch is always being branched off the `flexion/staging` branch.

The **passive** batch is always being branched off the `flexion/develop` branch. 

?> Don't worry, the location of where each batch should be merged is talked about in standup and posted in slack.

As you finish up your **active batch** stories, you will need to get them deployed to the `court/migration` environment so that the product owner and Tax Court can verify your features against production like data.  This environment should only contain the latest changes of our **active batch**.  When the Court has tested your story, they will mark the story as `done` and you can either help other developers out with more **active batch** stories, of grab a **passive branch** story if no additional eyes are needed.



> The **active** batch should be branched off of `flexion/staging` and a PR should be created to `court/staging` when the batch is done.

> The **passive** batch should be branched off of `flexion/develop`.  The passive batch will **NOT** go in a PR to the court fork.

## Refactoring PR Workflow

As mentioned in the previous part of documentation, we have a refactoring backlog found in trello.  Remember, 20% of our time should be spent refactoring our system, pipeline, and code.  These refactoring tasks are not really associated with batches, so we often just branch the work off of `flexion/develop` so that the refactoring work has a longer time in our system to help catch potential bugs, and the work won't slow down the progress of an **active** batch if the refactoring causes bugs.

 
> Refactoring work should always be off of `flexion/develop`. Refactoring work will **NOT** go in a separate PR to the court fork; it flows along with normal batch work.

## Bug PR Workflow


The `court/staging` branch is kept up to date with the latest version of `prod` and is considered the *source of truth*.  Developers working on bugs should create a branch off of the `court/staging` branch.  Once they think they've found a solid fix, developers can additionally deploy their bug fix to a Flexion experimental environment (`origin/experimental1`) as sometimes bugs are related to migration scripts or AWS resources.


When the fix is ready for the court, a pull request should be created to merge your bug branch into `court/test`.  The court's tech lead will review the bug fix PR and merge it to get it deployed to the court's `test` branch.  The `test` branch has a production like copy of the data to allow for accurate verification of the bug fix.  The court will test the environment before marking the bug issue as `done`.

The tax court will later merge their `court/test` branch into `court/staging`, and shortly after deploy it to `production`

> When working on fixing a bug, developer should branch off of `court/staging` and create a PR to `court/test`

## Environment Shuffle

When all of the stories in the **active** batch has been marked as done, we start a process we denote as the `environment shuffle`.  This process involves checking out a new branch from `flexion/staging` and creating a PR to be merged into the `court/staging` branch.  This process can be done eariler if the stories are almost done via opening a `draft pull request` which allows the court to start doing code reviews while some smaller tasks are being wrapped up.  

Once everything in the batch is fully done and ready for a **formal code review**, the draft PR can be converted to a normal pull request, and the batch waits until the Tax Court fully reviews the code.  The only additional changes that should occur as this point is for addressing code review comments given by the Tax Court.  If major code changes are requested by the tax court, we recommend to get the changes redeployed to `court/migration` to verify against production like data.

When the Tax Court verifies the pull request, they will merge the PR, get it deployed to their staging environment, and do any final testing on production like data.  If everything seems ok, the Tax Court will make a PR from `court/staging` to `court/prod`, merge, and get a production deployment started.

### Exact Steps to Follow

The following steps are a more in depth description of the process describe above.

1. Back-merge USTC `staging` into Flexion `staging`.

   1. Create a new branch (e.g. `from-courts-staging`) off of `flexion/staging`.
   2. Merge `ustc/staging` into the new branch (e.g. into `from-courts-staging`).
   3. If merge conflicts exist, work with those involved in the conflicting changes.
      For example, on 10/21/21, we merged `ustc/staging` into `flexion/staging`.
      `flexion/staging` had changes from the devex task where moment.js was replaced with luxon.
      However, incoming changes from `ustc/staging` had new work using moment.js format.
      Had to update new code from `ustc/staging` to use luxon format and fix the broken tests.
   4. Create and merge passing PR from current branch (e.g. `from-courts-staging`) to `flexion/staging`.

2. Wait for smoketests to pass on resulting `flexion/staging` build.

3. Prepare Batch PR.

   1. Merge `flexion/staging` to the batch branch (the one currently in a draft state, e.g. batch 10).
      If the draft PR (e.g. batch 10 PR) is still out of date with `ustc/staging`, start this process over at step 1.1.
   2. Mark the draft batch PR (e.g. batch 10 PR) as "Ready For Review" (i.e. convert from draft PR to open PR).

4. Sync Flexion `staging` and Flexion `develop`.

   1. Create a new branch off of `flexion/develop` (e.g. `staging-to-develop`).
   2. Merge `flexion/staging` into the new branch (e.g. into `staging-to-develop`).
   3. If merge conflicts exist, work with those involved in the conflicting changes.
   4. Create and merge passing PR from current branch (e.g. `staging-to-develop`) to `flexion/develop`.
   5. Create a PR to merge `flexion/develop` into `flexion/staging`, so that new batch work (e.g. batch 11) is on `flexion/staging`.

5. Update USTC `migration` with latest batch.

   1. Create a new branch off of `flexion/staging` (e.g. `to-court-migration`).
   2. Create a PR to merge the new branch (e.g. `to-court-migration`) into `ustc/migration`, so that new batch work (e.g. batch 11) is on `ustc/migration` and can be tested with prod like data.
   3. Click the "Update branch" to make the new branch (e.g. `to-court-migration`) up-to-date with `ustc/migration`.
   4. Merge the PR after approvals and the checks pass.

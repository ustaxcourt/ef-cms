# PR Workflow

Let's say you've been assigned to work on a bug or story... where do you branch from and where do you create a PR to merge into?  Due to our current process of maintaining two separate forks of Dawson, knowing which fork to branch from when working on bugs and stories can get confusing real fast.  This part of the documentation is to help clarify the exact process a developer should follow if assigned to an issue.

## Bug PR Workflow

> When working on fixing a bug, developer should branch off of `court/staging` and create a PR to `court/test`

The `court/staging` branch is kept up to date with the latest version of master and is considered the *source of truth*.  Developers working on bugs should create a branch off of the `court/staging` branch.  Once they think they've found a solid fix, they should deploy their fixes to a Flexion experimental environment (`origin/experimental1`) to verify their fixes work on a deployed AWS environment.


A PR should be create to merge your bug branch into `court/test`.  The court's tech lead will review the bug fix PR and merge it to get it deployed to the court's `test` branch.  The `test` branch has a production like copy of the data to allow for accurate verification of the bug fix.  The court will test the environment before marking the bug issue as `done`.  The tax court will later merge their `court/test` branch into `court/staging` and later get that deployed to `production`.

## Story PR Workflow

> The **active** batch should be branched off of `flexion/staging` and a PR should be created to `court/staging` when the batch is done/

> The **passive** batch should be branched off of `flexion/develop`.  The passive batch will **NOT** go in a PR to the court fork.

To understand how to work on non bug features, we need to talk about a Dawson specific concept of **batches of work**.  Over time, our process has landed on batching groups of stories together so that they are all deployed to the court as one deliverable.  The main driving factor for this approach is that the Tax Court does **NOT** want unfinished stories deployed to production.  Because of this, we will take 2 or 3 stories, attach a specific batch label to those stories, and try to get them all deployed in a single PR to the Tax Court.

Due to the size of our team, we often require two batches to be worked on in parallel.  Some developers will be trying to wrap up the **active** batch, while other developers who are looking for work will focus on the **passive** batch.  The batches will increment after each successful deployment to production; therefore, batch 14 might be our **active** batch, and batch 15 will be the **passive** batch.

The **active** batch is always being branched off the `flexion/staging` branch.

The **passive** batch is always being branched off the `flexion/develop` branch. 

?> Don't worry, the location of where each batch should be merged is talked about in standup and posted in slack.

As you finish up your **active batch** stories, you will need to get them deployed to the `court/migration` environment so that the product owner and Tax Court can verify your features against production like data.  This environment should only contain the latest changes of our **active batch**.  When the Court has tested your story, they will mark the story as `done` and you can either help other developers out with more **active batch** stories, of grab a **passive branch** story if no additional eyes are needed.

## Refactoring PR Workflow
 
> Refactoring work should always be off of `flexion/develop`. Refactoring work will **NOT** go in a PR to the court fork; it flows along with normal batch work.

As mentioned in the previous part of documentation, we have a refactoring backlog found in trello.  Remember, 20% of our time should be spent refactoring our system, pipeline, and code.  These refactoring tasks are not really associated with batches, so we often just branch the work off of `flexion/develop` so that the refactoring work has a longer time in our system to help catch potential bugs, and the work won't slow down the progress of an **active** batch if the refactoring causes bugs.

## Environment Shuffle

When all of the stories in the **active** batch has been marked as done, we start a process we denote as the `environment shuffle`.  This process involves checking out a new branch from `flexion/staging` and creating a PR to be merged into the `court/staging` branch.  This process can be done eariler if the stories are almost done via opening a `draft pull request` which allows the court to start doing code reviews while some smaller tasks are being wrapped up.  

Once everything in the batch is fully done and ready for a **formal code review**, the draft PR can be converted to a normal pull request, and the batch waits until the Tax Court fully reviews the code.  The only additional changes that should occur as this point is for addressing code review comments given by the Tax Court.  If major code changes are requested by the tax court, we recommend to get the changes redeployed to `court/migration` to verify against production like data.

When the Tax Court verifies the pull request, they will merge the PR, get it deployed to their staging environment, and do any final testing on production like data.  If everything seems ok, the Tax Court will make a PR from `court/staging` to `court/prod`, merge, and get a production deployment started.
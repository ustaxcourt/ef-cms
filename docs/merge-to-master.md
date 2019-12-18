# Moving Code from Staging to Master

## What this is
This is the process that’s used to review code in `staging` and determine whether it’s appropriate to move to `master`. This is a more stringent review process than is applied at the end of a sprint, and is intended to be the beginning of the pipeline to move code into production. (When an ATO process is in place, that will serve as the remainder of the pipeline, and will add some more stringent requirements.)

## How to file a PR
To use this process, create a new branch from `staging` named for the sprint (e.g., `sprint-53`), and then [open a new pull request](https://github.com/ustaxcourt/ef-cms/compare) [using the `Merge to Master` template](https://github.com/ustaxcourt/ef-cms/blob/staging/.github/PULL_REQUEST_TEMPLATE/merge-to-master.md). That contains a checklist of every task that needs to be completed in order to move code to `master`. It’s fine to create a draft pull request at the start of your work and use it as the base for your work until such time as it’s ready for review, at which point the pull request should be assigned to the Court’s designated person.

## How to review a PR
Step through every item in the checklist and ensure that everything has been done. Regard it as a conversation — if there’s anything that you’re unclear on or have questions about, reply to the issue. If you need to discuss it with the requester out of band (e.g., via phone), that’s fine, but it’s important to record those basic facts in the issue. That is, if you found a problem, and it’s resolved in conversation, ensure that the basis for that resolution is written down for the record.

If all conditions have been met, but you have reservations about merging the PR — i.e., it’s technically compliant, but there is an obvious problem, you _do not need to merge it._ The checklist is a guideline. You can change it at any time, including while a review is in progress.

When you are satisfied that all conditions have been met, merge the pull request to `master`.

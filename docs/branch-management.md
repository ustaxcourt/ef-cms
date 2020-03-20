# Moving Code between Environments

## Deploying Work into Staging

After the end-of-sprint pull request from the vendor has been received, [evaluated](https://github.com/ustaxcourt/ef-cms/blob/staging/docs/CODE_REVIEW.md), and judged acceptable, it must be accepted into `staging` and deployed.

To accept the PR, the reviewer should use GitHub's review functionality to approve it, and then assign the PR to the Court product owner. It’s helpful to also comment on the PR, tagging the product owner, explaining in a sentence or so that you have reviewed the work, found it acceptable, and recommend accepting it into `staging`.

When the pull request is accepted, AWS IAM policies must be updated. The following steps will generate the policies and publish them to IAM:

```
cd iam/terraform/account-specific/main && ../bin/deploy-app.sh
cd ../../environment-specific/main && ../bin/deploy-app.sh stg
```

Because the deploy will happen as soon as the pull request is accepted, it is possible that the deploy will fail in the time between when the PR is accepted and when these policies are updated, if the work done in that sprint requires new permissions within IAM to deploy. If this happens, simply re-run the deploy once the permissions are updated.

If any other problems are encountered in the process of deploying to `staging`, check [the troubleshooting document](https://github.com/ustaxcourt/ef-cms/blob/doc-updates/docs/TROUBLESHOOTING.md) for guidance.

## Deploying to the Test Environment

The Court maintains [an environment for UX testing](https://ui-test.ef-cms.ustaxcourt.gov/), which is built from [the `test` branch](https://github.com/ustaxcourt/ef-cms/tree/test).

Updates flow to the `test` branch from `staging`. That update is performed every two weeks, after the conclusion of each sprint, _after_ changes have been successfully deployed into the staging environment.

To start this process, create a new branch from `staging` named for the sprint (e.g., `sprint-53`), and then [open a new pull request](https://github.com/ustaxcourt/ef-cms/compare) to `test`.

If any special steps proved necessary when deploying into the staging environment that were not documented in the vendor’s pull request, those steps must be documented in the pull request. If there are no special steps, it is fine for the pull request to simply report that it is deploying the results of e.g. sprint 53 and link to the associated pull request to `staging`.

No additional review is performed before moving work into the test environment, such as is performed when moving work into production.

Pull requests to `test` must only be merged by the product owner or their designee. This is to allow them to time the deploy so as to avoid updating the test environment while it’s actually being used for UX testing.

When the pull request is accepted, AWS IAM policies must be updated. The following steps will generate the policies and publish them to IAM:

```
cd iam/terraform/account-specific/main && ../bin/deploy-app.sh
cd ../../environment-specific/main && ../bin/deploy-app.sh test
```

Because the deploy will happen as soon as the pull request is accepted, it is possible that the deploy will fail in the time between when the PR is accepted and when these policies are updated, if the work done in that sprint requires new permissions within IAM to deploy. If this happens, simply re-run the deploy once the permissions are updated.

## Deploying to the “Production” Environment

The Court maintains [a faux-production environment](https://ui-test.ef-cms.ustaxcourt.gov/) (the system is not yet in production), which is built from [the `master` branch](https://github.com/ustaxcourt/ef-cms/tree/master).

This is the process that’s used to review code in `staging` and determine whether it’s appropriate to move to `master`. This is a more stringent review process than is applied at the end of a sprint, and is intended to be the beginning of the pipeline to move code into production. (When an ATO process is in place, that will serve as the remainder of the pipeline, and will add some more stringent requirements.)

### How to file the PR

To use this process, create a new branch from `staging` named for the sprint (e.g., `sprint-53`), and then [open a new pull request](https://github.com/ustaxcourt/ef-cms/compare) [using the `Merge to Master` template](https://github.com/ustaxcourt/ef-cms/blob/staging/.github/PULL_REQUEST_TEMPLATE/merge-to-master.md). That contains a checklist of every task that needs to be completed in order to move code to `master`. It’s fine to create a draft pull request at the start of your work and use it as the base for your work until such time as it’s ready for review, at which point the pull request should be assigned to the Court’s designated person.

### How to review the PR

Step through every item in the checklist and ensure that everything has been done. Regard it as a conversation — if there’s anything that you’re unclear on or have questions about, reply to the issue. If you need to discuss it with the requester out of band (e.g., via phone), that’s fine, but it’s important to record those basic facts in the issue. That is, if you found a problem, and it’s resolved in conversation, ensure that the basis for that resolution is written down for the record.

If all conditions have been met, but you have reservations about merging the PR — i.e., it’s technically compliant, but there is an obvious problem, you _do not need to merge it._ The checklist is a guideline. You can change it at any time, including while a review is in progress.

When you are satisfied that all conditions have been met, merge the pull request to `master`.

When the pull request is accepted, AWS IAM policies must be updated. The following steps will generate the policies and publish them to IAM:

```
cd iam/terraform/account-specific/main && ../bin/deploy-app.sh
cd ../../environment-specific/main && ../bin/deploy-app.sh prod
```

Because the deploy will happen as soon as the pull request is accepted, it is possible that the deploy will fail in the time between when the PR is accepted and when these policies are updated, if the work done in that sprint requires new permissions within IAM to deploy. If this happens, simply re-run the deploy once the permissions are updated.

# Environment Shuffle Process

Overall, we want to merge `ustc/staging` to `flexion/staging` and `flexion/staging` to `flexion/develop` as often as possible.

## Specific Steps

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
      If the draft PR (e.g. batch 10 PR) is still out of date with `ustc/staging`, start over at step 1.1.
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

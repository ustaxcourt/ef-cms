# Environment Shuffle Process

* Create new branch (eg from-courts-staging) off of `flexion/staging` 

* Merge `ustc/staging` into the new branch (eg into from-courts-staging)

* If merge conflicts exist, work with those involved in the conflicting changes
    (eg - on 10/21/21, we merged `ustc/staging` into `flexion/staging`. `flexion/staging` had changes from the devex task where moment.js was replaced with luxon. However, incoming changes from `ustc/staging` had new work using moment.js format. Had to update new code from `ustc/staging` to use luxon format and fix broken tests)

* Create & merge passing PR from current branch (eg from-courts-staging) to `flexion/staging`

* Wait for smoketests to pass on resulting `flexion/staging` build

* Merge `flexion/staging` to the batch branch (the one currently in a draft state, eg batch 10)

    * if the draft PR (eg batch 10 PR) is still out of date with `ustc/staging`, start the process over until and up to this step again

* Mark the draft batch PR (eg batch 10 PR) as `Ready For Review` (convert from draft PR to open PR)

* Create a PR to merge `flexion/develop` into `flexion/staging` (so that new batch work (eg batch 11) is on flexion/staging)

* Create a PR to merge `flexion/staging` to `ustaxcourt/migration` (so that new batch work (eg batch 11) can be tested with prod like data)

* Merge `ustc/staging` to `flexion/staging` and `flexion/staging` to `flexion/develop` as often as possible


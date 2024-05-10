# Offboarding a judge user

## Description
This runbook describes the process of offboarding a judge user if they no longer work with the US Tax Court, for whatever reason. This will mark the judge as a "legacy" judge, meaning they won't be an available choice for assigment on any active work in DAWSON, but will still be available in places where legacy judges should be, e.g. Order & Opinion searches. 

Since completing this runbook in its entirety requires access to USTC environments, this runbook includes a handoff to a USTC Engineer with the necessary priveleges to adminster USTC environments.

## Preqrequisites
- `offboard-judge-user.sh`
- Environment switcher config, `set-env.sh`
- AWS access (DynamoDB and Cognito)
- Standard development setup described in `running-locally.md`
- The judge being offboarded should not have any active cases / trials / etc. assigned to them. (Check with the PO for whether or not this has happened)

## Steps
1. In `judge_users.csv`, find the judge to be offboared. Change their role from `judge` to `legacyJudge` and their section from `{judgeName}Chambers` to `legacyJudgeChambers`.
  a. e.g. `Colvin,Judge,John O. Colvin,judge.colvin@example.com,judge,colvinsChambers,true` becomes `Colvin,Judge,John O. Colvin,judge.colvin@example.com,legacyJudge,legacyJudgesChambers,true`
2. Remove their chambers from the list of valid sections in `add-user.ts`
3. In `getJudgesChambers.ts`, add `isLegacy: process.env.USTC_ENV === 'prod',` to their chambers section. This marks their chambers section as legacy in deployed environments so that they no longer show up in select inputs for selecting a judge's chambers.
4. Check for and fix any smoke tests that rely upon the judge being offboarded or their chambers. This process leaves the judge user active in environments relying on 'local' data (e.g. developer machines, CI pipeline), so other tests relying only on 'local' data should not be impacted.
5. Deploy the change. Deployment takes care of all offboarding in environments other than **test** and **prod**
6. Using the environment switcher, source `ustc-test`
```
source ./scripts/env/set-env.zsh ustc-test
```
7. run `offboard-judge.sh`, passing in the user ID and current dynamoDB table to update (`alpha` or `beta`)
```
./offboard-judge-user.sh {judgeUserId} {alpha|beta}
```
6. If you haven't already, open a PR against `staging` for this change
7. At this point, hand off to a USTC engineer.
8. Once this change is deployed to staging/production, run `offboard-judge.sh` as above, but against staging/production.

## Additional Resources
- Optional section
- List here any links to reference or exlanatory material that could be useful / related to the process defined in the runbook
  - e.g. if the process is to "Deactivate a user", you might link to the Cognito docs, or another DAWSON doc page about how we manage users.
# Adding or Updating a Judge User

## Description
This runbook describes the process of onboarding or updating a Judge user. DO NOT use this runbook to offboard a judge. Instead, see `offboard-judge-user.md`.

## Preqrequisites
- `add-judge.ts`, `update-judge.ts` (see these scripts for usage details)
- Environment switcher config, `set-env.sh`
- AWS access (DynamoDB and Cognito)
- Standard development setup described in `running-locally.md`

## Steps for Adding or Updating a Judge User
1. If you want the new judge (or updated judge information) to be available in deployed environments other than test/prod, you will need to add or update the judge information in `judge_users.csv`. (There are plenty of examples in the CSV to guide you.) Once deployed in the given environment, these changes will take effect.
2. If you want the new judge (or updated judge information) to be available locally and in CI, you will need to add or update the judge information in `efcms-local.json`. Look at the other judge users (you can search the file for `judgeFullName`) for guidance.
3. To update the test environment: Use the environment switcher and run `add-judge.ts` or `update-judge.ts` according to your needs, e.g.:
```
source ./scripts/env/set-env.zsh ustc-test
npx ts-node --transpile-only ./scripts/user/add-judge.ts ...
```
These scripts will add/update the appropriate user records in Cognito and Dynamo.
4. To update the production environment: If you have access to the production environment, run either `add-judge.ts` or `update-judge.ts` as above. If you do not have access, hand off to a USTC engineer, linking to this documentation.

## Caveat
If you update the name of a judge, their chambers section will be updated as well. However, as of 4 September 2024, we do not have anything that prevents a stale edit from overwriting an update. In other words, the following is possible:
- An admin begins to update a chambers user
- The script to update the judge's name is run
- The admin finishes the updates to the chambers user (in principle up to 24 hours later), overwriting that user's newly updated chambers section

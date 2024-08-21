# Adding or Updating a Judge User

## Description
This runbook describes the process of onboarding or updating a Judge user. DO NOT use this script to offboard a judge. Instead, see `offboard-judge-user.md`.

## Preqrequisites
- `add-judge.ts`, `update-judge.ts` (see these scripts for usage details)
- Environment switcher config, `set-env.sh`
- AWS access (DynamoDB and Cognito)
- Standard development setup described in `running-locally.md`

## Steps for Adding or Updating a Judge User
1. If you want the new judge (or updated judge information) to be available in deployed environments other than test/prod, you will need to add or update the judge information in `judge_users.csv`. (There are plenty of examples in the CSV to guide you.) Once deployed in the given environment, these changes will take effect.
2. If you want the new judge (or updated judge information) to be available locally and in CI, you will need to add or update the judge information in `efcms-local.json`. Look at the other judge users (you can search the file for `judgeFullName`) for guidance.
2. To update the test environment, use the environment switcher and run `add-judge.ts` or `update-judge.ts` according to your needs, e.g.:
```
source ./scripts/env/set-env.zsh ustc-test
npx ts-node --transpile-only ./scripts/user/add-judge.ts
```
3. To update the production environment: If you have access to the production environment, run either `add-judge.ts` or `update-judge.ts`. If you do not have access, hand off to a USTC engineer, linking to this documentation.
4. These scripts will add/update the judge user record in Cognito and Dynamo.

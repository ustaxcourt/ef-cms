# Offboarding a Judge user

## Description
This runbook describes the process of offboarding a Judge user if they no longer work with the US Tax Court, for whatever reason. This will mark the Judge as a "legacy" Judge, meaning they won't be an available choice for assignment on any active work in DAWSON, but will still be available in places where legacy Judges should be, e.g. Order & Opinion searches. 

Since completing this runbook in its entirety requires access to USTC environments, this runbook includes a handoff to a USTC Engineer with the necessary privileges to administer USTC environments.

## Prerequisites
- `offboard-judge-user.sh`
- Environment switcher config, `set-env.sh`
- AWS access (DynamoDB and Cognito)
- Standard development setup described in `running-locally.md`
- The Judge being offboarded should not have any active cases / trials / etc. assigned to them. (Check with the PO for whether or not this has happened)

## Steps
### To Update the Judge User in Deployed Environments Other Than Test/Prod
1. In `judge_users.csv`, find the Judge to be offboarded. Change their role from `judge` to `legacyJudge` and their section from `{judgeName}Chambers` to `legacyJudgeChambers`. For example:
```
Colvin,Judge,John O. Colvin,judge.colvin@example.com,judge,colvinsChambers,true,(123) 123-1234
``` 
becomes
```
Colvin,Judge,John O. Colvin,judge.colvin@example.com,legacyJudge,legacyJudgesChambers,true,(123) 123-1234
```
2. Check for and fix any smoke tests that rely upon the Judge being offboarded or their chambers. This process leaves the Judge user active in environments relying on 'local' data (e.g. developer machines, CI pipeline), so other tests relying only on 'local' data should not be impacted.
3. Once you deploy to the environment, your changes will take effect.

### To Update the Judge User in Test
1. Using the environment switcher, source `ustc-test`
```
source ./scripts/env/set-env.zsh ustc-test
```
2. Run `offboard-judge.sh`, passing in the user ID
```
./scripts/user/offboard-judge-user.sh {judgeUserId}
```

### To Update the Judge User in Prod
If you have access to prod, run the same script as above, but against production. If you do not have access, hand off to a USTC engineer to do so.

## Additional Resources
- The Judge's id can be retrieved like so:
  ```
  source ./scripts/env/set-env.zsh ustc-test
  npm run admin:lookup-user judge Colvin
  ```

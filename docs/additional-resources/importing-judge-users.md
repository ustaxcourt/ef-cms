# Importing Judge Users

To import judge users into the system in bulk:

```
ENV=[ENV] npx ts-node --transpile-only ./scripts/circleci/judge/bulkImportJudgeUsers.ts
```

Locally:

```
ENV=local ts-node ./scripts/circleci/judge/bulkImportJudgeUsers.ts
```

A CSV file is included in the repo: judge_users.csv. The data fields should be in the same order as the provided CSV file.

Running the script will generate a log file, `bulk-import-log.txt`. Users that were successfully created will receive an email with login instructions. Any errors will be printed to the log file for further evaluation.

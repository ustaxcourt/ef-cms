# Importing Practitioner Users

To import practitioner users into the system in bulk:

```
cd web-api
./bulk-import-practitioner-users.sh [ENV] [csv file name]
```

A sample CSV file is included in the repo: [practitioner_users.csv](../web-api/practitioner_users.csv). The data fields should be in the same order as the provided CSV file.

Running the script will generate a log file, `bulk-import-log.txt`. Users that were successfully created will receive an email with login instructions. Any errors will be printed to the log file for further evaluation.

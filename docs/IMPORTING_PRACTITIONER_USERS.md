# Importing Practitioner Users

To import practitioner users into the system in bulk:

```
cd web-api
./bulk-import-practitioner-users.sh [ENV] [csv file name]
```

A sample CSV file is included in the repo: [practitioner_users.csv](../web-api/practitioner_users.csv). The data fields should be in the same order as the provided CSV file.

Running the script will generate a log file, `bulk-import-log.txt`. Users that were successfully created will receive an email with login instructions. Any errors will be printed to the log file for further evaluation.

Notes:
1. If there is no postalCode available 
    a. For DOMESTIC country types, postalCode should default to '00000' when there is no value supplied
    b. For INTERNATIONAL country types, postalCode should be set to the country name and defaults to 'N/A' when there is no value supplied
2. If there is no value supplied for `birthYear`, it defaults to 1950 (this happens programmatically)
3. If there is no value supplied for `originalBarState`, it defaults to 'N/A' (this happens programmatically)
4. If the `admissionStatus` is not 'Active', the practitioner's role is set to `inactivePractitioner`
5. The `userId` and `section` are programmatically set. `section` is set based on the role, `userId` is auto-generated

Fields that are required:
admissionsDate, admissionsStatus, barNumber, birthYear, employer, firstName, lastName, originalBarState, practitionerType



#!/bin/bash

# Back up the specified dynamo table

# Usage
#   ./backup-dynamo-table.sh $TABLE_NAME

# Arguments
#   - $1 - the table to backup

( ! command -v jq > /dev/null ) && echo "jq must be installed on your machine." && exit 1
[ -z "$1" ] && echo "The table to backup must be provided as the \$1 argument." && exit 1

TABLE_NAME=$1

CURRENT_DATE_TIME_GMT=$(date -u +"%Y-%m-%d-%H:%M")

BACKUP_STATUS=$(aws dynamodb create-backup --table-name "${TABLE_NAME}" --backup-name "${TABLE_NAME}-${CURRENT_DATE_TIME_GMT}" --region us-east-1 | jq -r ".BackupDetails.BackupStatus")

# if [[ $TABLE_STATUS != "DELETING" ]] ; then
#   echo "The table ${TABLE_NAME} failed to delete."
#   exit 1
# fi

echo "The table ${TABLE_NAME} backup status is: ${BACKUP_STATUS}"

#!/bin/bash

table_name="efcms-local"
host="http://localhost:8000"
wait_time=5
max_attempts=60

echo "Waiting for table $table_name to be available at $host"

for ((i=1; i<=max_attempts; i++)); do
    echo "Attempt $i: checking table status"
    table_status=$(AWS_ACCESS_KEY_ID=S3RVER AWS_SECRET_ACCESS_KEY=S3RVER aws dynamodb describe-table --region us-east-1 --table-name $table_name --endpoint-url $host 2>/dev/null | jq -r '.Table.TableStatus')
    if [ "$table_status" = "ACTIVE" ]; then
        echo "Table $table_name is active and available at $host"
        exit 0
    else
        echo "Table $table_name is not yet active. Retrying in $wait_time seconds."
        sleep $wait_time
    fi
done

echo "Table $table_name could not be found or did not become active after $max_attempts attempts."
exit 1
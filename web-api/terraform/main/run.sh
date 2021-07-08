#!/bin/bash

echo "Starting Services"
service clamav-freshclam start
service clamav-daemon start

echo "Services started. Running worker."

AWS_REGION='us-east-1' CLEAN_DOCUMENTS_BUCKET=${documents_bucket_name} ENV=${environment} SQS_QUEUE_URL=${sqs_queue_url} QUARANTINE_BUCKET=${quarantine_bucket} node worker.js

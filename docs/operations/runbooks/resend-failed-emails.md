# Re-Sending Emails That Failed to Deliver

## Description

This runbook is intended to provide a step-by-step guide for re-sending emails that failed to deliver.

## Prerequisites

- AWS console access with permissions to view SES (Simple Email Service), Lambda, SQS (Simple Queue Service), and CloudWatch.
- You are subscribed to the `efcms_<ENV>_<COLOR>: SendEmails-DLQueueCheck` SNS topic to receive notifications about failed email deliveries.

## Steps

1. Receive an alert from the `efcms_<ENV>_<COLOR>: SendEmails-DLQueueCheck` SNS topic.
1. Determine the current color of the environment (e.g., blue or green).
1. Log into the AWS console and navigate to the `send_emails_dl_queue_<ENV>_<COLOR>.fifo` queue to view the messages that failed to send.
1. Next, navigate to the `send_emails_<ENV>_<COLOR>` lambda function to view the logs of the failed delivery attempts.
1. Before retrying, identify the root cause of the failed deliveries and address it. Do not attempt to retry until you are sure a retry will be successful.
1. Once you are sure you want to retry, proceed differently depending on whether the DLQ belongs to the current color or the old color.
    1. If the DLQ belongs to the current color:
        1. Click "Start DLQ Redrive" and then click "DLQ Redrive".
    1. If the DLQ belongs to the old color:
        1. Run the `redrive-old-color-dlq-to-current-color-queue.sh` script to redrive the messages from the old color's DLQ to the current color's queue:
           ```bash
           . scripts/env/set-env.zsh <ENV>
           scripts/email/redrive-old-color-dlq-to-current-color-queue.sh
           ```

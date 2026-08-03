# Troubleshooting Email Delivery Failures

## Description

This runbook is intended to provide a step-by-step guide for troubleshooting email delivery failures. It outlines the necessary steps to identify and resolve common issues that prevent emails from being successfully delivered to recipients.

## Prerequisites

- AWS console access with permissions to view SES (Simple Email Service), Lambda, SQS (Simple Queue Service), and CloudWatch.

## Steps

1. Determine the current color of the environment (e.g., blue or green).
1. Log into the AWS console and navigate to the `send_emails_dl_queue_<ENV>_<COLOR>.fifo` queue.
1. TODO: DETERMINE WHY THEY FAILED AND IF THEY SHOULD BE RETRIED
1. If you determine that the messages should be retried, proceed differently if the DLQ belongs to the current color or the old color.
    1. If the DLQ belongs to the current color:
        1. Click "Start DLQ Redrive" and then click "DLQ Redrive".
    1. If the DLQ belongs to the old color:
        1. Run the `redrive-old-color-dlq-to-current-color-queue.sh` script to redrive the messages from the old color's DLQ to the current color's queue:
           ```bash
           . scripts/env/set-env.zsh <ENV>
           scripts/email/redrive-old-color-dlq-to-current-color-queue.sh
           ```

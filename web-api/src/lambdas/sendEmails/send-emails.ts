import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { createApplicationContext } from '@web-api/applicationContext';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { rescheduleLambda } from '@web-api/dispatchers/sqs/rescheduleLambda';
import { sendWithRetry } from '@web-api/dispatchers/ses/sendBulkTemplatedEmail';

export const handler = async event => {
  const applicationContext = createApplicationContext({});

  if (process.env.READ_ONLY_MODE === 'true') {
    getDawsonLogger().info(
      'Skipping send-emails due to read-only mode. Retrying in 180 seconds.',
    );
    await rescheduleLambda(applicationContext, { event }, 180);
    return;
  }

  try {
    const { Records } = event;
    const { body, receiptHandle } = Records[0];
    const params = JSON.parse(body);

    await sendWithRetry({ applicationContext, params, retryCount: 0 });

    const sqs: SQSClient = await applicationContext.getMessagingClient();
    const cmd = new DeleteMessageCommand({
      QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/send_emails_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}.fifo`,
      ReceiptHandle: receiptHandle,
    });
    await sqs.send(cmd);
  } catch (err) {
    getDawsonLogger().error(err);
    throw err;
  }
};

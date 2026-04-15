import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { createApplicationContext } from '../../applicationContext';
import { sendWithRetry } from '../../dispatchers/ses/sendBulkTemplatedEmail';
import { getDawsonLogger } from 'web-api/src/utilities/logger/getDawsonLogger';

export const handler = async event => {
  if (process.env.READ_ONLY_MODE === 'true') {
    const errorMessage = 'Cannot execute send-emails during read-only mode.';
    getDawsonLogger().error(errorMessage);
    throw new Error(errorMessage);
  }

  const applicationContext = createApplicationContext({});
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

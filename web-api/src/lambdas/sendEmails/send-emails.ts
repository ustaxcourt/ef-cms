import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { createApplicationContext } from '../../applicationContext';
import { sendWithRetry } from '../../dispatchers/ses/sendBulkTemplatedEmail';

export const handler = async event => {
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
    applicationContext.logger.error(err);
    throw err;
  }
};

import { createApplicationContext } from '../../../src/applicationContext';
import { sendWithRetry } from '../../../src/dispatchers/ses/sendBulkTemplatedEmail';

export const handler = async event => {
  const applicationContext = createApplicationContext({});
  try {
    const { Records } = event;
    const { body, receiptHandle } = Records[0];
    const params = JSON.parse(body);

    await sendWithRetry({ applicationContext, params });

    const sqs = await applicationContext.getMessagingClient();
    await sqs
      .deleteMessage({
        QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/send_emails_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}.fifo`,
        ReceiptHandle: receiptHandle,
      })
      .promise();
  } catch (err) {
    applicationContext.logger.error(err);
    throw err;
  }
};

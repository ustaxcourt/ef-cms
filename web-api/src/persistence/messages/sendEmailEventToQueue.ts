import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { ServerApplicationContext } from '@web-api/applicationContext';
import type { SendBulkTemplatedEmailCommandInput } from '@aws-sdk/client-ses';

export const sendEmailEventToQueue = async ({
  applicationContext,
  emailParams,
}: {
  applicationContext: ServerApplicationContext;
  emailParams: SendBulkTemplatedEmailCommandInput;
}): Promise<void> => {
  const concurrencyLimit =
    applicationContext.getConstants().SES_CONCURRENCY_LIMIT;

  const sqs: SQSClient = applicationContext.getMessagingClient();
  const messageGroupId = Math.random() * parseInt(`${concurrencyLimit}`);
  const cmd = new SendMessageCommand({
    MessageBody: JSON.stringify(emailParams),
    MessageGroupId: `${messageGroupId}`,
    QueueUrl: `https://sqs.${process.env.REGION}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/send_emails_queue_${process.env.STAGE}_${process.env.CURRENT_COLOR}.fifo`,
  });

  await sqs.send(cmd);
};

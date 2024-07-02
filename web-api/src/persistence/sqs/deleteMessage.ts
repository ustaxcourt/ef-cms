import { DeleteMessageCommand, SQSClient } from '@aws-sdk/client-sqs';
import { ServerApplicationContext } from '@web-api/applicationContext';

export const deleteMessage = ({
  applicationContext,
  message,
  queueUrl,
}: {
  applicationContext: ServerApplicationContext;
  message: any;
  queueUrl: string;
}) => {
  const sqs: SQSClient = applicationContext.getMessagingClient();
  const cmd = new DeleteMessageCommand({
    QueueUrl: queueUrl,
    ReceiptHandle: message.ReceiptHandle,
  });

  return sqs.send(cmd);
};

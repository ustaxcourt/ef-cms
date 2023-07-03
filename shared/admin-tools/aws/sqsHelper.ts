import { SQSClient, SendMessageBatchCommand } from '@aws-sdk/client-sqs';
import { chunk } from 'lodash';

const sqsClient = new SQSClient({ region: 'us-east-1' });

export const addToQueue = async ({
  messages,
  QueueUrl,
}: {
  messages: object[];
  QueueUrl: string;
}) => {
  let msgId = 0;
  let sent = 0;
  const chunks = chunk(messages, 10);
  for (const c of chunks) {
    const Entries = c.map(message => ({
      Id: `${msgId++}`,
      MessageBody: JSON.stringify(message),
    }));
    const sendMessageBatchCommand = new SendMessageBatchCommand({
      Entries,
      QueueUrl,
    });
    try {
      const { Failed, Successful } = await sqsClient.send(
        sendMessageBatchCommand,
      );
      if (Successful) {
        sent += Successful.length;
      }
      if (Failed) {
        console.error('Failed to send messages to the SQS Queue', Failed);
      }
    } catch (err) {
      console.error('Unable to send messages to the SQS Queue', err);
    }
  }
  console.log(`Sent ${sent} of ${messages.length} messages to the SQS Queue`);
};

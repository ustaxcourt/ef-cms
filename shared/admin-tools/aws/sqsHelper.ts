import {
  BatchResultErrorEntry,
  GetQueueAttributesCommand,
  SQSClient,
  SendMessageBatchCommand,
  SendMessageBatchCommandOutput,
} from '@aws-sdk/client-sqs';
import { chunk } from 'lodash';

const sqsClient = new SQSClient({ region: 'us-east-1' });

export const addToQueue = async ({
  messages,
  QueueUrl,
}: {
  messages: {}[];
  QueueUrl: string;
}): Promise<{ failed: BatchResultErrorEntry[]; sent: number }> => {
  const commands: SendMessageBatchCommand[] = [];
  let msgId = 0;
  const chunks = chunk(messages, 10);
  for (const c of chunks) {
    const Entries = c.map(message => ({
      Id: `${msgId++}`,
      MessageBody: JSON.stringify(message),
    }));
    commands.push(
      new SendMessageBatchCommand({
        Entries,
        QueueUrl,
      }),
    );
  }

  let sent = 0;
  let failed: BatchResultErrorEntry[] = [];
  let results: SendMessageBatchCommandOutput[];
  try {
    results = await Promise.all(
      commands.map(command => sqsClient.send(command)),
    );
  } catch (err) {
    console.error('Unable to send messages to the SQS Queue', err);
    return { failed, sent };
  }

  for (const result of results) {
    const { Failed, Successful } = result;
    if (Successful) {
      sent += Successful.length;
    }
    if (Failed && Failed.length) {
      failed = [...failed, ...Failed];
      console.error('Failed to send messages to the SQS Queue', Failed);
    }
  }

  console.log(`Sent ${sent} of ${messages.length} messages to the SQS Queue`);
  return { failed, sent };
};

export const countItemsInQueue = async ({
  QueueUrl,
}: {
  QueueUrl: string;
}): Promise<number> => {
  const getQueueAttributesCommand = new GetQueueAttributesCommand({
    AttributeNames: [
      'ApproximateNumberOfMessages',
      'ApproximateNumberOfMessagesNotVisible',
      'ApproximateNumberOfMessagesDelayed',
    ],
    QueueUrl,
  });
  let queueCount = 0;
  try {
    const { Attributes } = await sqsClient.send(getQueueAttributesCommand);
    if (Attributes) {
      if (
        'ApproximateNumberOfMessages' in Attributes &&
        typeof Attributes.ApproximateNumberOfMessages !== 'undefined'
      ) {
        queueCount += Number(Attributes.ApproximateNumberOfMessages);
      }
      if (
        'ApproximateNumberOfMessagesNotVisible' in Attributes &&
        typeof Attributes.ApproximateNumberOfMessagesNotVisible !== 'undefined'
      ) {
        queueCount += Number(Attributes.ApproximateNumberOfMessagesNotVisible);
      }
      if (
        'ApproximateNumberOfMessagesDelayed' in Attributes &&
        typeof Attributes.ApproximateNumberOfMessagesDelayed !== 'undefined'
      ) {
        queueCount += Number(Attributes.ApproximateNumberOfMessagesDelayed);
      }
    }
  } catch (error) {
    console.log(error);
    queueCount = -1;
  }
  return queueCount;
};

/**
 * HOW TO RUN
 *
 * TABLE_NAME=testing npx ts-node --transpileOnly scripts/run-once-scripts/create-messages.ts
 */

import {
  BatchWriteCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { requireEnvVars } from '../../shared/admin-tools/util';
import { v4 as uuidv4 } from 'uuid';
import { type MessageTable } from '../../web-api/src/database-types';

requireEnvVars(['TABLE_NAME']);

const tableNameInput = process.env.TABLE_NAME!;

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsInserted = 0;

function generateRandomNumber(min: number = 101, max: number = 10000): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a list of example messages
function generateMessages(count: number): MessageTable[] {
  const messages: MessageTable[] = [];

  for (let i = 0; i < count; i++) {
    const docketNumber = generateRandomNumber();
    const message: any = {
      attachments: [{ documentId: `doc-${uuidv4()}` }],
      createdAt: new Date().toISOString(),
      pk: `case|${docketNumber}-24`,
      sk: `message|${uuidv4()}`,
      docketNumber: `docket-${uuidv4()}`,
      from: `from-user-${uuidv4()}`,
      fromSection: 'Section A',
      fromUserId: `user-${uuidv4()}`,
      isCompleted: false,
      isRead: false,
      isRepliedTo: false,
      message: `This is a test message number ${i}`,
      messageId: uuidv4(),
      parentMessageId: uuidv4(),
      subject: `Test Subject ${i}`,
      to: `to-user-${uuidv4()}`,
      toSection: 'Section B',
      toUserId: `user-${uuidv4()}`,
    };

    messages.push(message);
  }

  return messages;
}

async function main() {
  const messages = generateMessages(500_000); // Generate 100 messages
  await batchInsertMessages(messages, dynamoDbDocClient);

  console.log(`Total messages inserted: ${totalItemsInserted}`);
}

async function batchInsertMessages(
  messages: MessageTable[],
  client: DynamoDBDocumentClient,
) {
  const BATCH_SIZE = 25;

  for (let i = 0; i < messages.length; i += BATCH_SIZE) {
    console.log(`inserting message ${i + 1}`);
    const batch = messages.slice(i, i + BATCH_SIZE);

    const batchWriteParams = {
      RequestItems: {
        [tableNameInput]: batch.map(message => ({
          PutRequest: {
            Item: message,
          },
        })),
      },
    };

    try {
      let unprocessedItems = batch;
      let retryCount = 0;
      const MAX_RETRIES = 5;
      const RETRY_DELAY_MS = 5000;

      // Retry logic for unprocessed items
      while (unprocessedItems.length > 0 && retryCount < MAX_RETRIES) {
        const response = await client.send(
          new BatchWriteCommand(batchWriteParams),
        );

        totalItemsInserted +=
          unprocessedItems.length -
          (response.UnprocessedItems?.[tableNameInput]?.length || 0);

        unprocessedItems = response.UnprocessedItems?.[tableNameInput] ?? [];

        if (unprocessedItems.length > 0) {
          console.log(
            `Retrying unprocessed items: ${unprocessedItems.length}, attempt ${retryCount + 1}`,
          );
          batchWriteParams.RequestItems[tableNameInput] = unprocessedItems.map(
            item => ({
              PutRequest: { Item: item.PutRequest!.Item },
            }),
          );
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }

      if (unprocessedItems.length > 0) {
        console.error(
          `Failed to insert ${unprocessedItems.length} items after ${MAX_RETRIES} retries.`,
        );
      }
    } catch (error) {
      console.error('Error in batch insert:', error);
    }
  }
}

main().catch(console.error);

import { BatchWriteCommand, DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import {
  DeleteRequest,
  DynamoDBClient,
  PutRequest,
} from '@aws-sdk/client-dynamodb';
import { chunk } from 'lodash';
import { createApplicationContext } from '@web-api/applicationContext';
import { createLogger } from '@web-api/createLogger';
import { migrateRecords as migrations } from './migration-segments';
import type { DynamoDBStreamEvent, Handler } from 'aws-lambda';

type migrationsCallback = {
  (
    applicationContext: IApplicationContext,
    {
      items,
      ranMigrations,
    }: {
      items: Record<string, any>[];
      ranMigrations?: { [key: string]: boolean };
    },
  ): Promise<any>;
};

const dynamodb = new DynamoDBClient({
  maxAttempts: 10,
  region: 'us-east-1',
});

const docClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

export const processItems = async (
  applicationContext: IApplicationContext,
  {
    items,
    migrateRecords,
  }: {
    items: Record<string, any>[];
    migrateRecords: migrationsCallback;
  },
): Promise<{ PutRequest: PutRequest }[]> => {
  items = await migrateRecords(applicationContext, { items });

  return items.map(Item => ({
    PutRequest: {
      Item,
    },
  }));
};

export const getFilteredGlobalEvents = (
  event: DynamoDBStreamEvent,
): Record<string, any>[] | undefined => {
  const { Records } = event;
  return Records.filter(
    item => item.eventName !== 'REMOVE' && !!item.dynamodb?.NewImage,
  ).map(item => item.dynamodb!.NewImage!);
};

const generateDeleteRequests = (
  event: DynamoDBStreamEvent,
): { DeleteRequest: DeleteRequest }[] => {
  const { Records } = event;
  if (!Records) {
    return [];
  }
  const removedItems = Records.filter(
    item => item.eventName === 'REMOVE' && !!item.dynamodb?.OldImage,
  ).map(item => item.dynamodb!.OldImage!);
  return removedItems.map(item => ({
    DeleteRequest: {
      Key: { pk: item.pk.S, sk: item.sk.S } as Record<string, any>,
    },
  }));
};

export const handler: Handler = async (event, context) => {
  const applicationContext = createApplicationContext(
    {},
    createLogger({
      defaultMeta: {
        environment: {
          stage: process.env.STAGE || 'local',
        },
        requestId: {
          lambda: context.awsRequestId,
        },
      },
    }),
  );

  let requests: { DeleteRequest?: DeleteRequest; PutRequest?: PutRequest }[] =
    [];

  const items = getFilteredGlobalEvents(event);
  if (items) {
    requests = await processItems(applicationContext, {
      items,
      migrateRecords: migrations,
    });
  }

  requests = [...requests, ...generateDeleteRequests(event)];

  const requestChunks = chunk(requests, 25);
  const commands: BatchWriteCommand[] = [];
  for (const requestChunk of requestChunks) {
    commands.push(
      new BatchWriteCommand({
        RequestItems: {
          [process.env.DESTINATION_TABLE!]: requestChunk,
        },
      }),
    );
  }

  await Promise.all(commands.map(command => docClient.send(command)));
};

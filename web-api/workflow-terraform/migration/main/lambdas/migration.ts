import {
  DeleteCommand,
  DynamoDBDocument,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DeleteRequest, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { createApplicationContext } from '@web-api/applicationContext';
import { createLogger } from '@web-api/createLogger';
import { migrateRecords as migrations } from './migration-segments';
import { unmarshall } from '@aws-sdk/util-dynamodb';
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
): Promise<void> => {
  const unmarshalledItems = items.map(item => unmarshall(item));

  items = await migrateRecords(applicationContext, {
    items: unmarshalledItems,
  });

  for (const item of items) {
    const putCommand = new PutCommand({
      Item: item,
      TableName: process.env.DESTINATION_TABLE,
    });

    await docClient.send(putCommand);
  }
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

  const items = getFilteredGlobalEvents(event);

  if (items) {
    await processItems(applicationContext, {
      items,
      migrateRecords: migrations,
    });
  }

  const deleteRequests = generateDeleteRequests(event);

  for (const deleteRequest of deleteRequests) {
    const deleteCommand = new DeleteCommand({
      Key: deleteRequest.DeleteRequest.Key,
      TableName: process.env.DESTINATION_TABLE!,
    });
    await docClient.send(deleteCommand);
  }
};

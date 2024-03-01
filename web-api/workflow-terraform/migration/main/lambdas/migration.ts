import { AttributeValue, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { createApplicationContext } from '@web-api/applicationContext';
import { createLogger } from '@web-api/createLogger';
import { migrateRecords as migrations } from './migration-segments';
import { unmarshall } from '@aws-sdk/util-dynamodb';

type dynamoRecord = {
  [key: string]: AttributeValue;
};

type migrationsCallback = {
  (
    applicationContext: IApplicationContext,
    {
      documentClient,
      items,
      ranMigrations,
    }: {
      documentClient: DynamoDBDocument;
      items: dynamoRecord[];
      ranMigrations?: {};
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
    documentClient,
    items,
    migrateRecords,
  }: {
    documentClient: DynamoDBDocument;
    items: dynamoRecord[];
    migrateRecords: migrationsCallback;
  },
): Promise<void> => {
  const promises: Promise<PutCommandOutput>[] = [];

  items = await migrateRecords(applicationContext, { documentClient, items });

  for (const item of items) {
    promises.push(
      documentClient.put({
        Item: item,
        TableName: process.env.DESTINATION_TABLE,
      }),
    );
  }
  await Promise.all(promises);
};

export const getFilteredGlobalEvents = (
  event: DynamoDBStreamEvent,
): dynamoRecord[] | undefined => {
  const { Records } = event;
  return Records.filter(
    item => item.eventName !== 'REMOVE' && !!item.dynamodb?.NewImage,
  ).map(item => item.dynamodb!.NewImage!);
};

const getRemoveEvents = event => {
  const { Records } = event;
  return Records.filter(item => item.eventName === 'REMOVE').map(item =>
    unmarshall(item.dynamodb.OldImage),
  );
};

export const handler = async (event, context) => {
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
  await processItems(applicationContext, {
    documentClient: docClient,
    items,
    migrateRecords: migrations,
  });

  const removeEvents = getRemoveEvents(event);
  await Promise.all(
    removeEvents.map(item =>
      docClient.delete({
        Key: {
          pk: item.pk,
          sk: item.sk,
        },
        TableName: process.env.DESTINATION_TABLE,
      }),
    ),
  );
};

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { createApplicationContext } from '@web-api/applicationContext';
import { createLogger } from '@web-api/createLogger';
import { migrateRecords as migrations } from './migration-segments';
import type { AttributeValue, DynamoDBStreamEvent, Handler } from 'aws-lambda';

export type EfcmsEntity = {
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
      items: EfcmsEntity[];
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
    items: EfcmsEntity[];
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
): EfcmsEntity[] | undefined => {
  const { Records } = event;
  return Records.filter(
    item => item.eventName !== 'REMOVE' && !!item.dynamodb?.NewImage,
  ).map(item => item.dynamodb!.NewImage!);
};

const getRemoveEvents = (
  event: DynamoDBStreamEvent,
): EfcmsEntity[] | undefined => {
  const { Records } = event;
  return Records.filter(
    item => item.eventName === 'REMOVE' && !!item.dynamodb?.OldImage,
  ).map(item => item.dynamodb!.OldImage!);
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
      documentClient: docClient,
      items,
      migrateRecords: migrations,
    });
  }

  const removeEvents = getRemoveEvents(event);
  if (removeEvents) {
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
  }
};

import {
  DeleteCommand,
  DynamoDBDocument,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
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

export const processItems = async (
  applicationContext: IApplicationContext,
  {
    docClient,
    items,
    migrateRecords,
  }: {
    docClient: DynamoDBDocument;
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

export const handler: Handler = async (event: DynamoDBStreamEvent, context) => {
  const dynamodb = new DynamoDBClient({
    maxAttempts: 10,
    region: 'us-east-1',
  });

  const docClient = DynamoDBDocument.from(dynamodb, {
    marshallOptions: { removeUndefinedValues: true },
  });

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

  const { Records } = event;

  // processItems (appContext, {docClient, Records})

  // processItems (appContext, {docClient, Records}) {

  for (const item of Records) {
    if (item.dynamodb?.OldImage && item.eventName === 'REMOVE') {
      const deleteCommand = new DeleteCommand({
        Key: {
          pk: item.dynamodb.OldImage.pk.S,
          sk: item.dynamodb.OldImage.sk.S,
        },
        TableName: process.env.DESTINATION_TABLE!,
      });
      await docClient.send(deleteCommand);
    } else if (item.dynamodb?.NewImage) {
      // REMOVE events only have OldImage, not NewImage;
      // we need to migrate this item
      await processItems(applicationContext, {
        docClient,
        items: [item.dynamodb.NewImage],
        migrateRecords: migrations,
      });
    }
  }

  // }
};

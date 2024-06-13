import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, PutCommandOutput } from '@aws-sdk/lib-dynamodb';
import { chunk } from 'lodash';
import { createApplicationContext } from '@web-api/applicationContext';
import {
  createISODateString,
  dateStringsCompared,
} from '@shared/business/utilities/DateHandler';
import { createLogger } from '@web-api/createLogger';
import { migrationsToRun } from './migrationsToRun';
import { migrateItems as validationMigration } from './migrations/0000-validate-all-items';
import promiseRetry from 'promise-retry';
import type { Context, Handler, SQSEvent } from 'aws-lambda';

const MAX_DYNAMO_WRITE_SIZE = 25;

const dynamodb = new DynamoDBClient({
  maxAttempts: 10,
  region: 'us-east-1',
});

const dynamoDbDocumentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

const sqs = new SQSClient({ region: 'us-east-1' });

const scanTableSegment = async ({
  applicationContext,
  ranMigrations,
  segment,
  totalSegments,
}: {
  applicationContext: IApplicationContext;
  ranMigrations: { [key: string]: boolean };
  segment: number;
  totalSegments: number;
}): Promise<void> => {
  let hasMoreResults = true;
  let lastKey: Record<string, any> | undefined;
  while (hasMoreResults) {
    hasMoreResults = false;

    await dynamoDbDocumentClient
      .scan({
        ExclusiveStartKey: lastKey,
        ExpressionAttributeValues: { ':prefix': 'stream-event-id' },
        FilterExpression: 'NOT begins_with(pk, :prefix)',
        Segment: segment,
        TableName: process.env.SOURCE_TABLE,
        TotalSegments: totalSegments,
      })
      .then(async results => {
        hasMoreResults = !!results.LastEvaluatedKey;
        lastKey = results.LastEvaluatedKey;
        await processItems(applicationContext, {
          items: results.Items || [],
          ranMigrations,
        });
      });
  }
};

const hasMigrationRan = async key => {
  const { Item } = await dynamoDbDocumentClient.get({
    Key: {
      pk: 'migration',
      sk: `migration|${key}`,
    },
    TableName: process.env.SOURCE_TABLE,
  });
  return { [key]: !!Item };
};

export const migrateRecords = async (
  applicationContext: IApplicationContext,
  {
    items,
    ranMigrations,
  }: {
    items: Record<string, any>[];
    ranMigrations?: { [key: string]: boolean } | undefined;
  },
) => {
  for (let { key, script } of migrationsToRun) {
    if (!ranMigrations || !ranMigrations[key]) {
      applicationContext.logger.debug(`about to run migration ${key}`);
      items = await script(items, applicationContext);
    }
  }

  applicationContext.logger.debug('about to run validation migration');
  items = validationMigration(items, applicationContext);

  return items;
};

export const processItems = async (
  applicationContext: IApplicationContext,
  {
    items,
    ranMigrations,
  }: {
    items: Record<string, any>[];
    ranMigrations: { [key: string]: boolean } | undefined;
  },
) => {
  try {
    items = await migrateRecords(applicationContext, {
      items,
      ranMigrations,
    });
  } catch (err) {
    applicationContext.logger.error('Error migrating records', err);
    throw err;
  }
  const chunks = chunk(items, MAX_DYNAMO_WRITE_SIZE);
  for (let aChunk of chunks) {
    const promises: Promise<string | PutCommandOutput>[] = [];
    for (let item of aChunk) {
      promises.push(
        promiseRetry(retry => {
          return dynamoDbDocumentClient
            .put({
              ConditionExpression: 'attribute_not_exists(pk)',
              Item: item,
              TableName: process.env.DESTINATION_TABLE,
            })
            .catch(e => {
              if (e.message.includes('The conditional request failed')) {
                applicationContext.logger.info(
                  `The item of ${item.pk} ${item.sk} already existed in the destination table, probably due to a live migration.  Skipping migration for this item.`,
                );
                return 'already-migrated';
              } else {
                throw e;
              }
            })
            .catch(retry);
        }),
      );
    }
    await Promise.all(promises);
  }
};

export const handler: Handler = async (event: SQSEvent, context: Context) => {
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
  const { body, receiptHandle } = Records[0];
  const { segment, totalSegments } = JSON.parse(body);

  const start = createISODateString();

  applicationContext.logger.info('about to process segment', {
    segment,
    totalSegments,
  });
  const ranMigrations = {};
  for (let { key } of migrationsToRun) {
    Object.assign(ranMigrations, await hasMigrationRan(key));
  }

  await scanTableSegment({
    applicationContext,
    ranMigrations,
    segment,
    totalSegments,
  });
  const finish = createISODateString();
  const duration = dateStringsCompared(finish, start, { exact: true });
  applicationContext.logger.info('finishing segment', {
    duration,
    segment,
    totalSegments,
  });

  const input: DeleteMessageCommandInput = {
    QueueUrl: process.env.SEGMENTS_QUEUE_URL,
    ReceiptHandle: receiptHandle,
  };
  const command = new DeleteMessageCommand(input);
  await sqs.send(command);
};

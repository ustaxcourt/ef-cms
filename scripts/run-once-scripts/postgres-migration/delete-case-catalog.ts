#!/usr/bin/env -S npx ts-node --transpile-only

import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  parseArgsAndEnvVars,
  type ScriptConfig,
} from '../../helpers/parseArgsAndEnvVars';
import { batchDeleteDynamoItems } from './batch-delete-dynamo-items';
import { environment } from '@web-api/environment';

const scriptConfig: ScriptConfig = {
  description:
    'delete-case-catalog - Delete from dynamodb eligible-for-trial-case-catalog records ' +
    'that are now obsolete',
  environment: {
    env: 'ENV',
    sourceTable: 'SOURCE_TABLE',
  },
  requireActiveAwsSession: true,
};
parseArgsAndEnvVars(scriptConfig);

const dynamoDbClient = new DynamoDBClient({ region: 'us-east-1' });
const dynamoDbDocClient = DynamoDBDocumentClient.from(dynamoDbClient);

let totalItemsDeleted = 0;

async function main() {
  let lastEvaluatedKey: Record<string, any> | undefined = undefined;

  do {
    const queryParams = {
      TableName: environment.dynamoDbTableName,
      KeyConditionExpression: 'pk = :pk',
      ExpressionAttributeValues: {
        ':pk': 'eligible-for-trial-case-catalog',
      },
      ProjectionExpression: 'pk, sk',
      ExclusiveStartKey: lastEvaluatedKey,
    };

    const result = await dynamoDbDocClient.send(new QueryCommand(queryParams));

    const items = result.Items ?? [];

    const itemsToDelete = items.map(item => ({
      DeleteRequest: {
        Key: {
          pk: item.pk,
          sk: item.sk,
        },
      },
    }));

    const itemsDeletedCount = await batchDeleteDynamoItems(
      itemsToDelete,
      dynamoDbDocClient,
      environment.dynamoDbTableName,
    );
    totalItemsDeleted += itemsDeletedCount;

    console.log(`Items deleted so far: ${totalItemsDeleted}`);

    lastEvaluatedKey = result.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  console.log(`Total catalog items deleted: ${totalItemsDeleted}`);
}

main().catch(console.error);

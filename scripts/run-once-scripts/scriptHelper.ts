import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  BatchWriteCommandOutput,
  DynamoDBDocument,
} from '@aws-sdk/lib-dynamodb';
import { filterEmptyStrings } from '@shared/business/utilities/filterEmptyStrings';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  PutRequest,
  TDynamoRecord,
} from '@web-api/persistence/dynamo/dynamoTypes';
import { chunk, isEmpty } from 'lodash';

const dynamodb = new DynamoDBClient({ maxAttempts: 0, region: 'us-east-1' });
const documentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

export async function updateRecords(
  applicationContext: ServerApplicationContext,
  migratedRecords: TDynamoRecord[],
): Promise<void> {
  const putRequests: PutRequest[] = migratedRecords.map(workItemRecord => {
    return {
      PutRequest: { Item: workItemRecord },
    };
  });
  await batchWrite(applicationContext, putRequests);
}

export async function batchWrite(
  applicationContext: ServerApplicationContext,
  commands: PutRequest[],
): Promise<void> {
  commands.forEach(command => filterEmptyStrings(command));

  const chunks = chunk(commands, 25);
  const parallelRequests = 10;

  for (let i = 0; i < chunks.length; i += parallelRequests) {
    await Promise.all(
      chunks
        .slice(i, i + parallelRequests)
        .map(commandChunk => writeChunk(applicationContext, commandChunk, 0)),
    );
  }

  return;
}

async function writeChunk(
  applicationContext: ServerApplicationContext,
  commandChunk: PutRequest[],
  attempt: number,
) {
  let result: BatchWriteCommandOutput;
  try {
    result = await documentClient.batchWrite({
      RequestItems: {
        [applicationContext.environment.dynamoDbTableName]: commandChunk,
      },
    });
  } catch (err) {
    const wholeError = JSON.stringify(err);
    console.log('An error occurred: ', wholeError);
    if (wholeError.includes('ThrottlingException')) {
      console.log('All requests in the chunk failed.', err);

      await new Promise(resolve => setTimeout(resolve, 2000 * 2 ** attempt));

      return writeChunk(applicationContext, commandChunk, attempt + 1);
    }
    console.log('Unhandled Exception occurred!');
  }

  if (isEmpty(result?.UnprocessedItems)) {
    console.log('Successfully processed Chunk');
    return;
  } else {
    console.log(
      'Unprocessed items: ',
      result.UnprocessedItems[applicationContext.environment.dynamoDbTableName]
        .length,
      'Attempt #',
      attempt,
    );

    await new Promise(resolve => setTimeout(resolve, 2000 * 2 ** attempt));

    return writeChunk(
      applicationContext,
      result.UnprocessedItems[applicationContext.environment.dynamoDbTableName],
      attempt + 1,
    );
  }
}

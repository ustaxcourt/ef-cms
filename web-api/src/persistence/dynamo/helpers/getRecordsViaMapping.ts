import { TDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import { batchGet, queryFull } from '../../dynamodbClientService';

export const getRecordsViaMapping = async <T = Record<string, any>>({
  applicationContext,
  pk,
  prefix,
}: {
  applicationContext: IApplicationContext;
  pk: string;
  prefix: string;
}): Promise<TDynamoRecord<T>[]> => {
  const mappings = await queryFull<T>({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': pk,
      ':prefix': prefix,
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const ids = mappings.map(metadata => metadata.sk);

  const batchGetResults = await batchGet({
    applicationContext,
    keys: ids.map(id => ({
      pk: id,
      sk: id,
    })),
  });

  const results: TDynamoRecord<T>[] = [];
  mappings.forEach(mapping => {
    const entry = batchGetResults.find(
      batchGetEntry => mapping.sk === batchGetEntry.pk,
    );
    if (entry) {
      results.push({
        ...mapping,
        ...entry,
      });
    }
  });

  return results;
};

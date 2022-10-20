import { batchGet, query } from '../../dynamodbClientService';

export const getRecordsViaMapping = async ({
  applicationContext,
  pk,
  prefix,
}: {
  applicationContext: IApplicationContext;
  pk: string;
  prefix: string;
}) => {
  const mappings = await query({
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

  const results = [];
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

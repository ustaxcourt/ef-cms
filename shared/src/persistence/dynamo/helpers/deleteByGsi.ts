import { batchDelete, query } from '../../dynamodbClientService';

/**
 * deleteByGsi
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.gsi the gsi to search and delete
 * @returns {Promise} the promise of the call to persistence
 */
export const deleteByGsi = async ({
  applicationContext,
  gsi,
}: {
  applicationContext: IApplicationContext;
  gsi: string;
}) => {
  const items = await query({
    ExpressionAttributeNames: {
      '#gsi1pk': 'gsi1pk',
    },
    ExpressionAttributeValues: {
      ':gsi1pk': gsi,
    },
    IndexName: 'gsi1',
    KeyConditionExpression: '#gsi1pk = :gsi1pk',
    applicationContext,
  });

  await batchDelete({
    applicationContext,
    items,
  });
};

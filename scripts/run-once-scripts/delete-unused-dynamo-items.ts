/**
 * This node script can be run to remove a bunch of old dynamodb records
 * which are no longer needed but are blocking our alpha -> beta migrations.
 */
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { chunk, isEmpty } from 'lodash';

const args = process.argv.slice(2);
const CHUNK_SIZE = 25;

if (args.length < 1) {
  console.error(
    'must provide a dynamodb table name: [efcms-dev-beta, efcms-dev-alpha, etc]',
  );
  process.exit(1);
}

const TableName = args[0];

const dynamodb = new DynamoDBClient({
  maxAttempts: 10,
  region: 'us-east-1',
});
const documentClient = DynamoDBDocument.from(dynamodb, {
  marshallOptions: { removeUndefinedValues: true },
});

const queryForItems = async pk => {
  let hasMoreResults = true;
  let lastKey = null;
  let allResults = [];
  while (hasMoreResults) {
    hasMoreResults = false;

    const subsetResults = await documentClient.query({
      ExclusiveStartKey: lastKey,
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': pk,
      },
      KeyConditionExpression: '#pk = :pk',
      TableName,
    });

    hasMoreResults = !!subsetResults.LastEvaluatedKey;
    lastKey = subsetResults.LastEvaluatedKey;

    allResults = [
      ...allResults,
      ...subsetResults.Items.map(item => ({ pk: item.pk, sk: item.sk })),
    ];
  }
  return allResults;
};

const reprocessItems = async ({ unprocessedItems }) => {
  const results = await documentClient.batchWrite({
    RequestItems: unprocessedItems,
  });

  if (!isEmpty(results.UnprocessedItems)) {
    await reprocessItems({
      items: results.UnprocessedItems,
    });
  }
};

const deleteItems = async items => {
  const chunks = chunk(items, CHUNK_SIZE);
  for (let c of chunks) {
    const results = await documentClient.batchWrite({
      RequestItems: {
        [TableName]: c.map(item => ({
          DeleteRequest: {
            Key: {
              pk: item.pk,
              sk: item.sk,
            },
          },
        })),
      },
    });

    if (!isEmpty(results.UnprocessedItems)) {
      await reprocessItems({
        documentClient,
        items: results.UnprocessedItems,
      });
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async function () {
  const catalogItems = await queryForItems('catalog');
  await deleteItems(catalogItems);

  const privatePractitionerItems = await queryForItems(
    'section|privatePractitioner',
  );
  await deleteItems(privatePractitionerItems);

  const irsPractitionerItems = await queryForItems('section|irsPractitioner');
  await deleteItems(irsPractitionerItems);

  const inactivePractitionerItems = await queryForItems(
    'section|inactivePractitioner',
  );
  await deleteItems(inactivePractitionerItems);

  const petitionerItems = await queryForItems('section|petitioner');
  await deleteItems(petitionerItems);

  console.log(catalogItems.length);
  console.log(privatePractitionerItems.length);
  console.log(irsPractitionerItems.length);
  console.log(inactivePractitionerItems.length);
  console.log(petitionerItems.length);
})();

const client = require('../../dynamodbClientService');

/**
 * deleteCaseByDocketNumber
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.docketNumber the docket number of the case being deleted
 * @returns {object} the case data
 */
exports.deleteCaseByDocketNumber = async ({
  applicationContext,
  docketNumber,
}) => {
  const requests = [];

  const recordsToDelete = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  recordsToDelete.map(async ({ sk }) => {
    requests.push(
      client.delete({
        applicationContext,
        key: {
          pk: `case|${docketNumber}`,
          sk,
        },
      }),
    );

    // ====== WORK ITEMS ====== //
    if (sk.includes('work-item|')) {
      const [, workItemId] = sk.split('|');

      const mappingsForWorkItem = await client.query({
        ExpressionAttributeNames: {
          '#gsi1pk': 'gsi1pk',
        },
        ExpressionAttributeValues: {
          ':gsi1pk': `work-item|${workItemId}`,
        },
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1pk = :gsi1pk',
        applicationContext,
      });

      mappingsForWorkItem.map(workItem => {
        requests.push(
          client.delete({
            applicationContext,
            key: {
              pk: workItem.pk,
              sk: workItem.sk,
            },
          }),
        );
      });
    }

    // ====== DEADLINES ====== //
    if (sk.includes('case-deadline|')) {
      requests.push(
        client.delete({
          applicationContext,
          key: {
            pk: sk,
            sk,
          },
        }),
      );
    }
  });

  const [results] = await Promise.all(requests);

  return results;
};

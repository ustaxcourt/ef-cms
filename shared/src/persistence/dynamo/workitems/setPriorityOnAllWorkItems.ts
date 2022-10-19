const client = require('../../dynamodbClientService');

/**
 * setPriorityOnAllWorkItems
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber docket number to update work items for
 * @param {boolean} providers.highPriority true if the work items should be set high priority, false otherwise
 * @param {string} providers.trialDate the date of the trial or undefined
 * @returns {Promise} the promise of the persistence calls
 */
exports.setPriorityOnAllWorkItems = async ({
  applicationContext,
  docketNumber,
  highPriority,
  trialDate,
}) => {
  const workItemMappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `case|${docketNumber}`,
      ':prefix': 'work-item',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });

  const requests = [];
  for (let mapping of workItemMappings) {
    const workItems = await client.query({
      ExpressionAttributeNames: {
        '#gsi1pk': 'gsi1pk',
      },
      ExpressionAttributeValues: {
        ':gsi1pk': mapping.sk,
      },
      IndexName: 'gsi1',
      KeyConditionExpression: '#gsi1pk = :gsi1pk',
      applicationContext,
    });

    for (let workItem of workItems) {
      requests.push(
        client.update({
          ExpressionAttributeNames: {
            '#highPriority': 'highPriority',
            '#trialDate': 'trialDate',
          },
          ExpressionAttributeValues: {
            ':highPriority': highPriority,
            ':trialDate': trialDate || null,
          },
          Key: {
            pk: workItem.pk,
            sk: workItem.sk,
          },
          UpdateExpression:
            'SET #highPriority = :highPriority, #trialDate = :trialDate',
          applicationContext,
        }),
      );
    }
  }

  const [results] = await Promise.all(requests);

  return results;
};

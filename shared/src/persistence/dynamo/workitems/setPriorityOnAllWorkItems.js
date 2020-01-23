const client = require('../../dynamodbClientService');

/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.setPriorityOnAllWorkItems = async ({
  applicationContext,
  caseId,
  highPriority,
  trialDate,
}) => {
  const workItemMappings = await client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `${caseId}|workItem`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });

  const requests = [];
  for (let mapping of workItemMappings) {
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
          pk: mapping.pk,
          sk: mapping.sk,
        },
        UpdateExpression:
          'SET #highPriority = :highPriority, #trialDate = :trialDate',
        applicationContext,
      }),
    );
  }

  const [results] = await Promise.all(requests);

  return results;
};

const client = require('../../dynamodbClientService');
const {
  updateWorkItemCaseStatus,
} = require('../workitems/updateWorkItemCaseStatus');
const {
  updateWorkItemDocketNumberSuffix,
} = require('../workitems/updateWorkItemDocketNumberSuffix');
/**
 * updateCase
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.caseToUpdate the case data to update
 * @returns {Promise} the promise of the persistence calls
 */
exports.updateCase = async ({ applicationContext, caseToUpdate }) => {
  const oldCase = await client.get({
    Key: {
      pk: caseToUpdate.caseId,
      sk: caseToUpdate.caseId,
    },
    applicationContext,
  });

  const requests = [];
  if (
    oldCase.status !== caseToUpdate.status ||
    oldCase.docketNumberSuffix !== caseToUpdate.docketNumberSuffix
  ) {
    const workItemMappings = await client.query({
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':pk': `${caseToUpdate.caseId}|workItem`,
      },
      KeyConditionExpression: '#pk = :pk',
      applicationContext,
    });
    for (let mapping of workItemMappings) {
      requests.push(
        updateWorkItemCaseStatus({
          applicationContext,
          caseStatus: caseToUpdate.status,
          workItemId: mapping.sk,
        }),
      );
      requests.push(
        updateWorkItemDocketNumberSuffix({
          applicationContext,
          docketNumberSuffix: caseToUpdate.docketNumberSuffix,
          workItemId: mapping.sk,
        }),
      );
    }
  }

  let setLeadCase = caseToUpdate.leadCaseId
    ? { gsi1pk: caseToUpdate.leadCaseId }
    : {};

  const [results] = await Promise.all([
    client.put({
      Item: {
        pk: caseToUpdate.caseId,
        sk: caseToUpdate.caseId,
        ...setLeadCase,
        ...caseToUpdate,
      },
      applicationContext,
    }),
    ...requests,
  ]);

  return results;
};

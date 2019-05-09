const client = require('../../dynamodbClientService');
const { saveVersionedCase } = require('./saveCase');

/**
 * createWorkItem
 *
 * @param workItemId
 * @param message
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateCase = async ({ caseToUpdate, applicationContext }) => {
  const oldCase = await client.get({
    Key: {
      pk: caseToUpdate.caseId,
      sk: '0',
    },
    applicationContext,
  });

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
      await client.update({
        ExpressionAttributeNames: {
          '#caseStatus': 'caseStatus',
          '#docketNumberSuffix': 'docketNumberSuffix',
        },
        ExpressionAttributeValues: {
          ':caseStatus': caseToUpdate.status,
          ':docketNumberSuffix': caseToUpdate.docketNumberSuffix,
        },
        Key: {
          pk: mapping.sk,
          sk: mapping.sk,
        },
        UpdateExpression: `SET #caseStatus = :caseStatus, #docketNumberSuffix = :docketNumberSuffix`,
        applicationContext,
      });
    }
  }

  return await saveVersionedCase({
    applicationContext,
    caseToSave: caseToUpdate,
    existingVersion: (caseToUpdate || {}).currentVersion,
  });
};

const {
  stripWorkItems,
  stripInternalKeys,
} = require('../../awsDynamoPersistence');

const client = require('../../dynamodbClientService');
/**
 * getCaseByCaseId
 * @param caseId
 * @param applicationContext
 * @returns {*}
 */
exports.getCaseByCaseId = async ({ caseId, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const results = await client.get({
    TableName: TABLE,
    Key: {
      pk: caseId,
      sk: caseId,
    },
  });
  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};

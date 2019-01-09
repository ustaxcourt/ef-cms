const {
  stripWorkItems,
  stripInternalKeys,
} = require('../../awsDynamoPersistence');

const client = require('../../dynamodbClientService');

/**
 * createCase
 * @param caseRecord
 * @param applicationContext
 * @returns {*}
 */
exports.createCase = async ({ caseRecord, applicationContext }) => {
  await client.batchWrite({
    applicationContext,
    tableName: `efcms-${applicationContext.environment.stage}`,
    items: [
      {
        pk: caseRecord.caseId,
        sk: caseRecord.caseId,
        ...caseRecord,
      },
      {
        pk: `${caseRecord.docketNumber}|case`,
        sk: caseRecord.caseId,
      },
      {
        pk: 'new|case-status',
        sk: caseRecord.caseId,
      },
      {
        pk: `${caseRecord.userId}|case`,
        sk: caseRecord.caseId,
      },
    ],
  });

  return stripWorkItems(
    stripInternalKeys(caseRecord),
    applicationContext.isAuthorizedForWorkItems(),
  );
};

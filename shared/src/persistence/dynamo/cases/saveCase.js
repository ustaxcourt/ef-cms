const {
  createRespondentCaseMapping,
  stripInternalKeys,
  stripWorkItems,
} = require('../../awsDynamoPersistence');
const { syncWorkItems } = require('../../dynamo/workitems/syncWorkItems');
const { syncDocuments } = require('../../dynamo/documents/syncDocuments');

const client = require('../../dynamodbClientService');

/**
 * saveCase
 * @param caseToSave
 * @param applicationContext
 * @returns {*}
 */
exports.saveCase = async ({ caseToSave, applicationContext }) => {
  const TABLE = `efcms-${applicationContext.environment.stage}`;
  const currentCaseState = await client.get({
    applicationContext,
    TableName: TABLE,
    Key: {
      pk: caseToSave.caseId,
      sk: caseToSave.caseId,
    },
  });

  const currentStatus = currentCaseState.status;

  if (!currentCaseState.respondent && caseToSave.respondent) {
    await createRespondentCaseMapping({
      applicationContext,
      caseId: caseToSave.caseId,
      respondentId: caseToSave.respondent.respondentId,
    });
  }

  await syncWorkItems({
    applicationContext,
    caseToSave,
    currentCaseState,
  });

  await syncDocuments({
    applicationContext,
    caseToSave,
    currentCaseState,
  });

  // if a stipulated decision was uploaded, create a work item entry
  if (currentStatus !== caseToSave.status) {
    await client.delete({
      tableName: TABLE,
      key: {
        pk: `${currentStatus}|case-status`,
        sk: caseToSave.caseId,
      },
    });

    await client.put({
      TableName: TABLE,
      Item: {
        pk: `${caseToSave.status}|case-status`,
        sk: caseToSave.caseId,
      },
    });
  }

  const results = await client.put({
    TableName: TABLE,
    Item: {
      pk: caseToSave.caseId,
      sk: caseToSave.caseId,
      ...caseToSave,
    },
  });

  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};

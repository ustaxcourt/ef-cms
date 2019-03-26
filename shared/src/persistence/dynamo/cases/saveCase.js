const { stripWorkItems } = require('../../dynamo/helpers/stripWorkItems');
const {
  createMappingRecord,
} = require('../../dynamo/helpers/createMappingRecord');

const { syncWorkItems } = require('../../dynamo/workitems/syncWorkItems');
const { stripInternalKeys } = require('../../dynamo/helpers/stripInternalKeys');

const client = require('../../dynamodbClientService');

exports.saveVersionedCase = async ({
  existingVersion,
  caseToSave,
  applicationContext,
}) => {
  // used for associating a case to the latest version
  const currentVersion = existingVersion;
  const nextVersionToSave = parseInt(currentVersion || '0') + 1;

  // update the current history
  await client.put({
    applicationContext,
    Item: {
      pk: caseToSave.caseId,
      sk: '0',
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
  });

  // add a history entry
  return await client.put({
    applicationContext,
    Item: {
      pk: caseToSave.caseId,
      sk: `${nextVersionToSave}`,
      ...caseToSave,
      currentVersion: `${nextVersionToSave}`,
    },
  });
};
/**
 * saveCase
 * @param caseToSave
 * @param applicationContext
 * @returns {*}
 */
exports.saveCase = async ({ caseToSave, applicationContext }) => {
  const currentCaseState = await client.get({
    applicationContext,
    Key: {
      pk: caseToSave.caseId,
      sk: '0',
    },
  });

  if (!currentCaseState) {
    await createMappingRecord({
      applicationContext,
      pkId: caseToSave.userId,
      skId: caseToSave.caseId,
      type: 'case',
    });

    await createMappingRecord({
      applicationContext,
      pkId: caseToSave.docketNumber,
      skId: caseToSave.caseId,
      type: 'case',
    });
  }

  const currentStatus = (currentCaseState || {}).status;

  if (
    currentCaseState &&
    !currentCaseState.respondent &&
    caseToSave.respondent
  ) {
    await createMappingRecord({
      applicationContext,
      pkId: caseToSave.respondent.respondentId,
      skId: caseToSave.caseId,
      type: 'activeCase',
    });
  }

  await syncWorkItems({
    applicationContext,
    caseToSave,
    currentCaseState,
  });

  if (currentStatus !== caseToSave.status) {
    if (currentStatus) {
      await client.delete({
        applicationContext,
        key: {
          pk: `${currentStatus}|case-status`,
          sk: caseToSave.caseId,
        },
      });
    }

    await client.put({
      applicationContext,
      Item: {
        pk: `${caseToSave.status}|case-status`,
        sk: caseToSave.caseId,
      },
    });
  }

  const results = await exports.saveVersionedCase({
    applicationContext,
    caseToSave,
    existingVersion: (currentCaseState || {}).currentVersion,
  });

  return stripWorkItems(
    stripInternalKeys(results),
    applicationContext.isAuthorizedForWorkItems(),
  );
};

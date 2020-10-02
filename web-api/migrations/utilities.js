const isCaseMessageRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('message|');
const isCaseRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('case|');
const isTrialSessionRecord = item =>
  !!item.caseOrder && !!item.trialSessionId && !!item.maxCases;
const isUserCaseMappingRecord = item =>
  item.pk.startsWith('user|') && item.sk.startsWith('case|');
const isNewUserCaseMappingRecord = item =>
  !!item.gsi1pk && item.gsi1pk.startsWith('user-case|');
const isDocketEntryRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('docket-entry|');
const isDocumentRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('document|');
const isCaseDeadlineRecord = item =>
  item.pk.startsWith('case-deadline|') && item.sk.startsWith('case-deadline|');
const isUserCaseNoteRecord = item =>
  item.pk.startsWith('user-case-note|') && item.sk.startsWith('user|');
const isEligibleForTrialRecord = item =>
  item.pk === 'eligible-for-trial-case-catalog';
const isWorkItemRecord = item =>
  item.pk.startsWith('work-item|') && item.sk.startsWith('work-item|');
const isWorkItemOrWorkQueueRecord = item => item.sk.startsWith('work-item|');
const isCorrespondenceRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('correspondence|');

const getDocketNumberFromRecord = item =>
  item.pk.includes('case|') && item.pk.split('|')[1];

const forAllRecords = async (documentClient, tableName, cb) => {
  let hasMoreResults = true;
  let lastKey = null;
  while (hasMoreResults) {
    hasMoreResults = false;

    const results = await documentClient
      .scan({
        ExclusiveStartKey: lastKey,
        TableName: tableName,
      })
      .promise();

    for (let item of results.Items) {
      await cb(item);
    }

    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
  }
};

const upGenerator = mutateFunction => async (
  documentClient,
  tableName,
  forAllRecords,
) => {
  await forAllRecords(documentClient, tableName, async item => {
    const updatedItem = await mutateFunction(item, documentClient, tableName);
    if (updatedItem) {
      if (!updatedItem.pk && !updatedItem.sk && !updatedItem.gsi1pk) {
        throw new Error('data must contain pk, sk, or gsi1pk');
      }
      await documentClient
        .put({
          Item: updatedItem,
          TableName: tableName,
        })
        .promise();
    }
  });
};

module.exports = {
  forAllRecords,
  getDocketNumberFromRecord,
  isCaseDeadlineRecord,
  isCaseMessageRecord,
  isCaseRecord,
  isCorrespondenceRecord,
  isDocketEntryRecord,
  isDocumentRecord,
  isEligibleForTrialRecord,
  isNewUserCaseMappingRecord,
  isTrialSessionRecord,
  isUserCaseMappingRecord,
  isUserCaseNoteRecord,
  isWorkItemOrWorkQueueRecord,
  isWorkItemRecord,
  upGenerator,
};

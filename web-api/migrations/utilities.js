const isCaseMessageRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('message|');
const isCaseRecord = item => !!item.caseType;
const isTrialSessionRecord = item =>
  !!item.caseOrder && !!item.trialSessionId && !!item.maxCases;
const isUserCaseMappingRecord = item =>
  item.pk.startsWith('user|') && item.sk.startsWith('case|');
const isNewUserCaseMappingRecord = item =>
  !!item.gsi1pk && item.gsi1pk.startsWith('user-case|');
const isDocumentRecord = item =>
  item.pk.startsWith('case|') && item.sk.startsWith('document|');

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
  isCaseMessageRecord,
  isCaseRecord,
  isDocumentRecord,
  isNewUserCaseMappingRecord,
  isTrialSessionRecord,
  isUserCaseMappingRecord,
  upGenerator,
};

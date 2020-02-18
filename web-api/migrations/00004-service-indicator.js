const isCaseRecord = item => !!item.caseType; // only case records have a caseType defined

const {
  SERVICE_INDICATOR_TYPES,
} = require('../../shared/src/business/entities/cases/CaseConstants');

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

const up = async (documentClient, tableName) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;

    item.practitioners.forEach(practitioner => {
      if (!practitioner.serviceIndicator) {
        practitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
      }
    });

    await documentClient
      .put({
        Item: item,
        TableName: tableName,
      })
      .promise();
  });
};

module.exports = {
  forAllRecords,
  up,
};

const { isCaseRecord } = require('./utilities');

const up = async (documentClient, tableName) => {
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
      if (isCaseRecord(item)) {
        if (!item.qcCompleteForTrial) {
          console.log(
            `adding qcCompleteForTrial default value to case with id "${item.caseId}"`,
          );
          item.qcCompleteForTrial = {};

          await documentClient
            .put({
              Item: item,
              TableName: tableName,
            })
            .promise();
        }
      }
    }

    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
  }
};

module.exports = {
  up,
};

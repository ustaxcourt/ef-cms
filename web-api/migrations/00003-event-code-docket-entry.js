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
        for (let docketEntry of item.docketRecord) {
          if (!docketEntry.eventCode) {
            docketEntry.eventCode = 'MGRTED';
          }
          if (!docketEntry.description) {
            docketEntry.description = 'MGRTED';
          }
          if (docketEntry.index === undefined || docketEntry.index === null) {
            docketEntry.index = 100;
          }
        }

        await documentClient
          .put({
            Item: item,
            TableName: tableName,
          })
          .promise();
      }
    }

    hasMoreResults = !!results.LastEvaluatedKey;
    lastKey = results.LastEvaluatedKey;
  }
};

module.exports = {
  up,
};

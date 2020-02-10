const { isCaseRecord } = require('./utilities');

const up = async (documentClient, tableName, forAllRecords) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (!isCaseRecord(item)) return;
    if (!item.respondents) return;

    await documentClient
      .put({
        Item: item,
        TableName: tableName,
      })
      .promise();
  });
};

module.exports = {
  up,
};

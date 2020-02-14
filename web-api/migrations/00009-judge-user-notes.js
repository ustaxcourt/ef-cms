const up = async (documentClient, tableName, forAllRecords) => {
  await forAllRecords(documentClient, tableName, async item => {
    if (item.pk.startsWith('judges-case-note')) {
      item.pk = item.pk.replace('judges-case-note', 'user-case-note');

      await documentClient
        .put({
          Item: item,
          TableName: tableName,
        })
        .promise();
    }
  });
};

module.exports = { up };

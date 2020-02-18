const isCaseRecord = item => !!item.caseType;

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
    const updatedItem = mutateFunction(item);
    if (updatedItem) {
      await documentClient
        .put({
          Item: updatedItem,
          TableName: tableName,
        })
        .promise();
    }
  });
};

module.exports = { forAllRecords, isCaseRecord, upGenerator };

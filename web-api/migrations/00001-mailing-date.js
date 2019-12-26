const isCaseRecord = item => !!item.caseType; // only case records have a caseType defined

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
        if (item.isPaper && item.mailingDate === undefined) {
          console.log(`adding mailingDate to a paper case of "${item.caseId}"`);
          item.mailingDate = '01/01/2010';

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

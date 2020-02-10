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
      let itemUpdated = false;
      // User record
      if (item.pk === 'thortonsChambers|user') {
        item.pk = 'thorntonsChambers|user';
        itemUpdated = true;
      }

      // Section mapping record
      if (item.pk === 'section-thortonsChambers') {
        item.pk = 'section-thorntonsChambers';
        itemUpdated = true;
      }

      // Section
      if (item.section === 'thortonsChambers') {
        item.section = 'thorntonsChambers';
        itemUpdated = true;
      }

      // Judge field
      if (item.judge && item.judge.section === 'thortonsChambers') {
        item.judge.section = 'thorntonsChambers';
        itemUpdated = true;
      }

      if (itemUpdated) {
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

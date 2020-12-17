const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk === 'eligible-for-trial-case-catalog') {
      const caseRecord = await documentClient
        .get({
          Key: {
            pk: `case|${item.docketNumber}`,
            sk: `case|${item.docketNumber}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      if (!caseRecord.automaticBlocked && !caseRecord.blocked) {
        itemsAfter.push(item);
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

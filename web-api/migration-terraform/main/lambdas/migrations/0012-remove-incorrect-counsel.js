const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (
      item.pk.startsWith('case|') &&
      (item.sk.startsWith('privatePractitioner|') ||
        item.sk.startsWith('irsPractitioner|'))
    ) {
      const [roleOnCase, userId] = item.sk.split('|');

      const userRecord = await documentClient
        .get({
          Key: {
            pk: `user|${userId}`,
            sk: `user|${userId}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      if (roleOnCase === userRecord.role) {
        itemsAfter.push(item);
      } else {
        const docketNumber = item.pk.split('|')[1];
        console.log(
          `Removing counsel on case ${docketNumber} for bar number ${item.barNumber}`,
        );
      }
    } else {
      itemsAfter.push(item);
    }
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

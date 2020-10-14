const migrateItems = async (items, documentClient) => {
  const itemsAfter = [];
  for (const item of items) {
    if (item.pk === 'case-deadline-catalog') {
      const fullDeadline = await documentClient
        .get({
          Key: {
            pk: `case-deadline|${item.caseDeadlineId}`,
            sk: `case-deadline|${item.caseDeadlineId}`,
          },
          TableName: process.env.SOURCE_TABLE,
        })
        .promise()
        .then(res => {
          return res.Item;
        });

      if (fullDeadline) {
        item.gsi1pk = 'case-deadline-catalog';
        item.pk = fullDeadline.deadlineDate;
        item.sk = `case-deadline-catalog|${item.caseDeadlineId}`;
      }
    }
    itemsAfter.push(item);
  }
  return itemsAfter;
};

exports.migrateItems = migrateItems;

exports.bulkIndexRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const body = records
    .map(record => ({
      ...record.dynamodb.NewImage,
    }))
    .flatMap(doc => [
      { index: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: 'efcms' } },
      doc,
    ]);

  const response = await searchClient.bulk({
    body,
    refresh: true,
  });

  const failedRecords = [];
  if (response.body.errors) {
    response.body.items.forEach((action, i) => {
      const operation = Object.keys(action)[0];
      if (action[operation].error) {
        let record = body[i * 2 + 1];
        failedRecords.push(record);
      }
    });
  }

  return { failedRecords };
};

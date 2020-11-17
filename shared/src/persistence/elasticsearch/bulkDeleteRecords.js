const { getIndexNameForRecord } = require('./getIndexNameForRecord');

exports.bulkDeleteRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const body = records
    .map(record => ({
      ...record.dynamodb.OldImage,
    }))
    .flatMap(doc => {
      const index = getIndexNameForRecord(doc);

      console.log(
        '****** bulkDeleteRecords - records before filter ',
        JSON.stringify(records, null, 2),
      );

      if (index) {
        return [{ delete: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: index } }];
      }
    })
    .filter(item => item);

  console.log(
    '****** bulkDeleteRecords - body after filter ',
    JSON.stringify(body, null, 2),
  );

  const failedRecords = [];
  if (body.length) {
    const response = await searchClient.bulk({
      body,
      refresh: false,
    });

    console.log(
      '****** bulkDeleteRecords - response ',
      JSON.stringify(response, null, 2),
    );

    if (response.errors) {
      console.log(
        '****** bulkDeleteRecords - response errors ',
        JSON.stringify(response.errors, null, 2),
      );

      response.items.forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          let record = body[i];
          failedRecords.push(record.delete);
        }
      });
    }
  }
  return { failedRecords };
};

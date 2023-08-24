import { getIndexNameForRecord } from './getIndexNameForRecord';

export const bulkDeleteRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const body = records
    .map(record => ({
      ...record.dynamodb.OldImage,
    }))
    .flatMap(doc => {
      const index = getIndexNameForRecord(doc);

      if (index) {
        return [{ delete: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: index } }];
      }
    })
    .filter(item => item);

  const failedRecords = [];
  if (body.length) {
    const response = await searchClient.bulk({
      body,
      refresh: false,
    });

    if (response.errors) {
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

const { getIndexNameForRecord } = require('./getIndexNameForRecord');

const { chunk } = require('lodash');

exports.bulkIndexRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const CHUNK_SIZE = 50;
  const chunkOfRecords = chunk(
    records,
    process.env.ES_CHUNK_SIZE || CHUNK_SIZE,
  );

  const failedRecords = [];

  await Promise.all(
    chunkOfRecords.map(async recordChunk => {
      const body = recordChunk
        .map(record => ({
          ...record.dynamodb.NewImage,
        }))
        .flatMap(doc => {
          const index = getIndexNameForRecord(doc);

          if (index) {
            return [
              { index: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: index } },
              doc,
            ];
          }
        })
        .filter(item => item);

      if (body.length) {
        const response = await searchClient.bulk({
          body,
          refresh: false,
        });

        if (response.errors) {
          response.items.forEach((action, i) => {
            const operation = Object.keys(action)[0];
            if (action[operation].error) {
              let record = body[i * 2 + 1];
              failedRecords.push(record);
            }
          });
        }
      }
    }),
  );

  return { failedRecords };
};

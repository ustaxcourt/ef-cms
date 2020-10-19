const sizeof = require('object-sizeof');
const { chunk } = require('lodash');
const { getIndexNameForRecord } = require('./getIndexNameForRecord');

exports.bulkIndexRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const CHUNK_SIZE = 50;
  let chunkOfRecords = chunk(records, process.env.ES_CHUNK_SIZE || CHUNK_SIZE);

  const failedRecords = [];

  applicationContext.logger.time('bulkIndexRecords');

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
        const logId = applicationContext.getUniqueId();
        const timeString = `${logId} bulk index ${
          body.length
        } with size ${sizeof(body)}`;
        console.time(timeString);
        const response = await searchClient.bulk({
          body,
          refresh: false,
        });
        console.timeEnd(timeString);
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
  applicationContext.logger.timeEnd('bulkIndexRecords');

  return { failedRecords };
};

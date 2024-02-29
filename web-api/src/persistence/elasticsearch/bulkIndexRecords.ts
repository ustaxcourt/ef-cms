import { chunk } from 'lodash';
import { getIndexNameForRecord } from './getIndexNameForRecord';

export const bulkIndexRecords = async ({ applicationContext, records }) => {
  const searchClient = applicationContext.getSearchClient();

  const CHUNK_SIZE = 50;
  let chunkOfRecords = chunk(
    records,
    Number(process.env.ES_CHUNK_SIZE) || CHUNK_SIZE,
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
          let id = `${doc.pk.S}_${doc.sk.S}`;
          let routing = null;

          if (index) {
            if (doc.entityName.S === 'DocketEntry') {
              routing = `${doc.pk.S}_${doc.pk.S}|mapping`;
            }
            if (doc.entityName.S === 'Message') {
              routing = `${doc.pk.S}_${doc.pk.S}|mapping`;
            }
            if (doc.entityName.S === 'WorkItem') {
              routing = `${doc.pk.S}_${doc.pk.S}|mapping`;
            }
            if (doc.entityName.S === 'CaseDocketEntryMapping') {
              id += '|mapping';
            }
            if (doc.entityName.S === 'CaseMessageMapping') {
              id += '|mapping';
            }
            if (doc.entityName.S === 'CaseWorkItemMapping') {
              id += '|mapping';
            }

            return [
              {
                index: {
                  _id: id,
                  _index: index,
                  routing,
                },
              },
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

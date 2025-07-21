import { ServerApplicationContext } from '@web-api/applicationContext';
import { getIndexNameForRecord } from '@web-api/persistence/elasticsearch/getIndexNameForRecord';
import { Bulk_RequestBody } from '@opensearch-project/opensearch/api';

export const bulkDeleteRecords = async ({
  applicationContext,
  records,
}: {
  applicationContext: ServerApplicationContext;
  records: any[];
}) => {
  const searchClient = applicationContext.getSearchClient();

  const body: Bulk_RequestBody = records
    .map(record => ({
      ...record.dynamodb.OldImage,
    }))
    .flatMap(doc => {
      const index = getIndexNameForRecord(doc);

      if (index) {
        return [{ delete: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: index } }];
      }
    })
    .filter(item => item) as Record<string, any>[];

  const failedRecords: Record<string, any>[] = [];

  if (body.length) {
    const response = await searchClient.bulk({
      body,
      refresh: false,
    });

    if (response['errors']) {
      response['items'].forEach((action, i) => {
        const operation = Object.keys(action)[0];
        if (action[operation].error) {
          const record = body[i];
          failedRecords.push(record.delete);
        }
      });
    }
  }

  return { failedRecords };
};

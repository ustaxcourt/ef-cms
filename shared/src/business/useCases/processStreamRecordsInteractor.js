const { createISODateString } = require('../utilities/DateHandler');

const filterRecords = records => {
  return records.filter(
    record =>
      !record.dynamodb.Keys.pk.S.includes('work-item|') &&
      !record.dynamodb.Keys.pk.S.includes('user|') &&
      ['INSERT', 'MODIFY'].includes(record.eventName),
  );
};

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array<object>} providers.recordsToProcess the records to process
 * @returns {object} the results of all the index calls for logging
 */
exports.processStreamRecordsInteractor = async ({
  applicationContext,
  recordsToProcess,
}) => {
  applicationContext.logger.info('Time', createISODateString());
  const searchClient = applicationContext.getSearchClient();

  const filteredRecords = filterRecords(recordsToProcess).map(record => ({
    ...record.dynamodb.NewImage,
  }));

  // fetch entire case persistence
  const body = filteredRecords.flatMap(doc => [
    { index: { _id: `${doc.pk.S}_${doc.sk.S}`, _index: 'efcms' } },
    doc,
  ]);

  if (body && body.length) {
    try {
      const response = await searchClient.bulk({
        body,
        refresh: true,
      });

      if (response.body.errors) {
        response.body.items.forEach(async (action, i) => {
          const operation = Object.keys(action)[0];
          if (action[operation].error) {
            const record = body[i * 2 + 1];

            try {
              await searchClient.index({
                body: { ...record },
                id: `${record.pk.S}_${record.sk.S}`,
                index: 'efcms',
              });
            } catch (e) {
              await applicationContext
                .getPersistenceGateway()
                .createElasticsearchReindexRecord({
                  applicationContext,
                  recordPk: record.pk.S,
                  recordSk: record.sk.S,
                });

              applicationContext.logger.info('Error', e);
            }
          }
        });
      }
    } catch {
      //if the bulk index fails, try each single index individually and
      //add the failing ones to the reindex list
      const recordsToReprocess = filterRecords(recordsToProcess);
      for (const record of recordsToReprocess) {
        try {
          await searchClient.index({
            body: { ...record.dynamodb.NewImage },
            id: `${record.dynamodb.Keys.pk.S}_${record.dynamodb.Keys.sk.S}`,
            index: 'efcms',
          });
        } catch (e) {
          await applicationContext
            .getPersistenceGateway()
            .createElasticsearchReindexRecord({
              applicationContext,
              recordPk: record.dynamodb.Keys.pk.S,
              recordSk: record.dynamodb.Keys.sk.S,
            });

          applicationContext.logger.info('Error', e);
        }
      }
    }
  }

  applicationContext.logger.info('Time', createISODateString());
};

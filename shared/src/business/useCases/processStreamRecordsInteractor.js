const { createISODateString } = require('../utilities/DateHandler');

const filterRecords = records => {
  return records.filter(
    record =>
      !record.dynamodb.Keys.pk.S.includes('workitem-') &&
      !record.dynamodb.Keys.pk.S.includes('|user'),
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

  const filteredRecords = filterRecords(recordsToProcess);

  for (const record of filteredRecords) {
    if (['INSERT', 'MODIFY'].includes(record.eventName)) {
      try {
        await searchClient.index({
          body: { ...record.dynamodb.NewImage },
          id: record.dynamodb.Keys.pk.S,
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

  applicationContext.logger.info('Time', createISODateString());
};

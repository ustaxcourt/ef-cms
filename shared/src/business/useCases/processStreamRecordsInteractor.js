const { createISODateString } = require('../utilities/DateHandler');

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

  const indexCalls = [];
  for (const record of recordsToProcess) {
    if (['INSERT', 'MODIFY'].includes(record.eventName)) {
      indexCalls.push(
        applicationContext.getSearchClient().index({
          body: { ...record.dynamodb.NewImage },
          id: record.dynamodb.Keys.pk.S,
          index: 'efcms',
        }),
      );
    }
  }

  let results;
  try {
    results = await Promise.all(indexCalls);
  } catch (e) {
    applicationContext.logger.info('Error', e);
  }

  applicationContext.logger.info('Time', createISODateString());
  return results;
};

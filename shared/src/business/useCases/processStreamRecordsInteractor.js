const { createISODateString } = require('../utilities/DateHandler');

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 */
exports.processStreamRecordsInteractor = async ({
  applicationContext,
  recordsToProcess,
}) => {
  applicationContext.logger.info('Time', createISODateString());
  for (const record of recordsToProcess) {
    if (['INSERT', 'MODIFY'].includes(record.eventName)) {
      try {
        await applicationContext.getSearchClient().index({
          body: { ...record.dynamodb.NewImage },
          id: record.dynamodb.Keys.pk.S,
          index: 'efcms',
        });
      } catch (e) {
        applicationContext.logger.info('Error', e);
      }
    }
  }
  applicationContext.logger.info('Time', createISODateString());
};

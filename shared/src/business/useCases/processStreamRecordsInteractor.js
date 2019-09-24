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

  recordsToProcess.forEach(async record => {
    if (record.eventName === 'INSERT') {
      await applicationContext.getSearchClient().index({
        body: {
          ...record.dynamodb.NewImage,
        },
        id: record.dynamodb.Keys.pk.S,
        index: 'efcms',
      });
    }
  });

  applicationContext.logger.info('Time', createISODateString());
};

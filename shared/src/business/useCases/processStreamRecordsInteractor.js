const { get } = require('lodash');

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
  recordsToProcess = recordsToProcess.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(record, NEW_TIME_KEY);
    const oldTime = get(record, OLD_TIME_KEY);
    return newTime && newTime !== oldTime;
  });

  const removeRecords = recordsToProcess.filter(
    record => record.eventName === 'REMOVE',
  );
  const insertModifyRecords = recordsToProcess.filter(
    record => record.eventName !== 'REMOVE',
  );

  if (removeRecords.length) {
    applicationContext.logger.info('should be removing', removeRecords);
    const {
      failedRecords,
    } = await applicationContext.getPersistenceGateway().bulkDeleteRecords({
      applicationContext,
      records: removeRecords,
    });

    if (failedRecords.length > 0) {
      applicationContext.logger.info(
        'the records that failed to delete',
        failedRecords,
      );
      throw new Error('failed to delete records');
    }
  }

  if (insertModifyRecords.length) {
    applicationContext.logger.info('should be adding', insertModifyRecords);
    const {
      failedRecords,
    } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
      applicationContext,
      records: insertModifyRecords,
    });

    if (failedRecords.length > 0) {
      applicationContext.logger.info(
        'the records that failed to index',
        failedRecords,
      );
      throw new Error('failed to index records');
    }
  }
};

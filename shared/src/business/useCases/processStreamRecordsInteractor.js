const {
  filterRecords,
  partitionRecords,
  processCaseEntries,
  processDocketEntries,
  processMessageEntries,
  processOtherEntries,
  processRemoveEntries,
  processWorkItemEntries,
} = require('./processStreamUtilities');

const getCase = ({ applicationContext: appContext, docketNumber }) =>
  appContext.getPersistenceGateway().getCaseByDocketNumber({
    applicationContext: appContext,
    docketNumber,
  });

const getDocument = ({ applicationContext: appContext, documentContentsId }) =>
  appContext.getPersistenceGateway().getDocument({
    applicationContext: appContext,
    key: documentContentsId,
    protocol: 'S3',
    useTempBucket: false,
  });

const getMessage = ({
  applicationContext: appContext,
  docketNumber,
  messageId,
}) =>
  appContext.getPersistenceGateway().getMessageById({
    applicationContext: appContext,
    docketNumber,
    messageId,
  });

/**
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array<object>} providers.recordsToProcess the records to process
 * @returns {object} the results of all the index calls for logging
 */
exports.processStreamRecordsInteractor = async (
  applicationContext,
  { recordsToProcess },
) => {
  recordsToProcess = recordsToProcess.filter(filterRecords);

  const {
    caseEntityRecords,
    docketEntryRecords,
    messageRecords,
    otherRecords,
    removeRecords,
    workItemRecords,
  } = partitionRecords(recordsToProcess);

  const utils = {
    getCase,
    getDocument,
    getMessage,
  };

  try {
    await processRemoveEntries({
      applicationContext,
      removeRecords,
    }).catch(err => {
      applicationContext.logger.error('failed to processRemoveEntries', {
        err,
      });
      throw err;
    });

    await processCaseEntries({
      applicationContext,
      caseEntityRecords,
      utils,
    }).catch(err => {
      applicationContext.logger.error('failed to processCaseEntries', {
        err,
      });
      throw err;
    });

    await processDocketEntries({
      applicationContext,
      docketEntryRecords,
      utils,
    }).catch(err => {
      applicationContext.logger.error('failed to processDocketEntries', {
        err,
      });
      throw err;
    });

    await processWorkItemEntries({ applicationContext, workItemRecords }).catch(
      err => {
        applicationContext.logger.error('failed to process workItem records', {
          err,
        });
        throw err;
      },
    );

    await processMessageEntries({
      applicationContext,
      messageRecords,
      utils,
    }).catch(err => {
      applicationContext.logger.error('failed to process message records', {
        err,
      });
      throw err;
    });

    await processOtherEntries({ applicationContext, otherRecords }).catch(
      err => {
        applicationContext.logger.error('failed to processOtherEntries', {
          err,
        });
        throw err;
      },
    );
  } catch (err) {
    applicationContext.logger.error(
      'processStreamRecordsInteractor failed to process the records',
      { err },
    );
    throw err;
  }
};

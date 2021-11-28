const {
  processDocketEntries,
} = require('./elasticsearch/processDocketEntries');
const {
  processMessageEntries,
} = require('./elasticsearch/processMessageEntries');
const {
  processPractitionerMappingEntries,
} = require('./elasticsearch/processPractitionerMappingEntries');
const {
  processRemoveEntries,
} = require('./elasticsearch/processRemoveEntries');
const {
  processWorkItemEntries,
} = require('./elasticsearch/processWorkItemEntries');
const { partitionRecords } = require('./elasticsearch/processStreamUtilities');
const { processCaseEntries } = require('./elasticsearch/processCaseEntries');
const { processOtherEntries } = require('./elasticsearch/processOtherEntries');

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
  const {
    caseEntityRecords,
    docketEntryRecords,
    messageRecords,
    otherRecords,
    practitionerMappingRecords,
    removeRecords,
    workItemRecords,
  } = partitionRecords(recordsToProcess);

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
    }).catch(err => {
      applicationContext.logger.error('failed to processCaseEntries', {
        err,
      });
      throw err;
    });

    await processDocketEntries({
      applicationContext,
      docketEntryRecords,
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
    }).catch(err => {
      applicationContext.logger.error('failed to process message records', {
        err,
      });
      throw err;
    });

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords,
    }).catch(err => {
      applicationContext.logger.error(
        'failed to process practitioner mapping records',
        {
          err,
        },
      );
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

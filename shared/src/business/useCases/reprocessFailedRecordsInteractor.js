const { createISODateString } = require('../utilities/DateHandler');

/**
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @returns {object} the results of all the index calls for logging
 */
exports.reprocessFailedRecordsInteractor = async ({ applicationContext }) => {
  applicationContext.logger.info('Time', createISODateString());

  const recordsToProcess = await applicationContext
    .getPersistenceGateway()
    .getElasticsearchReindexRecords({ applicationContext });

  if (recordsToProcess.length) {
    for (const record of recordsToProcess) {
      try {
        let fullRecord;

        if (record.recordPk.includes('case|')) {
          const fullCase = await applicationContext
            .getPersistenceGateway()
            .getCaseByDocketNumber({
              applicationContext,
              docketNumber: record.recordPk.split('|')[1],
            });

          if (fullCase.docketNumber) {
            fullRecord = fullCase;
            record.recordSk = record.recordPk;
          } else {
            fullRecord = await applicationContext
              .getPersistenceGateway()
              .getRecord({
                applicationContext,
                recordPk: record.recordPk,
                recordSk: record.recordSk,
              });
          }
        } else {
          fullRecord = await applicationContext
            .getPersistenceGateway()
            .getRecord({
              applicationContext,
              recordPk: record.recordPk,
              recordSk: record.recordSk,
            });
        }

        await applicationContext.getPersistenceGateway().indexRecord({
          applicationContext,
          fullRecord,
          record,
        });

        await applicationContext
          .getPersistenceGateway()
          .deleteElasticsearchReindexRecord({
            applicationContext,
            recordPk: record.recordPk,
            recordSk: record.recordSk,
          });
      } catch (e) {
        applicationContext.logger.info('Error', e);
        await applicationContext.notifyHoneybadger(e);
      }
    }

    applicationContext.logger.info('Time', createISODateString());
  }
};

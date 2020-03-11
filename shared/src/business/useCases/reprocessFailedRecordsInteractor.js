const AWS = require('aws-sdk');
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
    const searchClient = applicationContext.getSearchClient();

    for (const record of recordsToProcess) {
      try {
        const fullRecord = await applicationContext
          .getPersistenceGateway()
          .getRecord({
            applicationContext,
            recordPk: record.recordPk,
            recordSk: record.recordSk,
          });

        await searchClient.index({
          body: { ...AWS.DynamoDB.Converter.marshall(fullRecord) },
          id: record.recordPk,
          index: 'efcms',
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
      }
    }

    applicationContext.logger.info('Time', createISODateString());
  }
};

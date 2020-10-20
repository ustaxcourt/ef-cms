const AWS = require('aws-sdk');
const { createISODateString } = require('../utilities/DateHandler');

const getRemoveRecords = ({ records }) => {
  return records.filter(record => record.eventName === 'REMOVE');
};

/**
 * filters out records we do not want to index with elasticsearch
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Array} providers.records the array of records to filter
 * @returns {Array} the filtered records
 */
const filterRecords = async ({ applicationContext, records }) => {
  const filteredRecords = records.filter(
    record =>
      !record.dynamodb.Keys.pk.S.includes('work-item|') &&
      ['INSERT', 'MODIFY'].includes(record.eventName),
  );

  const caseRecords = filteredRecords.filter(record =>
    record.dynamodb.Keys.pk.S.includes('case|'),
  );

  for (let caseRecord of caseRecords) {
    const docketNumber = caseRecord.dynamodb.Keys.pk.S.split('|')[1];

    const fullCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    if (fullCase.docketNumber) {
      filteredRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: caseRecord.dynamodb.Keys.pk.S,
            },
            sk: {
              S: caseRecord.dynamodb.Keys.pk.S,
            },
          },
          NewImage: AWS.DynamoDB.Converter.marshall(fullCase),
        },
        eventName: 'MODIFY',
      });

      //also reindex all of the docketEntries on the case
      const { docketEntries } = fullCase;
      for (const document of docketEntries) {
        if (document.documentContentsId) {
          const buffer = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: document.documentContentsId,
              protocol: 'S3',
              useTempBucket: false,
            });

          const { documentContents } = JSON.parse(buffer.toString());
          document.documentContents = documentContents;
        }

        const documentWithCaseInfo = {
          ...AWS.DynamoDB.Converter.marshall(fullCase),
          ...AWS.DynamoDB.Converter.marshall(document),
          docketEntries: undefined,
          entityName: { S: 'DocketEntry' },
          sk: { S: `docket-entry|${document.docketEntryId}` },
        };

        filteredRecords.push({
          dynamodb: {
            Keys: {
              pk: {
                S: caseRecord.dynamodb.Keys.pk.S,
              },
              sk: {
                S: `docket-entry|${document.docketEntryId}`,
              },
            },
            NewImage: documentWithCaseInfo,
          },
          eventName: 'MODIFY',
        });
      }
    }
  }

  return filteredRecords;
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
  const processJobId = applicationContext.getUniqueId();

  applicationContext.logger.info(
    `processStreamRecordsInteractor job ${processJobId} started at time:`,
    createISODateString(),
  );

  const removeRecords = getRemoveRecords({ records: recordsToProcess });

  if (removeRecords.length) {
    try {
      const {
        failedRecords,
      } = await applicationContext.getPersistenceGateway().bulkDeleteRecords({
        applicationContext,
        records: removeRecords,
      });

      const catchDeleteRecordError = failedRecord => async e => {
        applicationContext.logger.error(
          `processStreamRecordsInteractor job ${processJobId} deleteRecord error for record ${failedRecord['_id']}:`,
          e,
        );
        await applicationContext.notifyHoneybadger(e);
      };

      const processRecordDeletion = async failedRecord => {
        try {
          await applicationContext.getPersistenceGateway().deleteRecord({
            applicationContext,
            indexName: failedRecord['_index'],
            recordId: failedRecord['_id'],
          });
        } catch (e) {
          await catchDeleteRecordError(failedRecord)(e);
        }
      };

      const deletionRequests = failedRecords.map(processRecordDeletion);
      await Promise.allSettled(deletionRequests);
    } catch (e) {
      applicationContext.logger.error(
        `processStreamRecordsInteractor job ${processJobId} bulkDeleteRecords error:`,
        e,
      );
      await applicationContext.notifyHoneybadger(e);
    }
  }

  const filteredRecords = await filterRecords({
    applicationContext,
    records: recordsToProcess,
  });

  if (filteredRecords.length) {
    try {
      const {
        failedRecords,
      } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
        applicationContext,
        records: filteredRecords,
      });

      if (failedRecords.length) {
        const catchAndReIndex = failedRecord => async e => {
          await applicationContext
            .getPersistenceGateway()
            .createElasticsearchReindexRecord({
              applicationContext,
              recordPk: failedRecord.pk.S,
              recordSk: failedRecord.sk.S,
            });

          applicationContext.logger.error(
            `processStreamRecordsInteractor job ${processJobId} indexRecord error during bulkIndexRecords:`,
            e,
          );
          await applicationContext.notifyHoneybadger(e);
        };

        const indexRecord = async failedRecord => {
          try {
            await applicationContext.getPersistenceGateway().indexRecord({
              applicationContext,
              fullRecord: { ...failedRecord },
              isAlreadyMarshalled: true,
              record: {
                recordPk: failedRecord.pk.S,
                recordSk: failedRecord.sk.S,
              },
            });
          } catch (e) {
            await catchAndReIndex(failedRecord)(e);
          }
        };

        await Promise.allSettled(failedRecords.map(indexRecord));
      }
    } catch {
      //if the bulk index fails, try each single index individually and
      //add the failing ones to the reindex list
      const recordsToReprocess = await filterRecords({
        applicationContext,
        records: recordsToProcess,
      });

      const reIndexRecord = record => async e => {
        await applicationContext
          .getPersistenceGateway()
          .createElasticsearchReindexRecord({
            applicationContext,
            recordPk: record.dynamodb.Keys.pk.S,
            recordSk: record.dynamodb.Keys.sk.S,
          });

        applicationContext.logger.error(
          `processStreamRecordsInteractor job ${processJobId} indexRecord error during record reprocessing:`,
          e,
        );
        await applicationContext.notifyHoneybadger(e);
      };

      const reprocessRecord = async record => {
        const newImage = record.dynamodb.NewImage;

        try {
          await applicationContext.getPersistenceGateway().indexRecord({
            applicationContext,
            fullRecord: newImage,
            isAlreadyMarshalled: true,
            record: {
              recordPk: record.dynamodb.Keys.pk.S,
              recordSk: record.dynamodb.Keys.sk.S,
            },
          });
        } catch (e) {
          await reIndexRecord(record)();
        }
      };

      await Promise.allSettled(recordsToReprocess.map(reprocessRecord));
    }
  }

  applicationContext.logger.info(
    `processStreamRecordsInteractor job ${processJobId} completed at time:`,
    createISODateString(),
  );
};

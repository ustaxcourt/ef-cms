const AWS = require('aws-sdk');
const { createISODateString } = require('../utilities/DateHandler');

/**
 * recursively deletes the key from the item
 *
 * @param {object} item the object from which to delete the key
 * @param {string} key the key to delete recursively from the object
 * @returns {object} the record with all instances of the key removed
 */
const recursivelyDeleteKey = (item, key) => {
  Object.keys(item).some(function (k) {
    if (k === key) {
      delete item[k];
    }
    if (item[k] && typeof item[k] === 'object') {
      const returnItem = recursivelyDeleteKey(item[k], key);
      item[k] = returnItem;
    }
  });
  return item;
};

/**
 * deletes objects with dynamic keys and nested data to prevent hitting our ES mapping limit
 *
 * @param {object} record the object from which to delete unnecessary data
 * @returns {object} the record with unnecessary data removed
 */
const deleteDynamicAndNestedFields = record => {
  let data = record.dynamodb.NewImage;
  //dynamic keys
  if (data.qcCompleteForTrial) {
    delete data.qcCompleteForTrial;
  }
  if (data.caseMetadata) {
    delete data.caseMetadata;
  }
  //nested data
  data = recursivelyDeleteKey(data, 'workItems');
  data = recursivelyDeleteKey(data, 'draftState');

  record.dynamodb.NewImage = data;
  return record;
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
    const caseId = caseRecord.dynamodb.Keys.pk.S.split('|')[1];

    const fullCase = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });

    if (fullCase.caseId) {
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

      //also reindex all of the documents on the case
      const { documents } = fullCase;
      for (const document of documents) {
        if (document.documentContentsId) {
          const buffer = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              documentId: document.documentContentsId,
              protocol: 'S3',
              useTempBucket: false,
            });

          const { documentContents } = JSON.parse(buffer.toString());
          document.documentContents = documentContents;
        }

        const documentWithCaseInfo = {
          ...AWS.DynamoDB.Converter.marshall(fullCase),
          ...AWS.DynamoDB.Converter.marshall(document),
          docketRecord: undefined,
          documents: undefined,
          entityName: { S: 'Document' },
          sk: { S: `document|${document.documentId}` },
        };

        filteredRecords.push({
          dynamodb: {
            Keys: {
              pk: {
                S: caseRecord.dynamodb.Keys.pk.S,
              },
              sk: {
                S: `document|${document.documentId}`,
              },
            },
            NewImage: documentWithCaseInfo,
          },
          eventName: 'MODIFY',
        });
      }
    }
  }

  return filteredRecords.map(deleteDynamicAndNestedFields);
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
        for (const failedRecord of failedRecords) {
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
            await applicationContext
              .getPersistenceGateway()
              .createElasticsearchReindexRecord({
                applicationContext,
                recordPk: failedRecord.pk.S,
                recordSk: failedRecord.sk.S,
              });

            applicationContext.logger.info('Error', e);
            await applicationContext.notifyHoneybadger(e);
          }
        }
      }
    } catch {
      //if the bulk index fails, try each single index individually and
      //add the failing ones to the reindex list
      const recordsToReprocess = await filterRecords({
        applicationContext,
        records: recordsToProcess,
      });

      for (const record of recordsToReprocess) {
        try {
          let newImage = record.dynamodb.NewImage;

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
          await applicationContext
            .getPersistenceGateway()
            .createElasticsearchReindexRecord({
              applicationContext,
              recordPk: record.dynamodb.Keys.pk.S,
              recordSk: record.dynamodb.Keys.sk.S,
            });

          applicationContext.logger.info('Error', e);
          await applicationContext.notifyHoneybadger(e);
        }
      }
    }
  }

  applicationContext.logger.info('Time', createISODateString());
};

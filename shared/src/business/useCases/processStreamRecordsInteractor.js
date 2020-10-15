const AWS = require('aws-sdk');
const { flattenDeep, get, memoize, partition } = require('lodash');

/**
 * fetches the latest version of the case from dynamodb and re-indexes all of the docket-entries associated with the case.
 *
 * @param {array} caseEntityRecords all of the event stream records associated with case entities
 */
const processCaseEntries = async ({
  applicationContext,
  caseEntityRecords,
  utils,
}) => {
  if (!caseEntityRecords.length) return;

  applicationContext.logger.info(
    `going to index ${caseEntityRecords.length} caseEntityRecords`,
  );
  applicationContext.logger.time(
    `going to create index records ${caseEntityRecords.length} caseEntityRecords`,
  );

  const indexDocketEntry = async (fullCase, docketEntry) => {
    if (docketEntry.documentContentsId) {
      const buffer = await utils.getDocument({
        applicationContext,
        documentContentsId: docketEntry.documentContentsId,
      });
      const { documentContents } = JSON.parse(buffer.toString());
      docketEntry.documentContents = documentContents;
    }

    const docketEntryWithCase = {
      ...AWS.DynamoDB.Converter.marshall(fullCase),
      ...AWS.DynamoDB.Converter.marshall(docketEntry),
    };

    return {
      dynamodb: {
        Keys: {
          pk: {
            S: docketEntry.pk,
          },
          sk: {
            S: docketEntry.sk,
          },
        },
        NewImage: docketEntryWithCase,
      },
      eventName: 'MODIFY',
    };
  };

  const indexCaseEntry = async caseRecord => {
    const caseEntry = AWS.DynamoDB.Converter.unmarshall(
      caseRecord.dynamodb.NewImage,
    );

    const fullCase = await utils.getCase({
      applicationContext,
      docketNumber: caseEntry.docketNumber,
    });

    const { docketEntries } = fullCase;

    const docketEntryRecords = await Promise.all(
      docketEntries.map(entry => indexDocketEntry(fullCase, entry)),
    );

    docketEntryRecords.push({
      dynamodb: {
        Keys: {
          pk: {
            S: fullCase.pk,
          },
          sk: {
            S: fullCase.sk,
          },
        },
        NewImage: AWS.DynamoDB.Converter.marshall(fullCase),
      },
      eventName: 'MODIFY',
    });

    return docketEntryRecords;
  };

  const indexRecords = await Promise.all(caseEntityRecords.map(indexCaseEntry));

  applicationContext.logger.timeEnd(
    `going to create index records ${caseEntityRecords.length} caseEntityRecords`,
  );

  applicationContext.logger.time(
    `going to index records ${caseEntityRecords.length} caseEntityRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: flattenDeep(indexRecords),
  });

  applicationContext.logger.timeEnd(
    `going to index records ${caseEntityRecords.length} caseEntityRecords`,
  );

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the case or docket entry records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index case entry or docket entry records');
  }
};

/**
 * fetches the latest version of the case from dynamodb and re-indexes this docket-entries combined with the latest case info.
 *
 * @param {array} docketEntryRecords all of the event stream records associated with docket entries
 */
const processDocketEntries = async ({
  applicationContext,
  docketEntryRecords,
  utils,
}) => {
  if (!docketEntryRecords.length) return;

  applicationContext.logger.info(
    `going to index ${docketEntryRecords.length} docketEntryRecords`,
  );

  applicationContext.logger.time(
    `going to create index records ${docketEntryRecords.length} docketEntryRecords`,
  );

  const newDocketEntryRecords = await Promise.all(
    docketEntryRecords.map(async record => {
      const fullDocketEntry = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage,
      );

      const fullCase = await utils.getCase({
        applicationContext,
        docketNumber: fullDocketEntry.docketNumber,
      });

      if (fullDocketEntry.documentContentsId) {
        const buffer = await utils.getDocument({
          applicationContext,
          documentContentsId: fullDocketEntry.documentContentsId,
        });
        const { documentContents } = JSON.parse(buffer.toString());
        fullDocketEntry.documentContents = documentContents;
      }

      const docketEntryWithCase = {
        ...AWS.DynamoDB.Converter.marshall(fullCase),
        ...AWS.DynamoDB.Converter.marshall(fullDocketEntry),
      };

      return {
        dynamodb: {
          Keys: {
            pk: {
              S: fullDocketEntry.pk,
            },
            sk: {
              S: fullDocketEntry.sk,
            },
          },
          NewImage: docketEntryWithCase,
        },
        eventName: 'MODIFY',
      };
    }),
  );
  applicationContext.logger.timeEnd(
    `going to create index records ${docketEntryRecords.length} docketEntryRecords`,
  );

  applicationContext.logger.time(
    `going to index ${docketEntryRecords.length} docketEntryRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: newDocketEntryRecords,
  });

  applicationContext.logger.timeEnd(
    `going to index ${docketEntryRecords.length} docketEntryRecords`,
  );

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the docket entry records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index docket entry records');
  }
};

const processOtherEntries = async ({ applicationContext, otherRecords }) => {
  if (!otherRecords.length) return;

  applicationContext.logger.info(
    `going to index ${otherRecords.length} otherRecords`,
  );
  applicationContext.logger.time(
    `going to index ${otherRecords.length} otherRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
    applicationContext,
    records: otherRecords,
  });

  applicationContext.logger.timeEnd(
    `going to index ${otherRecords.length} otherRecords`,
  );

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the records that failed to index',
      failedRecords,
    );
    throw new Error('failed to index records');
  }
};

const processRemoveEntries = async ({ applicationContext, removeRecords }) => {
  if (!removeRecords.length) return;

  applicationContext.logger.info(
    `going to index ${removeRecords.length} removeRecords`,
  );

  applicationContext.logger.time(
    `going to index ${removeRecords.length} removeRecords`,
  );

  const {
    failedRecords,
  } = await applicationContext.getPersistenceGateway().bulkDeleteRecords({
    applicationContext,
    records: removeRecords,
  });

  applicationContext.logger.timeEnd(
    `going to index ${removeRecords.length} removeRecords`,
  );

  if (failedRecords.length > 0) {
    applicationContext.logger.info(
      'the records that failed to delete',
      failedRecords,
    );
    throw new Error('failed to delete records');
  }
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
  const getCase = memoize(({ applicationContext, docketNumber }) =>
    applicationContext.getPersistenceGateway().getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    }),
  );

  const getDocument = memoize(({ applicationContext, documentContentsId }) =>
    applicationContext.getPersistenceGateway().getDocument({
      applicationContext,
      key: documentContentsId,
      protocol: 'S3',
      useTempBucket: false,
    }),
  );

  recordsToProcess = recordsToProcess.filter(record => {
    // to prevent global tables writing extra data
    const NEW_TIME_KEY = 'dynamodb.NewImage.aws:rep:updatetime.N';
    const OLD_TIME_KEY = 'dynamodb.OldImage.aws:rep:updatetime.N';
    const newTime = get(record, NEW_TIME_KEY);
    const oldTime = get(record, OLD_TIME_KEY);
    return (
      process.env.NODE_ENV !== 'production' || (newTime && newTime !== oldTime)
    );
  });

  const [removeRecords, insertModifyRecords] = partition(
    recordsToProcess,
    record => record.eventName === 'REMOVE',
  );

  const [docketEntryRecords, nonDocketEntryRecords] = partition(
    insertModifyRecords,
    record =>
      AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage).entityName ===
      'DocketEntry',
  );

  const [caseEntityRecords, otherRecords] = partition(
    nonDocketEntryRecords,
    record =>
      AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage).entityName ===
      'Case',
  );

  const utils = {
    getCase,
    getDocument,
  };

  try {
    await processRemoveEntries({ applicationContext, removeRecords });

    await Promise.all([
      processCaseEntries({ applicationContext, caseEntityRecords, utils }),
      processDocketEntries({ applicationContext, docketEntryRecords, utils }),
      processOtherEntries({ applicationContext, otherRecords }),
    ]);
  } catch (err) {
    applicationContext.logger.info(
      'processStreamRecordsInteractor failed to process the records',
      err,
    );
    throw err;
  }
};

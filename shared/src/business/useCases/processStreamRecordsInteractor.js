const AWS = require('aws-sdk');
const { get, memoize, partition } = require('lodash');

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

  const removeRecords = recordsToProcess.filter(
    record => record.eventName === 'REMOVE',
  );

  const insertModifyRecords = recordsToProcess.filter(
    record => record.eventName !== 'REMOVE',
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

  if (removeRecords.length) {
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

  if (otherRecords.length) {
    const {
      failedRecords,
    } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
      applicationContext,
      records: otherRecords,
    });

    if (failedRecords.length > 0) {
      applicationContext.logger.info(
        'the records that failed to index',
        failedRecords,
      );
      throw new Error('failed to index records');
    }
  }

  if (caseEntityRecords.length) {
    await Promise.all(
      caseEntityRecords.map(async caseRecord => {
        const caseEntry = AWS.DynamoDB.Converter.unmarshall(
          caseRecord.dynamodb.NewImage,
        );

        const fullCase = await getCase({
          applicationContext,
          docketNumber: caseEntry.docketNumber,
        });

        const { docketEntries } = fullCase;

        const docketEntryRecords = await Promise.all(
          docketEntries.map(async docketEntry => {
            if (docketEntry.documentContentsId) {
              const buffer = await getDocument({
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
          }),
        );

        const {
          failedRecords,
        } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
          applicationContext,
          records: docketEntryRecords,
        });

        if (failedRecords.length > 0) {
          applicationContext.logger.info(
            'the docket entry records that failed to index',
            failedRecords,
          );
          throw new Error('failed to index docket entry records');
        }

        const failedCaseRecords = (
          await applicationContext.getPersistenceGateway().bulkIndexRecords({
            applicationContext,
            records: [
              {
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
              },
            ],
          })
        ).failedRecords;

        if (failedCaseRecords.length > 0) {
          applicationContext.logger.info(
            'the docket entry records that failed to index',
            failedCaseRecords,
          );
          throw new Error('failed to index case entry records');
        }
      }),
    );
  }

  if (docketEntryRecords.length) {
    const newDocketEntryRecords = await Promise.all(
      docketEntryRecords.map(async record => {
        const fullDocketEntry = AWS.DynamoDB.Converter.unmarshall(
          record.dynamodb.NewImage,
        );

        const fullCase = await getCase({
          applicationContext,
          docketNumber: fullDocketEntry.docketNumber,
        });

        if (fullDocketEntry.documentContentsId) {
          const buffer = await getDocument({
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

    const {
      failedRecords,
    } = await applicationContext.getPersistenceGateway().bulkIndexRecords({
      applicationContext,
      records: newDocketEntryRecords,
    });

    if (failedRecords.length > 0) {
      applicationContext.logger.info(
        'the docket entry records that failed to index',
        failedRecords,
      );
      throw new Error('failed to index docket entry records');
    }
  }
};

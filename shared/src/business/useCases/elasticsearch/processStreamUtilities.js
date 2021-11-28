const AWS = require('aws-sdk');
const {
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
} = require('../../entities/EntityConstants');
const { compact, flattenDeep, partition } = require('lodash');
const { processEntries } = require('./processEntries');

const partitionRecords = records => {
  const [practitionerMappingRecords, nonPractitionerMappingRecords] = partition(
    records,
    record =>
      isPractitionerMappingRemoveRecord(record) ||
      isPractitionerMappingInsertModifyRecord(record),
  );

  const [removeRecords, insertModifyRecords] = partition(
    nonPractitionerMappingRecords,
    record => record.eventName === 'REMOVE',
  );

  const [docketEntryRecords, nonDocketEntryRecords] = partition(
    insertModifyRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'DocketEntry',
  );

  const [caseEntityRecords, nonCaseEntityRecords] = partition(
    nonDocketEntryRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'Case',
  );

  const [workItemRecords, nonWorkItemRecords] = partition(
    nonCaseEntityRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'WorkItem',
  );

  const [messageRecords, otherRecords] = partition(
    nonWorkItemRecords,
    record =>
      record.dynamodb.NewImage.entityName &&
      record.dynamodb.NewImage.entityName.S === 'Message',
  );

  return {
    caseEntityRecords,
    docketEntryRecords,
    messageRecords,
    otherRecords,
    practitionerMappingRecords,
    removeRecords,
    workItemRecords,
  };
};

const processRemoveEntries = async ({ applicationContext, removeRecords }) => {
  if (!removeRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${removeRecords.length} removeRecords`,
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkDeleteRecords({
      applicationContext,
      records: removeRecords,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to delete', {
      failedRecords,
    });
    throw new Error('failed to delete records');
  }
};

/**
 * fetches the latest version of the case from dynamodb and re-indexes this docket-entries combined with the latest case info.
 *
 * @param {array} docketEntryRecords all of the event stream records associated with docket entries
 */
const processDocketEntries = async ({
  applicationContext,
  docketEntryRecords: records,
}) => {
  if (!records.length) return;

  applicationContext.logger.debug(
    `going to index ${records.length} docketEntryRecords`,
  );

  const newDocketEntryRecords = await Promise.all(
    records.map(async record => {
      // TODO: May need to remove the `case_relations` object and re-add later
      const fullDocketEntry = AWS.DynamoDB.Converter.unmarshall(
        record.dynamodb.NewImage,
      );

      const isSearchable =
        OPINION_EVENT_CODES_WITH_BENCH_OPINION.includes(
          fullDocketEntry.eventCode,
        ) || ORDER_EVENT_CODES.includes(fullDocketEntry.eventCode);

      if (isSearchable && fullDocketEntry.documentContentsId) {
        // TODO: for performance, we should not re-index doc contents if we do not have to (use a contents hash?)
        try {
          const buffer = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: fullDocketEntry.documentContentsId,
              protocol: 'S3',
              useTempBucket: false,
            });
          const { documentContents } = JSON.parse(buffer.toString());

          fullDocketEntry.documentContents = documentContents;
        } catch (err) {
          applicationContext.logger.error(
            `the s3 document of ${fullDocketEntry.documentContentsId} was not found in s3`,
            { err },
          );
        }
      }

      const caseDocketEntryMappingRecordId = `${fullDocketEntry.pk}_${fullDocketEntry.pk}|mapping`;

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
          NewImage: {
            ...AWS.DynamoDB.Converter.marshall(fullDocketEntry),
            case_relations: {
              name: 'document',
              parent: caseDocketEntryMappingRecordId,
            },
          },
        },
        eventName: 'MODIFY',
      };
    }),
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: newDocketEntryRecords,
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the docket entry records that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index docket entry records');
  }
};

const processWorkItemEntries = ({ applicationContext, workItemRecords }) =>
  processEntries({
    applicationContext,
    recordType: 'workItemRecords',
    records: workItemRecords,
  });

const processMessageEntries = async ({
  applicationContext,
  messageRecords,
}) => {
  if (!messageRecords.length) return;

  applicationContext.logger.debug(
    `going to index ${messageRecords.length} message records`,
  );

  const indexMessageEntry = async messageRecord => {
    const messageNewImage = messageRecord.dynamodb.NewImage;

    // go get the latest message if we're indexing a message with isRepliedTo set to false - it might
    // have been updated in dynamo since this record was created to be processed
    if (!messageNewImage.isRepliedTo.BOOL) {
      const latestMessageData = await applicationContext
        .getPersistenceGateway()
        .getMessage({
          applicationContext,
          docketNumber: messageNewImage.docketNumber.S,
          messageId: messageNewImage.messageId.S,
        });

      if (!latestMessageData.isRepliedTo) {
        const marshalledMessage =
          AWS.DynamoDB.Converter.marshall(latestMessageData);

        return {
          dynamodb: {
            Keys: {
              pk: {
                S: messageNewImage.pk.S,
              },
              sk: {
                S: messageNewImage.sk.S,
              },
            },
            NewImage: marshalledMessage,
          },
          eventName: 'MODIFY',
        };
      }
    } else {
      return messageRecord;
    }
  };

  const indexRecords = await Promise.all(messageRecords.map(indexMessageEntry));

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: compact(indexRecords),
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error('the records that failed to index', {
      failedRecords,
    });
    throw new Error('failed to index message records');
  }
};

const practitionerEntityTypes = ['PrivatePractitioner', 'IrsPractitioner'];
const practitionerSortKeys = ['privatePractitioner', 'irsPractitioner'];

const isPractitionerMappingRemoveRecord = record => {
  const oldImage = record.dynamodb.OldImage;
  if (oldImage) {
    const trimmedSk = oldImage.sk.S.split('|')[0];

    return (
      record.eventName === 'REMOVE' &&
      oldImage.entityName &&
      practitionerEntityTypes.includes(oldImage.entityName.S) &&
      oldImage.pk.S.startsWith('case|') &&
      practitionerSortKeys.includes(trimmedSk)
    );
  }

  return false;
};

const isPractitionerMappingInsertModifyRecord = record => {
  const newImage = record.dynamodb.NewImage;

  if (newImage) {
    const trimmedSk = newImage.sk.S.split('|')[0];

    return (
      newImage.entityName &&
      practitionerEntityTypes.includes(newImage.entityName.S) &&
      newImage.pk.S.startsWith('case|') &&
      practitionerSortKeys.includes(trimmedSk)
    );
  }

  return false;
};

const processPractitionerMappingEntries = async ({
  applicationContext,
  practitionerMappingRecords,
}) => {
  if (!practitionerMappingRecords.length) return;

  const indexCaseEntryForPractitionerMapping =
    async practitionerMappingRecord => {
      const practitionerMappingData =
        practitionerMappingRecord.dynamodb.NewImage ||
        practitionerMappingRecord.dynamodb.OldImage;
      const caseRecords = [];

      const caseMetadataWithCounsel = await applicationContext
        .getPersistenceGateway()
        .getCaseMetadataWithCounsel({
          applicationContext,
          docketNumber: practitionerMappingData.pk.S.substring('case|'.length),
        });

      const marshalledCase = AWS.DynamoDB.Converter.marshall(
        caseMetadataWithCounsel,
      );

      caseRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: practitionerMappingData.pk.S,
            },
            sk: {
              S: practitionerMappingData.pk.S,
            },
          },
          NewImage: {
            ...marshalledCase,
            case_relations: { name: 'case' },
            entityName: { S: 'CaseDocketEntryMapping' },
          }, // Create a mapping record on the docket-entry index for parent-child relationships
        },
        eventName: 'MODIFY',
      });

      caseRecords.push({
        dynamodb: {
          Keys: {
            pk: {
              S: practitionerMappingData.pk.S,
            },
            sk: {
              S: practitionerMappingData.sk.S,
            },
          },
          NewImage: marshalledCase,
        },
        eventName: 'MODIFY',
      });

      return caseRecords;
    };

  const indexRecords = await Promise.all(
    practitionerMappingRecords.map(indexCaseEntryForPractitionerMapping),
  );

  const { failedRecords } = await applicationContext
    .getPersistenceGateway()
    .bulkIndexRecords({
      applicationContext,
      records: flattenDeep(indexRecords),
    });

  if (failedRecords.length > 0) {
    applicationContext.logger.error(
      'the practitioner mapping record that failed to index',
      { failedRecords },
    );
    throw new Error('failed to index practitioner mapping records');
  }
};

const processOtherEntries = ({ applicationContext, otherRecords }) =>
  processEntries({
    applicationContext,
    recordType: 'otherRecords',
    records: otherRecords,
  });

exports.partitionRecords = partitionRecords;
exports.processPractitionerMappingEntries = processPractitionerMappingEntries;
exports.processDocketEntries = processDocketEntries;
exports.processMessageEntries = processMessageEntries;
exports.processOtherEntries = processOtherEntries;
exports.processRemoveEntries = processRemoveEntries;
exports.processWorkItemEntries = processWorkItemEntries;
exports.isPractitionerMappingRemoveRecord = isPractitionerMappingRemoveRecord;
exports.isPractitionerMappingInsertModifyRecord =
  isPractitionerMappingInsertModifyRecord;

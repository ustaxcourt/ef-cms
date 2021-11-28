const AWS = require('aws-sdk');
const { flattenDeep, partition } = require('lodash');
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
exports.processOtherEntries = processOtherEntries;
exports.processRemoveEntries = processRemoveEntries;
exports.isPractitionerMappingRemoveRecord = isPractitionerMappingRemoveRecord;
exports.isPractitionerMappingInsertModifyRecord =
  isPractitionerMappingInsertModifyRecord;

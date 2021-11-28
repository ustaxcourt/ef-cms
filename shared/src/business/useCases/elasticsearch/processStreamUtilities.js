const { partition } = require('lodash');
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

const processOtherEntries = ({ applicationContext, otherRecords }) =>
  processEntries({
    applicationContext,
    recordType: 'otherRecords',
    records: otherRecords,
  });

exports.partitionRecords = partitionRecords;
exports.processOtherEntries = processOtherEntries;
exports.isPractitionerMappingRemoveRecord = isPractitionerMappingRemoveRecord;
exports.isPractitionerMappingInsertModifyRecord =
  isPractitionerMappingInsertModifyRecord;

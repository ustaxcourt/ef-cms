const { isObject, isString } = require('lodash');

const userEntityNames = [
  'User',
  'PrivatePractitioner',
  'IrsPractitioner',
  'Practitioner',
];

const isRecordOfType = (record, type) => {
  let entityName;

  if (record && record.entityName && isString(record.entityName)) {
    ({ entityName } = record);
  } else if (record && isObject(record.entityName)) {
    entityName = record.entityName.S;
  }

  if (entityName) {
    if (type === 'User' && userEntityNames.includes(entityName)) {
      return true;
    }

    if (type == 'DocketEntry' && entityName === 'CaseDocketEntryMapping') {
      return true;
    }

    if (entityName === type) {
      return true;
    }
  }
};

exports.getIndexNameForRecord = record => {
  let index = null;

  if (isRecordOfType(record, 'Case')) {
    index = 'efcms-case';
  } else if (isRecordOfType(record, 'DocketEntry')) {
    index = 'efcms-docket-entry';
  } else if (isRecordOfType(record, 'User')) {
    index = 'efcms-user';
  } else if (isRecordOfType(record, 'Message')) {
    index = 'efcms-message';
  } else if (isRecordOfType(record, 'UserCase')) {
    index = 'efcms-user-case';
  } else if (isRecordOfType(record, 'CaseDeadline')) {
    index = 'efcms-case-deadline';
  }

  return index;
};

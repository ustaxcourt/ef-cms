exports.getIndexNameForRecord = record => {
  let index = null;

  const userEntityNames = [
    'User',
    'PrivatePractitioner',
    'IrsPractitioner',
    'Practitioner',
  ];

  const isRecordOfType = (record, type) => {
    if (record && record.entityName && record.entityName.S) {
      if (type === 'User' && userEntityNames.includes(record.entityName.S)) {
        return true;
      }

      if (record.entityName.S === type) {
        return true;
      }
    }
  };

  if (isRecordOfType(record, 'Case')) {
    index = 'efcms-case';
  } else if (isRecordOfType(record, 'Document')) {
    index = 'efcms-document';
  } else if (isRecordOfType(record, 'User')) {
    index = 'efcms-user';
  } else if (isRecordOfType(record, 'CaseMessage')) {
    index = 'efcms-message';
  } else if (isRecordOfType(record, 'UserCase')) {
    index = 'efcms-user-case';
  }

  return index;
};

exports.getIndexNameForRecord = record => {
  let index = 'efcms';

  const userEntityNames = [
    'User',
    'PrivatePractitioner',
    'IrsPractitioner',
    'Practitioner',
  ];

  const isRecordOfType = (record, type) => {
    if (record.entityName && record.entityName.S) {
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
  }

  return index;
};

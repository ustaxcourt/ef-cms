exports.getIndexNameForRecord = record => {
  let index = null;

  const userEntityNames = [
    'User',
    'PrivatePractitioner',
    'IrsPractitioner',
    'Practitioner',
  ];

  const isRecordOfType = (record, type) => {
    const entityName = record?.entityName?.S || record?.entityName;

    if (entityName) {
      if (type === 'User' && userEntityNames.includes(entityName)) {
        return true;
      }

      if (entityName === type) {
        return true;
      }
    }
  };

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
  }

  return index;
};

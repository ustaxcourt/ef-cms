exports.getIndexNameForRecord = document => {
  let index = 'efcms';

  const userValidationNames = [
    'User',
    'PrivatePractitioner',
    'IrsPractitioner',
    'Practitioner',
  ];

  const isCaseRecord = record => {
    if (
      (record.validationName && record.validationName === 'Case') ||
      (record.entityName && record.entityName === 'Case') ||
      (record.recordSk && record.recordSk.includes('case|'))
    ) {
      return true;
    }
  };

  const isDocumentRecord = record => {
    if (
      (record.validationName && record.validationName === 'Document') ||
      (record.entityName && record.entityName === 'Document') ||
      (record.recordSk && record.recordSk.includes('document|'))
    ) {
      return true;
    }
  };

  const isUserRecord = record => {
    if (
      (record.validationName &&
        userValidationNames.includes(record.validationName)) ||
      (record.entityName &&
        userValidationNames.includes(record.validationName)) ||
      (record.recordSk && record.recordSk.includes('user|'))
    ) {
      return true;
    }
  };

  if (isCaseRecord(document)) {
    index = 'efcms-case';
  } else if (isDocumentRecord(document)) {
    index = 'efcms-document';
  } else if (isUserRecord(document)) {
    index = 'efcms-user';
  }

  return index;
};

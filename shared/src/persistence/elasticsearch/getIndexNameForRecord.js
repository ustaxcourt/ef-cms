exports.getIndexNameForRecord = document => {
  let index = 'efcms';

  const userValidationNames = [
    'User',
    'PrivatePractitioner',
    'IrsPractitioner',
    'Practitioner',
  ];

  if (document.validationName) {
    if (document.validationName === 'Case') {
      index = 'efcms-case';
    } else if (document.validationName === 'Document') {
      index = 'efcms-document';
    } else if (userValidationNames.includes(document.validationName)) {
      index = 'efcms-user';
    }
  }

  return index;
};

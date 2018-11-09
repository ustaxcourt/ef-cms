exports.get = key => {
  return {
    DOCUMENTS_TABLE: process.env.STAGE ? `efcms-documents-${process.env.STAGE}` : 'efcms-documents-local',
    CASES_TABLE: process.env.STAGE ? `efcms-cases-${process.env.STAGE}` : 'efcms-cases-local',
  }[key];
}

exports.entityPersistenceLookup = key => {
  switch (key) {
    case 'files':
      return 'awsS3Persistence';
    case 'cases':
      return 'awsDynamoPersistence';
    default:
      throw new Error('unsupported key');
  }
};
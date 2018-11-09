exports.get = key => {
  return {
    DOCUMENTS_TABLE: process.env.STAGE ? `efcms-documents-${process.env.STAGE}` : 'efcms-documents-local',
  }[key];
}
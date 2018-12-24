const { fileDocument } = require('./utilities/fileDocument');

exports.associateDocumentToCase = async ({
  applicationContext,
  caseToUpdate,
  userId,
}) => {
  return fileDocument({
    userId,
    caseToUpdate,
    isRespondentDocument: false,
    applicationContext,
  });
};

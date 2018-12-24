const { fileDocument } = require('../utilities/fileDocument');

exports.associateRespondentDocumentToCase = async ({
  applicationContext,
  caseToUpdate,
  userId,
}) => {
  return fileDocument({
    userId,
    caseToUpdate,
    isRespondentDocument: true,
    applicationContext,
  });
};

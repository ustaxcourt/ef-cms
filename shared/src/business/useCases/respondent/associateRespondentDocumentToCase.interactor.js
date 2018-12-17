const { fileRespondentDocument } = require('./fileRespondentDocument');

exports.associateRespondentDocumentToCase = async ({
  applicationContext,
  caseToUpdate,
  userId,
}) => {
  return fileRespondentDocument({
    userId,
    caseToUpdate,
    applicationContext,
  });
};

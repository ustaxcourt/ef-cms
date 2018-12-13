const { fileRespondentDocument } = require('./fileRespondentDocument');
const Case = require('../../entities/Case');

exports.fileAnswer = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  return fileRespondentDocument({
    userId,
    caseToUpdate,
    document,
    documentType: Case.documentTypes.answer,
    applicationContext,
  });
};

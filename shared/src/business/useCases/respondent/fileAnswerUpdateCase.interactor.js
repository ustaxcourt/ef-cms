const { fileRespondentDocument } = require('./fileRespondentDocument');
const Case = require('../../entities/Case');

exports.fileAnswerUpdateCase = async ({
  userId,
  caseToUpdate,
  applicationContext,
}) => {
  console.log('caseToUpdate', caseToUpdate);
  return fileRespondentDocument({
    userId,
    caseToUpdate,
    documentType: Case.documentTypes.answer,
    applicationContext,
  });
};

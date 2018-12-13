const Case = require('../../entities/Case');
const { fileRespondentDocument } = require('./fileRespondentDocument');

exports.fileStipulatedDecision = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  return fileRespondentDocument({
    userId,
    caseToUpdate,
    document,
    documentType: Case.documentTypes.stipulatedDecision,
    applicationContext,
    workItemsToAdd: [
      {
        message: 'A stipulated decision is ready for review',
        sentBy: userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assigneeId: 'docketclerk',
        docketNumber: caseToUpdate.docketNumber,
        //document is added later
      },
    ],
  });
};

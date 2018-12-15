const Case = require('../../entities/Case');
const { fileRespondentDocument } = require('./fileRespondentDocument');

exports.fileStipulatedDecisionUpdateCase = async ({
  userId,
  caseToUpdate,
  applicationContext,
}) => {
  return fileRespondentDocument({
    userId,
    caseToUpdate,
    documentType: Case.documentTypes.stipulatedDecision,
    applicationContext,
    workItemsToAdd: [
      {
        messages: [
          {
            sender: 'Respondent',
            message: 'A stipulated decision is ready for review',
          },
        ],
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

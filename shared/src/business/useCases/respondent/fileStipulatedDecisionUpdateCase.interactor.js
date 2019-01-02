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
    rawWorkItemsToAdd: [
      {
        sentBy: userId,
        caseId: caseToUpdate.caseId,
        assigneeId: 'docketclerk',
        docketNumber: caseToUpdate.docketNumber,
        messages: [
          {
            message: `Stipulated Decision submitted`,
            createdAt: new Date().toISOString(),
          },
        ],
        assigneeName: 'Docket Clerk',
        caseTitle: `${
          caseToUpdate.petitioners[0].name
        } v. Commissioner of Internal Revenue, Respondent`,
        caseStatus: caseToUpdate.status,
      },
    ],
  });
};

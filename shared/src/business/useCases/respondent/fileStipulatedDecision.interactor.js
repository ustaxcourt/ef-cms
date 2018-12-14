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
        assigneName: 'Docket Clerk',
        caseTitle: `${
          caseToUpdate.petitioners[0].name
        } v. Commissioner of Internal Revenue, Respondent`,
        caseStatus: caseToUpdate.status,
      },
    ],
  });
};

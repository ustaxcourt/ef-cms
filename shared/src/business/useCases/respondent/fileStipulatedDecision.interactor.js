const {
  isAuthorized,
  FILE_STIPULATED_DECISION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');
const Case = require('../../entities/Case');

exports.fileStipulatedDecision = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_STIPULATED_DECISION)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
  }

  const documentId = await applicationContext
    .getPersistenceGateway()
    .uploadDocument({
      applicationContext,
      document,
    });

  await applicationContext.getUseCases().associateRespondentDocumentToCase({
    userId,
    caseToUpdate: {
      ...caseToUpdate,
      documents: [
        ...(caseToUpdate.documents || []),
        {
          documentId,
          documentType: Case.documentTypes.stipulatedDecision,
        },
      ],
      workItems: [
        ...(caseToUpdate.workItems || []),
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
    },
    applicationContext,
  });
};

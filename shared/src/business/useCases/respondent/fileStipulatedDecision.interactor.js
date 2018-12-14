const Case = require('../../entities/Case');
const { fileRespondentDocument } = require('./fileRespondentDocument');
const {
  isAuthorized,
  FILE_STIPULATED_DECISION,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

exports.fileStipulatedDecision = async ({
  userId,
  caseToUpdate,
  document,
  applicationContext,
}) => {
  if (!isAuthorized(userId, FILE_STIPULATED_DECISION)) {
    throw new UnauthorizedError('Unauthorized to upload a stipulated decision');
  }

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

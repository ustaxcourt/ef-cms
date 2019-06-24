const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/Case');

const setDocumentDetails = (userId, documents) => {
  if (documents && userId) {
    documents.forEach(document => {
      if (document.validated && !document.reviewDate) {
        document.reviewDate = new Date().toISOString();
        document.reviewUser = userId;
        document.status = 'reviewed';
      }
    });
  }

  return documents;
};

/**
 * updateCase
 *
 * @param caseId
 * @param caseToUpdate
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateCase = async ({ applicationContext, caseId, caseToUpdate }) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (!caseToUpdate || caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  if (caseToUpdate.documents) {
    caseToUpdate.documents = setDocumentDetails(
      user.userId,
      caseToUpdate.documents,
    );
  }

  const paidCase = new Case(caseToUpdate)
    .markAsPaidByPayGov(caseToUpdate.payGovDate)
    .setRequestForTrialDocketRecord(caseToUpdate.preferredTrialCity)
    .updateCaseTitleDocketRecord()
    .validate()
    .toRawObject();

  await applicationContext.getPersistenceGateway().updateCase({
    applicationContext,
    caseToUpdate: paidCase,
  });

  return paidCase;
};

const { Case } = require('../entities/Case');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../../authorization/authorizationClientService');
const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../../errors/errors');

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
exports.updateCase = async ({ caseToUpdate, caseId, applicationContext }) => {
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
    .updateCaptionDocketRecord()
    .validate()
    .toRawObject();

  const caseAfterUpdate = await applicationContext
    .getPersistenceGateway()
    .saveCase({
      applicationContext,
      caseToSave: paidCase,
    });

  return new Case(caseAfterUpdate).validate().toRawObject();
};

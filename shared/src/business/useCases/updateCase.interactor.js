const Case = require('../entities/Case');
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
exports.updateCase = async ({
  userId,
  caseToUpdate,
  caseId,
  applicationContext,
}) => {
  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (!caseToUpdate || caseId !== caseToUpdate.caseId) {
    throw new UnprocessableEntityError();
  }

  if (caseToUpdate.documents) {
    caseToUpdate.documents = setDocumentDetails(userId, caseToUpdate.documents);
  }

  const paidCase = new Case(caseToUpdate)
    .markAsPaidByPayGov(caseToUpdate.payGovDate)
    .validate()
    .toRawObject();

  const caseAfterUpdate = await applicationContext
    .getPersistenceGateway()
    .saveCase({
      caseToSave: paidCase,
      applicationContext,
    });

  return new Case(caseAfterUpdate).validate().toRawObject();
};

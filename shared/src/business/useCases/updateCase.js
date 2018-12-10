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
 * @param caseJson
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateCase = async ({
  caseId,
  caseJson,
  userId,
  applicationContext,
}) => {
  if (caseJson.documents) {
    caseJson.documents = setDocumentDetails(userId, caseJson.documents);
  }

  const caseToUpdate = new Case(caseJson).validate();

  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseId !== caseJson.caseId) {
    throw new UnprocessableEntityError();
  }

  caseToUpdate.markAsPaidByPayGov(caseJson.payGovDate).validate();
  console.log(caseToUpdate.toJSON())
  const caseAfterUpdate = await applicationContext
    .getPersistenceGateway()
    .saveCase({
      caseToSave: caseToUpdate.toJSON(),
      applicationContext,
    });

  return new Case(caseAfterUpdate).validate().toJSON();
};

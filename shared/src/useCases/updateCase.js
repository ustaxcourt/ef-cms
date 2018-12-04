const Case = require('../entities/Case');
const {
  isAuthorized,
  UPDATE_CASE,
} = require('../authorization/authorizationClientService');
const {
  UnprocessableEntityError,
  UnauthorizedError,
} = require('../errors/errors');

/**
 * updateCase
 *
 * @param caseId
 * @param caseJson
 * @param userId
 * @param applicationContext
 * @returns {*}
 */
exports.updateCase = ({ caseId, caseJson, userId, applicationContext }) => {
  const caseToUpdate = new Case(caseJson);
  caseToUpdate.validate();

  if (!isAuthorized(userId, UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  if (caseId !== caseJson.caseId) {
    throw new UnprocessableEntityError();
  }

  if (caseToUpdate.isPetitionPackageReviewed()) {
    caseJson.status = 'general';
  }
  if (caseToUpdate.payGovDate) {
    caseJson.payGovDate = caseToUpdate.payGovDate;
  }
  return applicationContext.persistence.saveCase({
    caseToSave: caseJson,
    applicationContext,
  });
};

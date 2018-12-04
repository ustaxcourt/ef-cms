const {
  isAuthorized,
  GET_CASE,
} = require('../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../errors/errors');
const Case = require('../entities/Case');

/**
 * getCase
 *
 * @param userId
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getCase = async ({ userId, caseId, applicationContext }) => {
  let caseRecord;

  if (Case.isValidCaseId(caseId)) {
    caseRecord = await applicationContext.persistence.getCaseByCaseId({
      caseId,
      applicationContext,
    });
  } else if (Case.isValidDocketNumber(caseId)) {
    //docketNumber
    const result = await applicationContext.persistence.getCaseByDocketNumber({
      docketNumber: caseId,
      applicationContext,
    });
    if (result && result.length) {
      caseRecord = result[0];
    }
  }

  if (!caseRecord) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (!isAuthorized(userId, GET_CASE, caseRecord.userId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return caseRecord;
};

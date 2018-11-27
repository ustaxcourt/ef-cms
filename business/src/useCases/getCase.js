const {
  isAuthorized,
  GET_CASE,
} = require('../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../errors/errors');
const Case = require('../entities/Case');

exports.getCase = async ({ userId, caseId, applicationContext }) => {
  let caseRecord;

  if (Case.isValidUUID(caseId)) {
    caseRecord = await applicationContext.persistence.getCaseByCaseId({
      caseId,
      applicationContext,
    });
  } else if (Case.isValidDocketNumber(caseId)) {
    //docketNumber
    caseRecord = await applicationContext.persistence.getCaseByDocketNumber({
      docketNumber: caseId,
      applicationContext,
    });
  }

  if (!caseRecord || (Array.isArray(caseRecord) && !caseRecord.length)) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (!isAuthorized(userId, GET_CASE, caseRecord.userId)) {
    throw new UnauthorizedError('Unauthorized');
  }

  return caseRecord;
};

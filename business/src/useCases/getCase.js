const {
  isAuthorized,
  GET_CASE,
} = require('../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../errors/errors');

exports.getCase = async ({ userId, caseId, applicationContext }) => {
  let caseRecord;
  const isUUID =
    caseId &&
    /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
      caseId,
    );
  if (isUUID) {
    caseRecord = await applicationContext.persistence.getCaseByCaseId({
      caseId,
      applicationContext,
    });
  } else if (caseId && /\d{5}-\d{2}/.test(caseId)) {
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

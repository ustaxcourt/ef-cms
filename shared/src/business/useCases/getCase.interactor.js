const {
  isAuthorized,
  GET_CASE,
} = require('../../authorization/authorizationClientService');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const Case = require('../entities/Case');

/**
 * getCase
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getCase = async ({ caseId, applicationContext }) => {
  let caseRecord;

  if (Case.isValidCaseId(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        caseId,
        applicationContext,
      });
  } else if (Case.isValidDocketNumber(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        docketNumber: Case.stripLeadingZeros(caseId),
        applicationContext,
      });
  }

  if (!caseRecord) {
    throw new NotFoundError(`Case ${caseId} was not found.`);
  }

  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      GET_CASE,
      caseRecord.userId,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  const myCase = new Case(caseRecord).validate();
  myCase.caseTitle = Case.getCaseTitle(myCase);
  return myCase.toRawObject();
};

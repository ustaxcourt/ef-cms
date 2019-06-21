const {
  GET_CASE,
  isAuthorized,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/Case');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

/**
 * getCase
 *
 * @param user
 * @param caseId
 * @param applicationContext
 * @returns {Promise<*>}
 */
exports.getCase = async ({ applicationContext, caseId }) => {
  let caseRecord;

  if (Case.isValidCaseId(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
  } else if (Case.isValidDocketNumber(caseId)) {
    caseRecord = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber: Case.stripLeadingZeros(caseId),
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

  const caseDetail = new Case(caseRecord).validate();
  return caseDetail.toRawObject();
};

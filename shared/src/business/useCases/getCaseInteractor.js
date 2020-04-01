const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case, isAssociatedUser } = require('../entities/cases/Case');
const { caseSealedFormatter } = require('../utilities/caseFilter');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');
const { PublicCase } = require('../entities/cases/PublicCase');

/**
 * getCaseInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.caseId the id of the case to get
 * @returns {object} the case data
 */
exports.getCaseInteractor = async ({ applicationContext, caseId }) => {
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
    const error = new NotFoundError(`Case ${caseId} was not found.`);
    error.skipLogging = true;
    throw error;
  }
  if (
    !isAuthorized(
      applicationContext.getCurrentUser(),
      ROLE_PERMISSIONS.GET_CASE,
      caseRecord.userId,
    )
  ) {
    throw new UnauthorizedError('Unauthorized');
  }

  let caseDetail;

  if (caseRecord.sealedDate) {
    let isAuthorizedUser =
      isAuthorized(
        applicationContext.getCurrentUser(),
        ROLE_PERMISSIONS.VIEW_SEALED_CASE,
        caseRecord.userId,
      ) ||
      isAssociatedUser({
        caseRaw: caseRecord,
        user: applicationContext.getCurrentUser(),
      });
    if (isAuthorizedUser) {
      caseDetail = new Case(caseRecord, {
        applicationContext,
      });
    } else {
      caseRecord = caseSealedFormatter(caseRecord);
      caseDetail = new PublicCase(caseRecord, {
        applicationContext,
      });
    }
  } else {
    caseDetail = new Case(caseRecord, {
      applicationContext,
    });
  }
  return caseDetail.validate().toRawObject();
};

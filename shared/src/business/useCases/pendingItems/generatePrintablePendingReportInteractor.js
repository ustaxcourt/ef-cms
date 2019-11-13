const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintablePendingReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.judge the optional judge filter
 * @param {string} providers.caseId the optional caseId filter
 * @returns {Array} the url of the document
 */
exports.generatePrintablePendingReportInteractor = async ({
  applicationContext,
  caseId,
  judge,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.PENDING_ITEMS)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (judge) {
    judge = decodeURIComponent(judge);
  }

  const pendingItems = await applicationContext
    .getUseCaseHelpers()
    .fetchPendingItems({ applicationContext, caseId, judge });

  let reportTitle = 'Pending Report Unfiltered';

  if (judge) {
    reportTitle = `Pending Report Judge ${judge}`;
  } else if (caseId) {
    const caseResult = await applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId({
        applicationContext,
        caseId,
      });
    reportTitle = `Pending Report for Docket ${caseResult.docketNumber}`;
  }

  return await applicationContext.getUseCaseHelpers().generatePendingReportPdf({
    applicationContext,
    pendingItems,
    reportTitle,
  });
};

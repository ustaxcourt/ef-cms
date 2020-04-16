const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../../errors/errors');

/**
 * generatePrintableCaseInventoryReportInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.associatedJudge the judge to filter by
 * @param {string} providers.status the status to filter by
 * @returns {Array} the url of the document
 */
exports.generatePrintableCaseInventoryReportInteractor = async ({
  applicationContext,
  associatedJudge,
  status,
}) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_INVENTORY_REPORT)) {
    throw new UnauthorizedError('Unauthorized for case inventory report');
  }

  if (!associatedJudge && !status) {
    throw new Error('Either judge or status must be provided');
  }

  const results = await applicationContext
    .getPersistenceGateway()
    .getCaseInventoryReport({ applicationContext, associatedJudge, status });

  return await applicationContext
    .getUseCaseHelpers()
    .generateCaseInventoryReportPdf({
      applicationContext,
      cases: results.foundCases,
      filters: { associatedJudge, status },
    });
};

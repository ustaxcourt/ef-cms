const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { PATTERNS } = require('../../business/utilities/DateHandler');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * getReconciliationReportInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.reconciliationDate the reconciliation date to to query
 * @returns {object} the report data
 */
exports.getReconciliationReportInteractor = async (
  applicationContext,
  { reconciliationDate },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const dateInputValid = PATTERNS.YYYYMMDD.test(reconciliationDate);
  if (!dateInputValid) {
    throw new Error('Date format must be YYYY-MM-DD');
  }

  const docketEntries = [];
  /*
  await applicationContext
    .getPersistenceGateway()
    .getReconciliationReport({
      applicationContext,
      reconciliationDate,
    });
    */

  const report = {
    docketEntries,
    reconciliationDate,
    reportTitle: 'Reconciliation Report',
    totalDocketEntries: docketEntries.length,
  };

  return report;
};

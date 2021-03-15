const {
  createEndOfDayISO,
  createStartOfDayISO,
  formatNow,
  FORMATS,
  PATTERNS,
} = require('../../business/utilities/DateHandler');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { UnauthorizedError } = require('../../errors/errors');

const isValidDate = dateString => {
  const dateInputValid = PATTERNS.YYYYMMDD.test(dateString);
  const todayDate = formatNow(FORMATS.YYYYMMDD);
  const dateLessthanOrEqualToToday = dateString <= todayDate;
  return dateInputValid && dateLessthanOrEqualToToday;
};

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

  // if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT)) {
  //   throw new UnauthorizedError('Unauthorized');
  // }

  const dateInputValid = isValidDate(reconciliationDate);
  if (!dateInputValid) {
    throw new Error(
      'Date must be formatted as YYYY-MM-DD and not later than today',
    );
  }

  const [year, month, day] = reconciliationDate.split('-');
  const reconciliationDateStart = createStartOfDayISO({ day, month, year });
  const reconciliationDateEnd = createEndOfDayISO({ day, month, year });

  const docketEntries = await applicationContext
    .getPersistenceGateway()
    .getReconciliationReport({
      applicationContext,
      reconciliationDateEnd,
      reconciliationDateStart,
    });

  // TODO: push docket entries through validation?

  const report = {
    docketEntries,
    reconciliationDate,
    reportTitle: 'Reconciliation Report',
    totalDocketEntries: docketEntries.length,
  };

  return report;
};

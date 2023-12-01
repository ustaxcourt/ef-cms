import { DocketEntryDynamoRecord } from '../../../../web-api/src/persistence/dynamo/dynamoTypes';
import {
  FORMATS,
  PATTERNS,
  createEndOfDayISO,
  createStartOfDayISO,
  formatNow,
} from '../../business/utilities/DateHandler';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ReconciliationReportEntry } from '../entities/ReconciliationReportEntry';
import { UnauthorizedError } from '@web-api/errors/errors';

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
export const getReconciliationReportInteractor = async (
  applicationContext: IApplicationContext,
  { reconciliationDate }: { reconciliationDate: string },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (reconciliationDate === 'today') {
    reconciliationDate = formatNow(FORMATS.YYYYMMDD);
  } else {
    const dateInputValid = isValidDate(reconciliationDate);
    if (!dateInputValid) {
      throw new Error(
        'Date must be formatted as YYYY-MM-DD and not later than today',
      );
    }
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

  await assignCaseCaptionFromPersistence(applicationContext, docketEntries);

  const report = {
    docketEntries: ReconciliationReportEntry.validateRawCollection(
      docketEntries,
      { applicationContext },
    ),
    reconciliationDate,
    reportTitle: 'Reconciliation Report',
    totalDocketEntries: docketEntries.length,
  };

  return report;
};

/**
 * assignCaseCaptionFromPersistence
 *  modifies docket entries by reference
 *
 * @param {object} applicationContext the application context
 * @param {string} docketEntries the docketEntries to assign case captions
 */
const assignCaseCaptionFromPersistence = async (
  applicationContext: IApplicationContext,
  docketEntries: DocketEntryDynamoRecord,
) => {
  const docketNumbers = docketEntries.map(e => {
    const docketNumber = e.docketNumber || e.pk.substr(e.pk.indexOf('|') + 1);
    e.docketNumber = docketNumber;
    return e.docketNumber;
  });
  const casesDetails = await applicationContext
    .getPersistenceGateway()
    .getCasesByDocketNumbers({ applicationContext, docketNumbers });

  docketEntries.forEach(docketEntry => {
    docketEntry.caseCaption = casesDetails.find(
      detail => detail.docketNumber === docketEntry.docketNumber,
    ).caseCaption;
  });
};

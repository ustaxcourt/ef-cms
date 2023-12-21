import { DocketEntryDynamoRecord } from '../../../../web-api/src/persistence/dynamo/dynamoTypes';
import {
  FORMATS,
  calculateDifferenceInHours,
  formatNow,
  isValidDateString,
  isValidReconciliationDate,
  normalizeIsoDateRange,
} from '../../business/utilities/DateHandler';
import { InvalidRequest } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ReconciliationReportEntry } from '../entities/ReconciliationReportEntry';
import { UnauthorizedError } from '@web-api/errors/errors';

const MAX_TIMESPAN_HOURS = 24;

function isValidTime(time: string): boolean {
  return isValidDateString(time, [FORMATS.TIME_24_HOUR]);
}

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
  {
    reconciliationDate,
    timeEnd,
    timeStart,
  }: {
    reconciliationDate: string;
    timeEnd?: string;
    timeStart?: string;
  },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const effectiveTimeStart = isValidTime(timeStart!) ? timeStart : '00:00';
  const effectiveTimeEnd = isValidTime(timeEnd!)
    ? `${timeEnd}:59.999`
    : '23:59:59.999';

  if (!isValidReconciliationDate(reconciliationDate)) {
    throw new InvalidRequest("Must be valid reconciliation date or 'today'");
  }

  const effectiveReconciliationDate =
    reconciliationDate == 'today'
      ? formatNow(FORMATS.YYYYMMDD)
      : reconciliationDate;

  //convert to full iso-8601 time stamps in utc timezone
  const { end: isoEnd, start: isoStart } = normalizeIsoDateRange(
    `${effectiveReconciliationDate}T${effectiveTimeStart}`,
    `${effectiveReconciliationDate}T${effectiveTimeEnd}`,
  );

  const hours = calculateDifferenceInHours(isoEnd, isoStart);
  if (hours > MAX_TIMESPAN_HOURS) {
    throw new InvalidRequest(
      `Range must not exceed ${MAX_TIMESPAN_HOURS} hours`,
    );
  }

  // const reconciliationDateStart = dtReconciliationDateStart.toISO();
  const docketEntries = await applicationContext
    .getPersistenceGateway()
    .getReconciliationReport({
      applicationContext,
      reconciliationDateEnd: isoEnd,
      reconciliationDateStart: isoStart,
    });

  await assignCaseCaptionFromPersistence(applicationContext, docketEntries);

  const report = {
    docketEntries: ReconciliationReportEntry.validateRawCollection(
      docketEntries,
      { applicationContext },
    ),
    reconciliationDate,
    reconciliationDateEnd: isoEnd,
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

import { DocketEntryDynamoRecord } from '@web-api/persistence/dynamo/dynamoTypes';
import {
  FORMATS,
  formatNow,
  isValidDateString,
  isValidReconciliationDate,
  normalizeIsoDateRange,
} from '@shared/business/utilities/DateHandler';
import { InvalidRequest } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ReconciliationReportEntry } from '@shared/business/entities/ReconciliationReportEntry';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCasesByDocketNumbers } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

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
    end: timeEnd,
    reconciliationDate,
    start: timeStart,
  }: {
    reconciliationDate: string;
    end?: string;
    start?: string;
  },
  authorizedUser: UnknownAuthUser,
) => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVICE_SUMMARY_REPORT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const effectiveTimeStart = isValidTime(timeStart!) ? timeStart : '00:00';
  const effectiveTimeEnd = isValidTime(timeEnd!)
    ? `${timeEnd}:59.999`
    : '23:59:59.999';

  const effectiveReconciliationDate =
    reconciliationDate == 'today'
      ? formatNow(FORMATS.YYYYMMDD)
      : reconciliationDate;

  if (!isValidReconciliationDate(effectiveReconciliationDate)) {
    throw new InvalidRequest(
      'Must be valid reconciliation date and not later than today',
    );
  }

  //convert to full iso-8601 time stamps in utc timezone
  const { end: isoEnd, start: isoStart } = normalizeIsoDateRange(
    `${effectiveReconciliationDate}T${effectiveTimeStart}`,
    `${effectiveReconciliationDate}T${effectiveTimeEnd}`,
  );

  // const reconciliationDateStart = dtReconciliationDateStart.toISO();
  const docketEntries = await applicationContext
    .getPersistenceGateway()
    .getReconciliationReport({
      applicationContext,
      reconciliationDateEnd: isoEnd,
      reconciliationDateStart: isoStart,
    });

  await assignCaseCaptionFromPersistence(docketEntries);

  const report = {
    docketEntries:
      ReconciliationReportEntry.validateRawCollection(docketEntries),
    reconciliationDate,
    reconciliationDateEnd: isoEnd,
    reportTitle: 'Reconciliation Report',
    totalDocketEntries: docketEntries.length,
  };

  return report;
};

const assignCaseCaptionFromPersistence = async (
  docketEntries: (DocketEntryDynamoRecord & { caseCaption?: string })[],
) => {
  const docketNumbers = docketEntries.map(e => {
    const docketNumber = e.docketNumber || e.pk.slice(e.pk.indexOf('|') + 1);
    e.docketNumber = docketNumber;
    return e.docketNumber;
  });
  const casesDetails = await getCasesByDocketNumbers({
    docketNumbers,
    excludeFields: [
      'docketEntries',
      'hearings',
      'correspondence',
      'privatePractitioners',
      'irsPractitioners',
    ],
  });

  if (!casesDetails) {
    throw new Error('No cases found for the given docket numbers');
  }

  docketEntries.forEach(docketEntry => {
    docketEntry.caseCaption = casesDetails.find(
      detail => detail.docketNumber === docketEntry.docketNumber,
    )?.caseCaption;
  });
};

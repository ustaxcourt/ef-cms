import { DateTime } from 'luxon';
import { DocketEntryDynamoRecord } from '../../../../web-api/src/persistence/dynamo/dynamoTypes';
import {
  FORMATS,
  USTC_TZ,
  formatNow,
  isValidISODate,
} from '../../business/utilities/DateHandler';

import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ReconciliationReportEntry } from '../entities/ReconciliationReportEntry';
import { UnauthorizedError } from '@web-api/errors/errors';

const isValidDate = dateString => {
  const dateInputValid = isValidISODate(dateString);
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
  {
    reconciliationDate,
    reconciliationDateEnd,
  }: { reconciliationDate: string; reconciliationDateEnd?: string },
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
      throw new Error('Date must be formatted as ISO and not later than today');
    }
  }

  //If no end date specified, set it to end of the same day as start date
  if (!reconciliationDateEnd) {
    reconciliationDateEnd = DateTime.fromISO(reconciliationDate, {
      zone: USTC_TZ,
    })
      .endOf('day')
      .toUTC()
      .toISO()!;
  } else {
    reconciliationDateEnd = DateTime.fromISO(reconciliationDateEnd, {
      zone: USTC_TZ,
    })
      .toUTC()
      .toISO()!;
  }

  const dtReconciliationDateStart = DateTime.fromISO(reconciliationDate, {
    zone: USTC_TZ,
  }).toUTC();

  const dtReconciliationDateEnd = DateTime.fromISO(reconciliationDateEnd);

  if (!dtReconciliationDateEnd.isValid) {
    throw new Error('End date must be formatted as ISO');
  }

  // make sure request doens't exceed 24 hours
  const diffHours = dtReconciliationDateEnd.diff(
    dtReconciliationDateStart,
    'hours',
  ).hours;
  if (diffHours > 24) {
    throw new Error('Time span must not exceed 24 hours');
  }

  const reconciliationDateStart = dtReconciliationDateStart.toISO();
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
    reconciliationDateEnd,
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

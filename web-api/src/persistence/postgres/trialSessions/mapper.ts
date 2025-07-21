import { RawTrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { NewTrialSessionKysely, TrialSessionKysely } from './schema';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import { TrialSessionProceedingType, TrialSessionScope, TrialSessionTypes } from '@shared/business/entities/EntityConstants';

// Select the relevant RawCase fields from dwCase and map them correctly.
export const toKyselyNewTrialSession = (
  rawTrialSession: RawTrialSession,
): NewTrialSessionKysely => {
  return {
    trialSessionId: rawTrialSession.trialSessionId,
    address1: rawTrialSession.address1,
    address2: rawTrialSession.address2,
    alternateTrialClerkName: rawTrialSession.alternateTrialClerkName,
    caseOrder: JSON.stringify(rawTrialSession.caseOrder),
    chambersPhoneNumber: rawTrialSession.chambersPhoneNumber,
    city: rawTrialSession.city,
    courthouseName: rawTrialSession.courthouseName,
    courtReporter: rawTrialSession.courtReporter,
    createdAt: rawTrialSession.createdAt
      ? calculateDate({ dateString: rawTrialSession.createdAt })
      : calculateDate({ dateString: formatNow() }),
    dismissedAlertForNOTT: rawTrialSession.dismissedAlertForNOTT,
    hasNOTTBeenServed: rawTrialSession.hasNOTTBeenServed,
    estimatedEndDate: rawTrialSession.estimatedEndDate
      ? calculateDate({ dateString: rawTrialSession.estimatedEndDate })
      : null,
    irsCalendarAdministrator: rawTrialSession.irsCalendarAdministrator,
    irsCalendarAdministratorInfo: JSON.stringify(
      rawTrialSession.irsCalendarAdministratorInfo,
    ),
    isCalendared: rawTrialSession.isCalendared,
    joinPhoneNumber: rawTrialSession.joinPhoneNumber,
    judge: JSON.stringify(rawTrialSession.judge),
    maxCases: rawTrialSession.maxCases,
    meetingId: rawTrialSession.meetingId,
    notes: rawTrialSession.notes,
    noticeIssuedDate: rawTrialSession.noticeIssuedDate
      ? calculateDate({ dateString: rawTrialSession.noticeIssuedDate })
      : null,
    password: rawTrialSession.password,
    postalCode: rawTrialSession.postalCode,
    proceedingType: rawTrialSession.proceedingType,
    sessionScope: rawTrialSession.sessionScope,
    sessionStatus: rawTrialSession.sessionStatus,
    sessionType: rawTrialSession.sessionType,
    startDate: calculateDate({ dateString: rawTrialSession.startDate }),
    startTime: rawTrialSession.startTime,
    state: rawTrialSession.state,
    swingSession: rawTrialSession.swingSession,
    swingSessionId: rawTrialSession.swingSessionId,
    term: rawTrialSession.term,
    termYear: rawTrialSession.termYear,
    trialClerk: rawTrialSession.trialClerk,
    trialLocation: rawTrialSession.trialLocation,
    paperServicePdfs: JSON.stringify(rawTrialSession.paperServicePdfs),
  };
};

export function fromKyselyTrialSession(
  record: TrialSessionKysely,
): RawTrialSession {
  return transformNullToUndefined({
    ...record,
    startDate: record.startDate.toISOString(),
    noticeIssuedDate: record.noticeIssuedDate?.toISOString(),
    estimatedEndDate: record.estimatedEndDate?.toISOString(),
    createdAt: record.createdAt.toISOString(),
    proceedingType: record.proceedingType as TrialSessionProceedingType,
    sessionScope: record.sessionScope as TrialSessionScope,
    sessionType: record.sessionType as TrialSessionTypes,
    caseOrder: record.caseOrder || []
  });
} 

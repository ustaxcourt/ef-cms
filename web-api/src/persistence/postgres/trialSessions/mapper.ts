import {
  RawTrialSession,
  TCaseOrder,
} from '@shared/business/entities/trialSessions/TrialSession';
import {
  calculateDate,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import {
  NewTrialSessionCaseKysely,
  NewTrialSessionKysely,
  NewTrialSessionWorkingCopyKysely,
  TrialSessionCaseKysely,
  TrialSessionKysely,
  TrialSessionWorkingCopyKysely,
} from './schema';
import { transformNullToUndefined } from '../utils/transformNullToUndefined';
import {
  TrialSessionProceedingType,
  TrialSessionScope,
  TrialSessionTypes,
} from '@shared/business/entities/EntityConstants';
import { RawTrialSessionWorkingCopy } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';

// Select the relevant RawCase fields from dwCase and map them correctly.
export function toKyselyNewTrialSession(
  rawTrialSession: Omit<RawTrialSession, 'paperServicePdfs'>,
): NewTrialSessionKysely {
  return {
    trialSessionId: rawTrialSession.trialSessionId,
    address1: rawTrialSession.address1,
    address2: rawTrialSession.address2,
    alternateTrialClerkName: rawTrialSession.alternateTrialClerkName,
    chambersPhoneNumber: rawTrialSession.chambersPhoneNumber,
    city: rawTrialSession.city,
    courthouseName: rawTrialSession.courthouseName,
    courtReporter: rawTrialSession.courtReporter,
    createdAt: rawTrialSession.createdAt
      ? calculateDate({ dateString: rawTrialSession.createdAt })
      : calculateDate({ dateString: formatNow() }),
    dismissedAlertForNott: rawTrialSession.dismissedAlertForNott,
    hasNottBeenServed: rawTrialSession.hasNottBeenServed,
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
  };
}

export function fromKyselyTrialSession(
  record: TrialSessionKysely,
  paperPdfs: {
    fileId: string;
    title: string;
    trialSessionId?: string;
    ttl?: string;
  }[],
  caseOrder: TrialSessionCaseKysely[]
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
    caseOrder: caseOrder?.map(co => fromKyselyTrialSessionCase(co)) || [],
    paperServicePdfs: paperPdfs?.map(pdf => ({
      fileId: pdf.fileId,
      title: pdf.title,
    })) || [],
  });
}

export function toKyselyNewTrialSessionCase(
  trialSessionCase: TCaseOrder & {
    trialSessionId: string;
    isHearing: boolean;
  },
): NewTrialSessionCaseKysely {
  return {
    ...trialSessionCase,
    removedFromTrialDate: trialSessionCase.removedFromTrialDate
      ? calculateDate({ dateString: trialSessionCase.removedFromTrialDate })
      : null,
    addedToSessionAt: calculateDate({
      dateString: trialSessionCase.addedToSessionAt,
    }),
  };
}

export function toKyselyNewTrialSessionWorkingCopy(
  rawTrialSessionWorkingCopy: RawTrialSessionWorkingCopy,
): NewTrialSessionWorkingCopyKysely {
  return {
    trialSessionId: rawTrialSessionWorkingCopy.trialSessionId,
    caseMetadata: JSON.stringify(rawTrialSessionWorkingCopy.caseMetadata),
    filters: JSON.stringify(rawTrialSessionWorkingCopy.filters),
    sessionNotes: rawTrialSessionWorkingCopy.sessionNotes,
    sort: rawTrialSessionWorkingCopy.sort,
    sortOrder: rawTrialSessionWorkingCopy.sortOrder,
    userId: rawTrialSessionWorkingCopy.userId,
  };
}

export function fromKyselyNewTrialSessionWorkingCopy(
  trialSessionWorkingCopy: TrialSessionWorkingCopyKysely,
): RawTrialSessionWorkingCopy {
  return transformNullToUndefined({
    ...trialSessionWorkingCopy,
    sortOrder: (trialSessionWorkingCopy.sortOrder || 'asc') as 'asc' | 'desc',
    sort: trialSessionWorkingCopy.sort || 'docket',
  });
}

export function fromKyselyTrialSessionCase (
  caseOrder: TrialSessionCaseKysely
): TCaseOrder {
  return transformNullToUndefined({
    ...caseOrder,
    addedToSessionAt: caseOrder.addedToSessionAt.toISOString(),
    removedFromTrialDate: caseOrder.removedFromTrialDate?.toISOString()
  });
}

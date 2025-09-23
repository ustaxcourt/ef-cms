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
    irsCalendarAdministratorInfoName:
      rawTrialSession.irsCalendarAdministratorInfo?.name,
    irsCalendarAdministratorInfoEmail:
      rawTrialSession.irsCalendarAdministratorInfo?.email,
    irsCalendarAdministratorInfoPhone:
      rawTrialSession.irsCalendarAdministratorInfo?.phone,
    isCalendared: rawTrialSession.isCalendared,
    joinPhoneNumber: rawTrialSession.joinPhoneNumber,
    judgeName: rawTrialSession?.judge?.name,
    judgeUserId: rawTrialSession?.judge?.userId,
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
    trialClerkName: rawTrialSession.trialClerk?.name,
    trialClerkUserId: rawTrialSession.trialClerk?.userId,
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
  caseOrder: TrialSessionCaseKysely[],
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
    paperServicePdfs:
      paperPdfs?.map(pdf => ({
        fileId: pdf.fileId,
        title: pdf.title,
      })) || [],
    judge:
      record.judgeName && record.judgeUserId
        ? { name: record.judgeName, userId: record.judgeUserId }
        : undefined,
    trialClerk:
      record.trialClerkName && record.trialClerkUserId
        ? { name: record.trialClerkName, userId: record.trialClerkUserId }
        : undefined,
    irsCalendarAdministratorInfo:
      record.irsCalendarAdministratorInfoEmail &&
      record.irsCalendarAdministratorInfoName &&
      record.irsCalendarAdministratorInfoPhone
        ? {
            email: record.irsCalendarAdministratorInfoEmail,
            name: record.irsCalendarAdministratorInfoName,
            phone: record.irsCalendarAdministratorInfoPhone,
          }
        : undefined,
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
    addedToSessionAt: trialSessionCase.addedToSessionAt
      ? calculateDate({
          dateString: trialSessionCase.addedToSessionAt,
        })
      : null,
  };
}

export function fromKyselyTrialSessionCase(
  caseOrder: TrialSessionCaseKysely,
): TCaseOrder {
  return transformNullToUndefined({
    ...caseOrder,
    addedToSessionAt: caseOrder.addedToSessionAt?.toISOString(),
    removedFromTrialDate: caseOrder.removedFromTrialDate?.toISOString(),
  });
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

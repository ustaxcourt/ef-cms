
import { TrialSession } from '@shared/business/entities/trialSessions/TrialSession';
import {
    calculateDate,
    formatNow,
} from '@shared/business/utilities/DateHandler';

// Select the relevant RawCase fields from dwCase and map them correctly.
export const toKyselyNewTrialSession = (rawTrialSession: TrialSession) => {
    return {
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
        irsCalendarAdministratorInfo: JSON.stringify(rawTrialSession.irsCalendarAdministratorInfo),
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
        startDate: rawTrialSession.startDate
            ? calculateDate({ dateString: rawTrialSession.startDate })
            : null,
        startTime: rawTrialSession.startTime,
        state: rawTrialSession.state,
        swingSession: rawTrialSession.swingSession,
        swingSessionId: rawTrialSession.swingSessionId,
        term: rawTrialSession.term,
        termYear: rawTrialSession.termYear,
        trialClerk: rawTrialSession.trialClerk,
        trialLocation: rawTrialSession.trialLocation,
        paperServicePdfs: JSON.stringify(rawTrialSession.paperServicePdfs)
    };
};

export function fromKyselyTrialSession(record: TrialSession) {
    return record;
}

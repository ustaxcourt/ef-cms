import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { Selectable, Insertable, ColumnType } from 'kysely';

const DEFAULT = {};

export const trialSessionTableDefinition = {
    address1: DEFAULT as string,
    address2: DEFAULT as string,
    alternateTrialClerkName: DEFAULT as string,
    caseOrder: DEFAULT as ColumnType<TCaseOrder[], string, string>,
    chambersPhoneNumber: DEFAULT as string,
    city: DEFAULT as string,
    courthouseName: DEFAULT as string,
    courtReporter: DEFAULT as string,
    createdAt: DEFAULT as Date,
    dismissedAlertForNOTT: DEFAULT as boolean,
    hasNOTTBeenServed: DEFAULT as boolean,
    estimatedEndDate: DEFAULT as string,
    irsCalendarAdministrator: DEFAULT as string,
    irsCalendarAdministratorInfo: DEFAULT as any,
    isCalendared: DEFAULT as boolean,
    joinPhoneNumber: DEFAULT as string,
    judge: DEFAULT as any,
    maxCases: DEFAULT as number,
    meetingId: DEFAULT as string,
    notes: DEFAULT as string,
    noticeIssuedDate: DEFAULT as string,
    password: DEFAULT as string,
    postalCode: DEFAULT as string,
    proceedingType: DEFAULT as string,
    sessionScope: DEFAULT as string,
    sessionStatus: DEFAULT as string,
    sessionType: DEFAULT as string,
    startDate: DEFAULT as string,
    startTime: DEFAULT as string,
    state: DEFAULT as string,
    swingSession: DEFAULT as boolean,
    swingSessionId: DEFAULT as string,
    term: DEFAULT as string,
    termYear: DEFAULT as string,
    trialClerk: DEFAULT as any,
    trialLocation: DEFAULT as string,
    paperServicePdfs: DEFAULT as any[],
};

export type TrialSessionTable = typeof trialSessionTableDefinition;

export const DW_TRIAL_SESSION_COLUMNS = Object.keys(
    trialSessionTableDefinition,
) as Array<keyof TrialSessionTable>;

export type TrialSessionKysely = Selectable<TrialSessionTable>;
export type NewTrialSessionKysely = Insertable<TrialSessionTable>;

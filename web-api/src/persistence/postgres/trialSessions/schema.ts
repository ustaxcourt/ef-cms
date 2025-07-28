import { TCaseOrder } from '@shared/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopyCaseMetadata } from '@shared/business/entities/trialSessions/TrialSessionWorkingCopy';
import { Selectable, Insertable, ColumnType } from 'kysely';

const DEFAULT = {};

export const trialSessionTableDefinition = {
  trialSessionId: DEFAULT as string,
  address1: DEFAULT as string | null,
  address2: DEFAULT as string | null,
  alternateTrialClerkName: DEFAULT as string | null,
  caseOrder: DEFAULT as ColumnType<TCaseOrder[], string, string>,
  chambersPhoneNumber: DEFAULT as string | null,
  city: DEFAULT as string | null,
  courthouseName: DEFAULT as string | null,
  courtReporter: DEFAULT as string | null,
  createdAt: DEFAULT as Date,
  dismissedAlertForNOTT: DEFAULT as boolean | null,
  hasNOTTBeenServed: DEFAULT as boolean,
  estimatedEndDate: DEFAULT as Date | null,
  irsCalendarAdministrator: DEFAULT as string | null,
  irsCalendarAdministratorInfo: DEFAULT as any,
  isCalendared: DEFAULT as boolean,
  joinPhoneNumber: DEFAULT as string | null,
  judge: DEFAULT as any,
  maxCases: DEFAULT as number | null,
  meetingId: DEFAULT as string | null,
  notes: DEFAULT as string | null,
  noticeIssuedDate: DEFAULT as Date | null,
  password: DEFAULT as string | null,
  postalCode: DEFAULT as string | null,
  proceedingType: DEFAULT as string,
  sessionScope: DEFAULT as string,
  sessionStatus: DEFAULT as string,
  sessionType: DEFAULT as string,
  startDate: DEFAULT as Date,
  startTime: DEFAULT as string | null,
  state: DEFAULT as string | null,
  swingSession: DEFAULT as boolean | null,
  swingSessionId: DEFAULT as string | null,
  term: DEFAULT as string,
  termYear: DEFAULT as string,
  trialClerk: DEFAULT as any,
  trialLocation: DEFAULT as string | null,
};

export type TrialSessionTable = typeof trialSessionTableDefinition;

export const DW_TRIAL_SESSION_COLUMNS = Object.keys(
  trialSessionTableDefinition,
) as Array<keyof TrialSessionTable>;

export type TrialSessionKysely = Selectable<TrialSessionTable>;
export type NewTrialSessionKysely = Insertable<TrialSessionTable>;

//////////////////////////////

export const trialSessionWorkingCopyTableDefinition = {
  trialSessionId: DEFAULT as string,
  caseMetadata: DEFAULT as ColumnType<
    TrialSessionWorkingCopyCaseMetadata,
    string,
    string
  >,
  filters: DEFAULT as any,
  sessionNotes: DEFAULT as string | null,
  sort: DEFAULT as string | null,
  sortOrder: DEFAULT as string | null,
  userId: DEFAULT as string,
};

export type TrialSessionWorkingCopyTable =
  typeof trialSessionWorkingCopyTableDefinition;

export const DW_TRIAL_SESSION_WORKING_COPY_COLUMNS = Object.keys(
  trialSessionWorkingCopyTableDefinition,
) as Array<keyof TrialSessionWorkingCopyTable>;

export type TrialSessionWorkingCopyKysely =
  Selectable<TrialSessionWorkingCopyTable>;
export type NewTrialSessionWorkingCopyKysely =
  Insertable<TrialSessionWorkingCopyTable>;

///////////////////////////

export const trialSessionPaperPdfTableDefinition = {
  trialSessionId: DEFAULT as string,
  ttl: DEFAULT as number,
  fileId: DEFAULT as string,
  title: DEFAULT as string,
};

export type TrialSessionPaperPdfTable =
  typeof trialSessionPaperPdfTableDefinition;

export const DW_TRIAL_SESSION_PAPER_PDF_COLUMNS = Object.keys(
  trialSessionPaperPdfTableDefinition,
) as Array<keyof TrialSessionPaperPdfTable>;

export type TrialSessionPaperPdfKysely = Selectable<TrialSessionPaperPdfTable>;
export type NewTrialSessionPaperPdfKysely =
  Insertable<TrialSessionPaperPdfTable>;

////////////////////////////

export type trialSessionNotificationProcessingStatusType = 'complete' | 'processing';
export type trialSessionNotificationProcessingCaseStatusType = 'processing' | 'processed';

export const trialSessionNotificationProcessingTableDefinition = {
  trialSessionId: DEFAULT as string,
  caseStatuses: DEFAULT as any,
  status: DEFAULT as string,
  unfinishedCases: DEFAULT as number,
};

export type TrialSessionNotificationProcessingTable =
  typeof trialSessionNotificationProcessingTableDefinition;

export const DW_TRIAL_SESSION_NOTIFICATION_PROCESSING = Object.keys(
  trialSessionNotificationProcessingTableDefinition,
) as Array<keyof TrialSessionNotificationProcessingTable>;

export type TrialSessionNotificationProcessingKysely =
  Selectable<TrialSessionNotificationProcessingTable>;
export type NewTrialSessionNotificationProcessingKysely =
  Insertable<TrialSessionNotificationProcessingTable>;

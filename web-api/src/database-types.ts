import { ColumnType, Insertable, Selectable, Updateable } from 'kysely';

export interface Database {
  dwCase: CaseTable;
  dwCaseCorrespondence: CaseCorrespondenceTable;
  dwCaseDeadline: CaseDeadlineTable;
  dwCaseWorksheet: CaseWorksheetTable;
  dwMessage: MessageTable;
  dwUserCaseNote: UserCaseNoteTable;
  dwWorkItem: WorkItemTable;
  dwFeatureFlag: FeatureFlagTable;
}

export interface FeatureFlagTable {
  name: string;
  value: { current: any };
}
export interface MessageTable {
  attachments?: ColumnType<{ documentId: string }[], string, string>;
  completedAt?: Date;
  completedBy?: string;
  completedBySection?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: Date;
  docketNumber: string;
  from: string;
  fromSection: string;
  fromUserId: string;
  isCompleted: boolean;
  isRead: boolean;
  isRepliedTo: boolean;
  leadDocketNumber?: string;
  message: string;
  messageId: string;
  parentMessageId: string;
  subject: string;
  to: string;
  toSection: string;
  toUserId: string;
}

export type MessageKysely = Selectable<MessageTable>;
export type NewMessageKysely = Insertable<MessageTable>;
export type UpdateMessageKysely = Updateable<MessageTable>;

export interface CaseTable {
  caption: string;
  docketNumber: string;
  docketNumberSuffix?: string;
  leadDocketNumber?: string;
  status: string;
  trialDate?: Date;
  trialLocation?: string;
}

export type CaseKysely = Selectable<CaseTable>;
export type NewCaseKysely = Insertable<CaseTable>;
export type UpdateCaseKysely = Updateable<CaseTable>;

export interface CaseCorrespondenceTable {
  archived?: boolean;
  correspondenceId: string;
  documentTitle: string;
  filedBy?: string;
  filingDate: Date;
  userId: string;
  docketNumber: string;
}

export type CaseCorrespondenceKysely = Selectable<CaseCorrespondenceTable>;
export type NewCaseCorrespondenceKysely = Insertable<CaseCorrespondenceTable>;
export type UpdateCaseCorrespondenceKysely =
  Updateable<CaseCorrespondenceTable>;

export interface CaseDeadlineTable {
  associatedJudge: string;
  associatedJudgeId?: string;
  caseDeadlineId: string;
  createdAt: Date;
  deadlineDate: Date;
  description: string;
  docketNumber: string;
  sortableDocketNumber: number;
}

export type CaseDeadlineKysely = Selectable<CaseDeadlineTable>;
export type NewCaseDeadlineKysely = Insertable<CaseDeadlineTable>;
export type UpdateCaseDeadlineKysely = Updateable<CaseDeadlineTable>;

export interface CaseWorksheetTable {
  docketNumber: string;
  finalBriefDueDate?: Date | null;
  primaryIssue?: string;
  statusOfMatter?: string;
  judgeUserId?: string;
}

export type CaseWorksheetKysely = Selectable<CaseWorksheetTable>;
export type NewCaseWorksheetKysely = Insertable<CaseWorksheetTable>;
export type UpdateCaseWorksheetKysely = Updateable<CaseWorksheetTable>;
export interface WorkItemTable {
  assigneeId?: string;
  assigneeName?: string;
  associatedJudge: string;
  associatedJudgeId?: string;
  caseIsInProgress?: boolean;
  completedAt?: Date;
  completedBy?: string;
  completedByUserId?: string;
  completedMessage?: string;
  createdAt: Date;
  docketEntry: any;
  docketNumber: string;
  hideFromPendingMessages?: boolean;
  highPriority?: boolean;
  inProgress?: boolean;
  isInitializeCase?: boolean;
  isRead?: boolean;
  section: string;
  sentBy: string;
  sentBySection?: string;
  sentByUserId?: string;
  updatedAt: Date;
  workItemId: string;
}

export type WorkItemKysely = Selectable<WorkItemTable>;
export type NewWorkItemKysely = Insertable<WorkItemTable>;
export type UpdateWorkItemKysely = Updateable<WorkItemTable>;
export interface UserCaseNoteTable {
  docketNumber: string;
  userId: string;
  notes?: string;
}

export type UserCaseNoteKysely = Selectable<UserCaseNoteTable>;
export type NewUserCaseNoteKysely = Insertable<UserCaseNoteTable>;
export type UpdateUserCaseNoteKysely = Updateable<UserCaseNoteTable>;

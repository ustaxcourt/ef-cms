import { CASE_STATUS_TYPES, CHIEF_JUDGE } from './EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { WORK_ITEM_VALIDATION_RULES } from './EntityValidationConstants';
import { createISODateString } from '../utilities/DateHandler';
import { pick } from 'lodash';

export class WorkItem extends JoiValidationEntity {
  public assigneeId: string;
  public assigneeName: string;
  public associatedJudge: string;
  public associatedJudgeId: string;
  public caseIsInProgress: boolean;
  public caseStatus: string;
  public caseTitle: string;
  public completedAt: string;
  public completedBy: string;
  public completedByUserId: string;
  public completedMessage: string;
  public createdAt: string;
  public docketEntry: any;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public hideFromPendingMessages?: boolean;
  public highPriority: boolean;
  public inProgress?: boolean;
  public isInitializeCase: boolean;
  public isRead?: boolean;
  public leadDocketNumber?: string;
  public section: string;
  public sentBy: string;
  public sentBySection: string;
  public sentByUserId: string;
  public trialDate?: string;
  public trialLocation?: string;
  public updatedAt: string;
  public workItemId: string;

  constructor(rawWorkItem, { applicationContext }, caseEntity?: Case) {
    super('WorkItem');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.assigneeId = rawWorkItem.assigneeId;
    this.assigneeName = rawWorkItem.assigneeName;
    this.associatedJudge =
      caseEntity && caseEntity.associatedJudge
        ? caseEntity.associatedJudge
        : rawWorkItem.associatedJudge || CHIEF_JUDGE;
    this.associatedJudgeId =
      caseEntity && caseEntity.associatedJudgeId
        ? caseEntity.associatedJudgeId
        : rawWorkItem.associatedJudgeId || undefined;
    this.caseIsInProgress = rawWorkItem.caseIsInProgress;
    this.caseStatus = caseEntity ? caseEntity.status : rawWorkItem.caseStatus;
    this.caseTitle = rawWorkItem.caseTitle;
    this.completedAt = rawWorkItem.completedAt;
    this.completedBy = rawWorkItem.completedBy;
    this.completedByUserId = rawWorkItem.completedByUserId;
    this.completedMessage = rawWorkItem.completedMessage;
    this.createdAt = rawWorkItem.createdAt || createISODateString();
    this.docketEntry = pick(rawWorkItem.docketEntry, [
      'additionalInfo',
      'createdAt',
      'descriptionDisplay',
      'docketEntryId',
      'documentTitle',
      'documentType',
      'eventCode',
      'filedBy',
      'index',
      'isFileAttached',
      'isPaper',
      'otherFilingParty',
      'receivedAt',
      'sentBy',
      'servedAt',
      'userId',
    ]);

    this.docketNumber = rawWorkItem.docketNumber;
    this.leadDocketNumber = caseEntity
      ? caseEntity.leadDocketNumber
      : rawWorkItem.leadDocketNumber;
    this.docketNumberWithSuffix = caseEntity
      ? caseEntity.docketNumberWithSuffix
      : rawWorkItem.docketNumberWithSuffix;
    this.hideFromPendingMessages = rawWorkItem.hideFromPendingMessages;
    this.highPriority =
      rawWorkItem.highPriority ||
      caseEntity?.status === CASE_STATUS_TYPES.calendared ||
      rawWorkItem.caseStatus === CASE_STATUS_TYPES.calendared;
    this.inProgress = rawWorkItem.inProgress;
    this.isInitializeCase = rawWorkItem.isInitializeCase;
    this.isRead = rawWorkItem.isRead;
    this.section = rawWorkItem.section;
    this.sentBy = rawWorkItem.sentBy;
    this.sentBySection = rawWorkItem.sentBySection;
    this.sentByUserId = rawWorkItem.sentByUserId;
    this.trialDate = caseEntity ? caseEntity.trialDate : rawWorkItem.trialDate;
    this.trialLocation = caseEntity
      ? caseEntity.trialLocation
      : rawWorkItem.trialLocation;
    this.updatedAt = rawWorkItem.updatedAt || createISODateString();
    this.workItemId =
      rawWorkItem.workItemId || applicationContext.getUniqueId();
  }

  assignToUser({
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  }: {
    assigneeId: string;
    assigneeName: string;
    section: string;
    sentBy: string;
    sentBySection: string;
    sentByUserId: string;
  }): WorkItem {
    Object.assign(this, {
      assigneeId,
      assigneeName,
      section,
      sentBy,
      sentBySection,
      sentByUserId,
    });

    return this;
  }

  setStatus(caseStatus: string): void {
    this.caseStatus = caseStatus;
  }

  setAsCompleted({
    message,
    user,
  }: {
    message: string;
    user: { name: string; userId: string };
  }): WorkItem {
    this.completedAt = createISODateString();
    this.completedBy = user.name;
    this.completedByUserId = user.userId;
    this.completedMessage = message;

    delete this.inProgress;

    return this;
  }

  isCompleted(): boolean {
    return !!this.completedAt;
  }

  markAsRead(): WorkItem {
    this.isRead = true;

    return this;
  }

  getValidationRules() {
    return WORK_ITEM_VALIDATION_RULES;
  }
}

export type RawWorkItem = ExcludeMethods<WorkItem>;

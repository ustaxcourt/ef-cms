import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import { getUniqueId } from '@shared/sharedAppContext';
import { pick } from 'lodash';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import joi from 'joi';

export class WorkItem extends JoiValidationEntity {
  public assigneeId?: string;
  public assigneeName?: string;
  // public associatedJudge: string; // 10103: belongs to another entity
  // public associatedJudgeId?: string; // 10103: belongs to another entity
  // public caseIsInProgress?: boolean; // 10103: belongs to another entity
  // public caseStatus: string; // 10103: belongs to another entity
  // public caseTitle?: string; // 10103: belongs to another entity
  public completedAt?: string;
  public completedBy?: string;
  public completedByUserId?: string;
  public completedMessage?: string;
  public createdAt: string;
  public docketEntry: any; // 10103: Should this be removed? Instead point at the docketEntryId?
  public docketNumber: string;
  // public hideFromPendingMessages?: boolean; 10103: I only see us setting this value. never reading it.
  // public highPriority?: boolean; // 10103: belongs to another entity
  public inProgress?: boolean;
  // public isInitializeCase?: boolean; 10103: I only see us setting this value. never reading it.
  public isRead?: boolean;
  // public leadDocketNumber?: string; // 10103: belongs to another entity
  public section: string;
  public sentBy: string;
  public sentBySection?: string;
  public sentByUserId?: string;
  // public trialDate?: string; // 10103: belongs to another entity
  // public trialLocation?: string; // 10103: belongs to another entity
  public updatedAt: string;
  public workItemId: string;

  constructor(rawWorkItem) {
    super('WorkItem');

    this.assigneeId = rawWorkItem.assigneeId;
    this.assigneeName = rawWorkItem.assigneeName;
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
    this.inProgress = rawWorkItem.inProgress;
    this.isRead = rawWorkItem.isRead;
    this.section = rawWorkItem.section;
    this.sentBy = rawWorkItem.sentBy;
    this.sentBySection = rawWorkItem.sentBySection;
    this.sentByUserId = rawWorkItem.sentByUserId;
    this.updatedAt = rawWorkItem.updatedAt || createISODateString();
    this.workItemId = rawWorkItem.workItemId || getUniqueId();
  }

  static VALIDATION_RULES = {
    assigneeId: JoiValidationConstants.UUID.allow(null).optional(),
    assigneeName: JoiValidationConstants.STRING.max(100).allow(null).optional(), // should be a Message entity at some point
    completedAt: JoiValidationConstants.ISO_DATE.optional(),
    completedBy: JoiValidationConstants.STRING.max(100).optional().allow(null),
    completedByUserId: JoiValidationConstants.UUID.optional().allow(null),
    completedMessage: JoiValidationConstants.STRING.max(100)
      .optional()
      .allow(null),
    createdAt: JoiValidationConstants.ISO_DATE.optional(),
    // TODO: validate DocketEntry in WorkItem
    // docketEntry: joi.object().keys(DOCKET_ENTRY_VALIDATION_RULE_KEYS).required(),
    docketEntry: joi.object().required(),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
      'Unique case identifier in XXXXX-YY format.',
    ),
    entityName: JoiValidationConstants.STRING.valid('WorkItem').required(),
    inProgress: joi.boolean().optional(),
    isRead: joi.boolean().optional(),
    section: JoiValidationConstants.STRING.required(),
    sentBy: JoiValidationConstants.STRING.max(100)
      .required()
      .description('The name of the user that sent the WorkItem'),
    sentBySection: JoiValidationConstants.STRING.optional(),
    sentByUserId: JoiValidationConstants.UUID.optional(),
    updatedAt: JoiValidationConstants.ISO_DATE.required(),
    workItemId: JoiValidationConstants.UUID.required(),
  };

  static isHighPriority(aCase: { status?: string }): boolean {
    return aCase?.status === CASE_STATUS_TYPES.calendared;
  }

  assignToUser({
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  }: {
    assigneeId?: string;
    assigneeName?: string;
    section: string;
    sentBy: string;
    sentBySection?: string;
    sentByUserId?: string;
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
    this.inProgress = false;
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
    return WorkItem.VALIDATION_RULES;
  }
}

export type RawWorkItem = ExcludeMethods<WorkItem>;

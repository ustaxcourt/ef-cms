import { CASE_STATUS_TYPES, CHIEF_JUDGE } from './EntityConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { WORK_ITEM_VALIDATION_RULES } from './EntityValidationConstants';
import { createISODateString } from '../utilities/DateHandler';
import { pick } from 'lodash';

export class WorkItem extends JoiValidationEntity {
  public assigneeId: string;
  public assigneeName: string;
  public associatedJudge: string;
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
  public leadDocketNumber?: string;
  public docketNumberWithSuffix: string;
  public hideFromPendingMessages?: boolean;
  public highPriority: boolean;
  public inProgress: boolean;
  public isInitializeCase: boolean;
  public isRead?: boolean;
  public section: string;
  public sentBy: string;
  public sentBySection: string;
  public sentByUserId: string;
  public trialDate?: string;
  public trialLocation?: string;
  public updatedAt: string;
  public workItemId: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  /**
   * Assign to a user
   * @param {object} props the props object
   * @param {string} props.assigneeId the user id of the user to assign the work item to
   * @param {string} props.assigneeName the name of the user to assign the work item to
   * @param {string} props.section the section of the user to assign the work item to
   * @param {string} props.sentBy the name of the user who sent the work item
   * @param {string} props.sentBySection the section of the user who sent the work item
   * @param {string} props.sentByUserId the user id of the user who sent the work item
   * @returns {WorkItem} the updated work item
   */
  assignToUser({
    assigneeId,
    assigneeName,
    section,
    sentBy,
    sentBySection,
    sentByUserId,
  }) {
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

  setStatus(caseStatus) {
    this.caseStatus = caseStatus;
  }

  /**
   *
   * @param {object} props the props object
   * @param {string} props.message the message the user entered when setting as completed
   * @param {object} props.user the user who triggered the complete action
   * @returns {WorkItem} the updated work item
   */
  setAsCompleted({ message, user }) {
    this.completedAt = createISODateString();
    this.completedBy = user.name;
    this.completedByUserId = user.userId;
    this.completedMessage = message;
    delete this.inProgress;
    return this;
  }

  isCompleted() {
    return !!this.completedAt;
  }

  /**
   * marks the work item as read
   * @returns {WorkItem} the updated work item
   */
  markAsRead() {
    this.isRead = true;
    return this;
  }

  getValidationRules() {
    return WORK_ITEM_VALIDATION_RULES;
  }

  getValidationRules_NEW() {
    return WORK_ITEM_VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return {};
  }
}

declare global {
  type RawWorkItem = ExcludeMethods<WorkItem>;
}

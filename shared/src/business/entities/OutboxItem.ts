import { CASE_STATUS_TYPES } from './EntityConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { OUTBOX_ITEM_VALIDATION_RULES } from './EntityValidationConstants';
import { pick } from 'lodash';

export class OutboxItem extends JoiValidationEntity {
  public entityName: string;
  public caseStatus: string;
  public caseTitle: string;
  public completedAt: string;
  public completedBy: string;
  public caseIsInProgress: boolean;
  public docketEntry: Partial<RawDocketEntry>;
  public docketNumber: string;
  public highPriority: boolean;
  public inProgress: boolean;
  public leadDocketNumber: string;
  public section: string;
  public assigneeId: string;
  public trialDate?: string;
  public trialLocation?: string;
  public workItemId: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawOutboxItem: RawOutboxItem, { applicationContext }) {
    super('OutboxItem');
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.entityName = rawOutboxItem.entityName;
    this.caseStatus = rawOutboxItem.caseStatus;
    this.caseTitle = rawOutboxItem.caseTitle;
    this.completedAt = rawOutboxItem.completedAt;
    this.completedBy = rawOutboxItem.completedBy;
    this.caseIsInProgress = rawOutboxItem.caseIsInProgress;
    this.assigneeId = rawOutboxItem.assigneeId;
    this.docketEntry = pick(rawOutboxItem.docketEntry, [
      'descriptionDisplay',
      'docketEntryId',
      'documentType',
      'eventCode',
      'filedBy',
      'isCourtIssuedDocument',
      'isFileAttached',
      'isLegacyServed',
      'isMinuteEntry',
      'isOrder',
      'isPaper',
      'isUnservable',
      'servedAt',
    ]);

    this.docketNumber = rawOutboxItem.docketNumber;
    this.highPriority =
      rawOutboxItem.highPriority ||
      rawOutboxItem.caseStatus === CASE_STATUS_TYPES.calendared;
    this.inProgress = rawOutboxItem.inProgress;
    this.leadDocketNumber = rawOutboxItem.leadDocketNumber;
    this.section = rawOutboxItem.section;
    this.trialDate = rawOutboxItem.trialDate;
    this.trialLocation = rawOutboxItem.trialLocation;
    this.workItemId =
      rawOutboxItem.workItemId || applicationContext.getUniqueId();
  }

  getValidationRules() {
    return OUTBOX_ITEM_VALIDATION_RULES;
  }

  getValidationRules_NEW() {
    return OUTBOX_ITEM_VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return {};
  }
}

declare global {
  type RawOutboxItem = ExcludeMethods<OutboxItem>;
}

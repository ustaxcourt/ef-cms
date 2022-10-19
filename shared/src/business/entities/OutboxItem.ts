import {
  joiValidationDecorator,
  validEntityDecorator,
} from './JoiValidationDecorator';
import { CASE_STATUS_TYPES } from './EntityConstants';
import { OUTBOX_ITEM_VALIDATION_RULES } from './EntityValidationConstants';
import { pick } from 'lodash';

/**
 * constructor
 *
 * @param {object} rawOutboxItem the raw work item data
 * @constructor
 */
function _OutboxItem() {
  this.entityName = 'OutboxItem';
}

_OutboxItem.prototype.init = function init(
  rawOutboxItem,
  { applicationContext },
) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  this.caseStatus = rawOutboxItem.caseStatus;
  this.caseTitle = rawOutboxItem.caseTitle;
  this.completedAt = rawOutboxItem.completedAt;
  this.completedBy = rawOutboxItem.completedBy;
  this.caseIsInProgress = rawOutboxItem.caseIsInProgress;

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
  this.workItemId =
    rawOutboxItem.workItemId || applicationContext.getUniqueId();
};

joiValidationDecorator(_OutboxItem, OUTBOX_ITEM_VALIDATION_RULES);

interface IOutboxItemConstructor {
  new (
    rawWorkItem: TOutboxItem,
    {
      applicationContext,
    }: {
      applicationContext: IApplicationContext;
    },
  ): TOutboxItemEntity;

  validateRawCollection(
    rawOutboxItems: TOutboxItem[],
    context: { applicationContext: IApplicationContext },
  ): TOutboxItem;

  validate(): TOutboxItemEntity;
  toRawObject(): TOutboxItem;
}

export const OutboxItem: IOutboxItemConstructor =
  validEntityDecorator(_OutboxItem);

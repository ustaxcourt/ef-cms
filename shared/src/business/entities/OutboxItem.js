const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('./JoiValidationDecorator');
const { CASE_STATUS_TYPES } = require('./EntityConstants');
const { OUTBOX_ITEM_VALIDATION_RULES } = require('./EntityValidationConstants');
const { pick } = require('lodash');

/**
 * constructor
 *
 * @param {object} rawOutboxItem the raw work item data
 * @constructor
 */
function OutboxItem() {
  this.entityName = 'OutboxItem';
}

OutboxItem.prototype.init = function init(
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

joiValidationDecorator(OutboxItem, OUTBOX_ITEM_VALIDATION_RULES);

exports.OutboxItem = validEntityDecorator(OutboxItem);

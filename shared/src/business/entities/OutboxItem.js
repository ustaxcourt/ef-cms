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
    'documentType',
    'docketEntryId',
    'filedBy',
    'isCourtIssuedDocument',
    'isFileAttached',
    'isMinuteEntry',
    'isUnservable',
    'isPaper',
    'isOrder',
    'eventCode',
    'servedAt',
    'isLegacyServed',
  ]);

  this.docketNumber = rawOutboxItem.docketNumber;
  this.highPriority =
    rawOutboxItem.highPriority ||
    rawOutboxItem.caseStatus === CASE_STATUS_TYPES.calendared;
  this.inProgress = rawOutboxItem.inProgress;
  this.trialDate = rawOutboxItem.trialDate;
  this.workItemId =
    rawOutboxItem.workItemId || applicationContext.getUniqueId();
  this.section = rawOutboxItem.section;
};

joiValidationDecorator(OutboxItem, OUTBOX_ITEM_VALIDATION_RULES);

exports.OutboxItem = validEntityDecorator(OutboxItem);

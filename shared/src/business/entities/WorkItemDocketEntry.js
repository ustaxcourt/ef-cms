const joi = require('joi');
const {
  DOCKET_ENTRY_VALIDATION_RULE_KEYS,
} = require('./EntityValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');

/**
 * contains only the fields necessary
 *
 * @param {object} WorkItemDocketEntry the raw work item data
 * @constructor
 */
function WorkItemDocketEntry() {
  this.entityName = 'WorkItemDocketEntry';
}

WorkItemDocketEntry.prototype.init = function init(rawDocketEntry) {
  this.receivedAt = rawDocketEntry.receivedAt;
  this.servedAt = rawDocketEntry.servedAt;
  this.createdAt = rawDocketEntry.createdAt;
  this.eventCode = rawDocketEntry.eventCode;
  this.documentType = rawDocketEntry.documentType;
  this.documentTitle = rawDocketEntry.documentTitle;
  this.additionalInfo = rawDocketEntry.additionalInfo;
  this.descriptionDisplay = rawDocketEntry.descriptionDisplay;
  this.docketEntryId = rawDocketEntry.docketEntryId;
  this.isFileAttached = rawDocketEntry.isFileAttached;
};

joiValidationDecorator(
  WorkItemDocketEntry,
  joi.object().keys({
    additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
    createdAt: DOCKET_ENTRY_VALIDATION_RULE_KEYS.createdAt,
    docketEntryId: DOCKET_ENTRY_VALIDATION_RULE_KEYS.docketEntryId,
    documentTitle: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentTitle,
    documentType: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentType,
    eventCode: DOCKET_ENTRY_VALIDATION_RULE_KEYS.eventCode,
    isFileAttached: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isFileAttached,
    receivedAt: DOCKET_ENTRY_VALIDATION_RULE_KEYS.receivedAt,
    servedAt: DOCKET_ENTRY_VALIDATION_RULE_KEYS.servedAt,
  }),
);

module.exports = {
  WorkItemDocketEntry: validEntityDecorator(WorkItemDocketEntry),
};

const joi = require('joi');
const {
  DOCKET_ENTRY_VALIDATION_RULE_KEYS,
} = require('../EntityValidationConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { ALL_EVENT_CODES } = require('../EntityConstants');

/**
 * PublicDocketEntry
 *
 * @param {object} rawDocketEntry the raw docket entry
 * @constructor
 */
function PublicDocketEntry() {}
PublicDocketEntry.prototype.init = function init(rawDocketEntry) {
  this.additionalInfo = rawDocketEntry.additionalInfo;
  this.additionalInfo2 = rawDocketEntry.additionalInfo2;
  this.docketEntryId = rawDocketEntry.docketEntryId;
  this.docketNumber = rawDocketEntry.docketNumber;
  this.documentTitle = rawDocketEntry.documentTitle;
  this.documentType = rawDocketEntry.documentType;
  this.eventCode = rawDocketEntry.eventCode;
  this.filedBy = rawDocketEntry.filedBy;
  this.filingDate = rawDocketEntry.filingDate;
  this.index = rawDocketEntry.index;
  this.isFileAttached = rawDocketEntry.isFileAttached;
  this.isMinuteEntry = rawDocketEntry.isMinuteEntry;
  this.isOnDocketRecord = rawDocketEntry.isOnDocketRecord;
  this.isPaper = rawDocketEntry.isPaper;
  this.isSealed = !!rawDocketEntry.isSealed;
  this.isStricken = rawDocketEntry.isStricken;
  this.numberOfPages = rawDocketEntry.numberOfPages;
  this.processingStatus = rawDocketEntry.processingStatus;
  this.receivedAt = rawDocketEntry.receivedAt;
  this.servedAt = rawDocketEntry.servedAt;
  this.servedParties = rawDocketEntry.servedParties;
};

PublicDocketEntry.VALIDATION_RULES = joi.object().keys({
  additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
  additionalInfo2: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo2,
  createdAt: JoiValidationConstants.ISO_DATE.optional().description(
    'When the Document was added to the system.',
  ),
  docketEntryId: JoiValidationConstants.UUID.optional(),
  docketNumber: DOCKET_ENTRY_VALIDATION_RULE_KEYS.docketNumber,
  documentTitle: DOCKET_ENTRY_VALIDATION_RULE_KEYS.documentTitle,
  documentType: JoiValidationConstants.STRING.optional().description(
    'The type of this document.',
  ),
  eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES).optional(),
  filedBy: JoiValidationConstants.STRING.optional().allow('', null),
  filingDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .description('Date that this Document was filed.'),
  index: DOCKET_ENTRY_VALIDATION_RULE_KEYS.index,
  isFileAttached: joi.boolean().optional(),
  isMinuteEntry: joi.boolean().optional(),
  isPaper: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isPaper,
  isSealed: joi.boolean().invalid(true).required(), // value of true is forbidden
  isStricken: joi
    .boolean()
    .optional()
    .description('Indicates the item has been removed from the docket record.'),
  numberOfPages: DOCKET_ENTRY_VALIDATION_RULE_KEYS.numberOfPages,
  processingStatus: JoiValidationConstants.STRING.optional(),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
  servedAt: JoiValidationConstants.ISO_DATE.optional(),
  servedParties: joi
    .array()
    .items({
      name: JoiValidationConstants.STRING.optional().description(
        'The name of a party from a contact, or "IRS"',
      ),
    })
    .optional(),
});

joiValidationDecorator(
  PublicDocketEntry,
  PublicDocketEntry.VALIDATION_RULES,
  {},
);

module.exports = { PublicDocketEntry: validEntityDecorator(PublicDocketEntry) };

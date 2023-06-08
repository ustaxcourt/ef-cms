const joi = require('joi');
const {
  ALL_EVENT_CODES,
  DOCKET_ENTRY_SEALED_TO_TYPES,
} = require('../EntityConstants');
const {
  DOCKET_ENTRY_VALIDATION_RULE_KEYS,
} = require('../EntityValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');

/**
 * PublicDocketEntry
 * @param {object} rawDocketEntry the raw docket entry
 * @constructor
 */
function PublicDocketEntry() {}
PublicDocketEntry.prototype.init = function init(rawDocketEntry) {
  this.additionalInfo = rawDocketEntry.additionalInfo;
  this.additionalInfo2 = rawDocketEntry.additionalInfo2;
  this.attachments = rawDocketEntry.attachments;
  this.certificateOfService = rawDocketEntry.certificateOfService;
  this.certificateOfServiceDate = rawDocketEntry.certificateOfServiceDate;
  this.docketEntryId = rawDocketEntry.docketEntryId;
  this.docketNumber = rawDocketEntry.docketNumber;
  this.documentTitle = rawDocketEntry.documentTitle;
  this.documentType = rawDocketEntry.documentType;
  this.eventCode = rawDocketEntry.eventCode;
  this.filedBy = rawDocketEntry.filedBy;
  this.filingDate = rawDocketEntry.filingDate;
  this.freeText = rawDocketEntry.freeText;
  this.index = rawDocketEntry.index;
  this.isFileAttached = rawDocketEntry.isFileAttached;
  this.isLegacyServed = rawDocketEntry.isLegacyServed;
  this.isMinuteEntry = rawDocketEntry.isMinuteEntry;
  this.isOnDocketRecord = rawDocketEntry.isOnDocketRecord;
  this.isPaper = rawDocketEntry.isPaper;
  this.isSealed = !!rawDocketEntry.isSealed;
  this.isStricken = rawDocketEntry.isStricken;
  this.lodged = rawDocketEntry.lodged;
  this.numberOfPages = rawDocketEntry.numberOfPages;
  this.objections = rawDocketEntry.objections;
  this.processingStatus = rawDocketEntry.processingStatus;
  this.receivedAt = rawDocketEntry.receivedAt;
  this.sealedTo = rawDocketEntry.sealedTo;
  this.servedAt = rawDocketEntry.servedAt;
  this.servedPartiesCode = rawDocketEntry.servedPartiesCode;
};

PublicDocketEntry.VALIDATION_RULES = joi.object().keys({
  additionalInfo: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo,
  additionalInfo2: DOCKET_ENTRY_VALIDATION_RULE_KEYS.additionalInfo2,
  attachments: DOCKET_ENTRY_VALIDATION_RULE_KEYS.attachments,
  certificateOfService: DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfService,
  certificateOfServiceDate:
    DOCKET_ENTRY_VALIDATION_RULE_KEYS.certificateOfServiceDate,
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
    .required()
    .description('Date that this Document was filed.'),
  freeText: JoiValidationConstants.STRING.max(1000).optional(),
  index: DOCKET_ENTRY_VALIDATION_RULE_KEYS.index,
  isFileAttached: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isFileAttached,
  isLegacyServed: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isLegacyServed,
  isMinuteEntry: joi.boolean().optional(),
  isPaper: DOCKET_ENTRY_VALIDATION_RULE_KEYS.isPaper,
  isSealed: joi.boolean().required(),
  isStricken: joi
    .boolean()
    .optional()
    .description('Indicates the item has been removed from the docket record.'),
  lodged: DOCKET_ENTRY_VALIDATION_RULE_KEYS.lodged,
  numberOfPages: DOCKET_ENTRY_VALIDATION_RULE_KEYS.numberOfPages,
  objections: DOCKET_ENTRY_VALIDATION_RULE_KEYS.objections,
  processingStatus: JoiValidationConstants.STRING.optional(),
  receivedAt: JoiValidationConstants.ISO_DATE.max('now').required(),
  sealedTo: JoiValidationConstants.STRING.when('isSealed', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.valid(...Object.values(DOCKET_ENTRY_SEALED_TO_TYPES)).required(),
  }).description("If sealed, the type of users who it's sealed from."),
  servedAt: JoiValidationConstants.ISO_DATE.max('now').optional(),
  servedPartiesCode: DOCKET_ENTRY_VALIDATION_RULE_KEYS.servedPartiesCode,
});

joiValidationDecorator(
  PublicDocketEntry,
  PublicDocketEntry.VALIDATION_RULES,
  {},
);

module.exports = { PublicDocketEntry: validEntityDecorator(PublicDocketEntry) };

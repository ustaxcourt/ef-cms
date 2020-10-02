const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
} = require('../EntityConstants');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

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
  this.createdAt = rawDocketEntry.createdAt;
  this.docketEntryId = rawDocketEntry.docketEntryId;
  this.docketNumber = rawDocketEntry.docketNumber;
  this.documentTitle = rawDocketEntry.documentTitle;
  this.documentType = rawDocketEntry.documentType;
  this.eventCode = rawDocketEntry.eventCode;
  this.filedBy = rawDocketEntry.filedBy;
  this.filingDate = rawDocketEntry.filingDate;
  this.index = rawDocketEntry.index;
  this.isMinuteEntry = rawDocketEntry.isMinuteEntry;
  this.isOnDocketRecord = rawDocketEntry.isOnDocketRecord;
  this.isPaper = rawDocketEntry.isPaper;
  this.isStricken = rawDocketEntry.isStricken;
  this.numberOfPages = rawDocketEntry.numberOfPages;
  this.processingStatus = rawDocketEntry.processingStatus;
  this.receivedAt = rawDocketEntry.receivedAt;
  this.servedAt = rawDocketEntry.servedAt;
  this.servedParties = rawDocketEntry.servedParties;

  if (this.isOnDocketRecord) {
    this.docketEntryId = rawDocketEntry.docketEntryId;
    this.filedBy = rawDocketEntry.filedBy;
    this.filingDate = rawDocketEntry.filingDate;
    this.index = rawDocketEntry.index;
    this.isStricken = rawDocketEntry.isStricken;
    this.numberOfPages = rawDocketEntry.numberOfPages;
  }
};

PublicDocketEntry.VALIDATION_RULES = joi.object().keys({
  additionalInfo: JoiValidationConstants.STRING.max(500).optional(),
  additionalInfo2: JoiValidationConstants.STRING.max(500).optional(),
  createdAt: JoiValidationConstants.ISO_DATE.optional(),
  docketEntryId: JoiValidationConstants.UUID.optional(),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
  documentTitle: JoiValidationConstants.STRING.max(500).optional(),
  documentType: JoiValidationConstants.STRING.valid(
    ...ALL_DOCUMENT_TYPES,
  ).optional(),
  eventCode: JoiValidationConstants.STRING.valid(...ALL_EVENT_CODES).optional(),
  filedBy: JoiValidationConstants.STRING.max(500).optional().allow(null),
  filingDate: JoiValidationConstants.ISO_DATE.max('now').optional(),
  // Required on DocketRecord so probably should be required here.
  index: joi.number().integer().optional(),
  isMinuteEntry: joi.boolean().optional(),
  isPaper: joi.boolean().optional(),
  isStricken: joi.boolean().optional(),
  numberOfPages: joi.number().integer().optional(),
  processingStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCUMENT_PROCESSING_STATUS_OPTIONS),
  ).optional(),
  receivedAt: JoiValidationConstants.ISO_DATE.optional(),
  servedAt: JoiValidationConstants.ISO_DATE.optional(),
  servedParties: joi
    .array()
    .items({ name: JoiValidationConstants.STRING.max(500).required() })
    .optional(),
});

joiValidationDecorator(
  PublicDocketEntry,
  PublicDocketEntry.VALIDATION_RULES,
  {},
);

module.exports = { PublicDocketEntry: validEntityDecorator(PublicDocketEntry) };

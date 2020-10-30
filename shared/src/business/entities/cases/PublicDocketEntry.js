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
const { pick } = require('lodash');

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
  ...pick(DOCKET_ENTRY_VALIDATION_RULE_KEYS, [
    'additionalInfo',
    'additionalInfo2',
    'createdAt',
    'docketEntryId',
    'docketNumber',
    'documentTitle',
    'documentType',
    'eventCode',
    'filedBy',
    'filingDate',
    'index',
    'isMinuteEntry',
    'isPaper',
    'isStricken',
    'numberOfPages',
    'processingStatus',
    'receivedAt',
    'servedAt',
    'servedParties',
  ]),
  // below are made to be less strict with no conditionals
  filedBy: JoiValidationConstants.STRING.max(500).optional().allow('', null),
  isStricken: joi.boolean().optional(),
  servedAt: JoiValidationConstants.ISO_DATE.optional(),
  servedParties: joi
    .array()
    .items({
      name: JoiValidationConstants.STRING.max(100)
        .required()
        .description('The name of a party from a contact, or "IRS"'),
    })
    .optional(),
});

joiValidationDecorator(
  PublicDocketEntry,
  PublicDocketEntry.VALIDATION_RULES,
  {},
);

module.exports = { PublicDocketEntry: validEntityDecorator(PublicDocketEntry) };

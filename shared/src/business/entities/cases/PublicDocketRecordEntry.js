const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * PublicDocketRecordEntry
 *
 * @param {object} rawDocketEntry the raw docket entry
 * @constructor
 */
function PublicDocketRecordEntry() {}
PublicDocketRecordEntry.prototype.init = function init(rawDocketEntry) {
  this.description = rawDocketEntry.description;
  this.documentId = rawDocketEntry.documentId;
  this.filedBy = rawDocketEntry.filedBy;
  this.index = rawDocketEntry.index;
  this.filingDate = rawDocketEntry.filingDate;
  this.numberOfPages = rawDocketEntry.numberOfPages;
  this.isStricken = rawDocketEntry.isStricken;
};

joiValidationDecorator(
  PublicDocketRecordEntry,
  joi.object().keys({
    description: JoiValidationConstants.STRING.max(500).optional(),
    documentId: JoiValidationConstants.UUID.optional(),
    filedBy: JoiValidationConstants.STRING.max(500).optional(),
    filingDate: JoiValidationConstants.ISO_DATE.max('now').optional(), // Required on DocketRecord so probably should be required here.
    index: joi.number().integer().optional(),
    isStricken: joi.boolean().optional(),
    numberOfPages: joi.number().integer().optional(),
  }),
  {},
);

module.exports = {
  PublicDocketRecordEntry: validEntityDecorator(PublicDocketRecordEntry),
};

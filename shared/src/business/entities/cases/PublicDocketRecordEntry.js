const joi = require('@hapi/joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * PublicDocketRecordEntry
 *
 * @param {object} rawDocketEntry the raw docket entry
 * @constructor
 */
function PublicDocketRecordEntry(rawDocketEntry) {
  this.description = rawDocketEntry.description;
  this.documentId = rawDocketEntry.documentId;
  this.filedBy = rawDocketEntry.filedBy;
  this.index = rawDocketEntry.index;
  this.filingDate = rawDocketEntry.filingDate;
  this.numberOfPages = rawDocketEntry.numberOfPages;
}

joiValidationDecorator(
  PublicDocketRecordEntry,
  joi.object().keys({
    description: joi.string().max(500).optional(),
    documentId: JoiValidationConstants.UUID.optional(),
    filedBy: joi.string().max(500).optional(),
    filingDate: JoiValidationConstants.ISO_DATE.max('now').optional(), // Required on DocketRecord so probably should be required here.
    index: joi.number().integer().optional(),
    numberOfPages: joi.number().integer().optional(),
  }),
  {},
);

module.exports = { PublicDocketRecordEntry };

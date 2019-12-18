const joi = require('joi-browser');
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
}

joiValidationDecorator(
  PublicDocketRecordEntry,
  joi.object().keys({
    description: joi.string().optional(),
    documentId: joi.string().optional(),
    filedBy: joi
      .date()
      .iso()
      .optional(),
    filingDate: joi
      .date()
      .max('now')
      .iso()
      .optional(), // Required on DocketRecord so probably should be required here.
    index: joi
      .number()
      .integer()
      .optional(),
  }),
  undefined,
  {},
);

module.exports = { PublicDocketRecordEntry };

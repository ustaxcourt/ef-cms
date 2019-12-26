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

joiValidationDecorator(PublicDocketRecordEntry, joi.object(), undefined, {});

module.exports = { PublicDocketRecordEntry };

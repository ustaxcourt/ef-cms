const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { PublicDocketRecordEntry } = require('./PublicDocketRecordEntry');
const { PublicDocument } = require('./PublicDocument');
/**
 * Public Case Entity
 * Represents the view of the public case.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function PublicCase(rawCase, { applicationContext }) {
  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.createdAt = rawCase.createdAt;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.receivedAt = rawCase.receivedAt;
  this.caseCaption = rawCase.caseCaption;
  this.caseTitle = rawCase.caseTitle;

  this.documents = rawCase.documents.map(
    document => new PublicDocument(document, { applicationContext }),
  );

  this.docketRecord = rawCase.docketRecord.map(
    entry => new PublicDocketRecordEntry(entry, { applicationContext }),
  );
}

joiValidationDecorator(PublicCase, joi.object(), undefined, {});

module.exports = { PublicCase };

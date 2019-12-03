const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { PublicContact } = require('./PublicContact');
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
  this.createdAt = rawCase.createdAt;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.receivedAt = rawCase.receivedAt;
  this.caseCaption = rawCase.caseCaption;
  this.caseTitle = rawCase.caseTitle;

  this.contactPrimary = rawCase.contactPrimary
    ? new PublicContact(rawCase.contactPrimary)
    : undefined;
  this.contactSecondary = rawCase.contactSecondary
    ? new PublicContact(rawCase.contactSecondary)
    : undefined;

  // rawCase.documents is not returned in elasticsearch queries due to _source definition
  this.documents = (rawCase.documents || []).map(
    document => new PublicDocument(document, { applicationContext }),
  );

  // rawCase.docketRecord is not returned in elasticsearch queries due to _source definition
  this.docketRecord = (rawCase.docketRecord || []).map(
    entry => new PublicDocketRecordEntry(entry, { applicationContext }),
  );
}

joiValidationDecorator(PublicCase, joi.object(), undefined, {});

module.exports = { PublicCase };

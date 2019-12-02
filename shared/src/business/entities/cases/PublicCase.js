const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 * Public Case Entity
 * Represents the view of the public case.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function PublicCase(rawCase) {
  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.createdAt = rawCase.createdAt;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = rawCase.docketNumberSuffix;
  this.receivedAt = rawCase.receivedAt;
}

joiValidationDecorator(PublicCase, joi.object(), undefined, {});

module.exports = { PublicCase };

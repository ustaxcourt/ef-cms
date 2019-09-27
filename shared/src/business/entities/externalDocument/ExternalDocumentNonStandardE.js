const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardE(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.trialLocation = rawProps.trialLocation;
}

ExternalDocumentNonStandardE.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.trialLocation);
};

ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardE.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  trialLocation: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardE,
  ExternalDocumentNonStandardE.schema,
  undefined,
  ExternalDocumentNonStandardE.VALIDATION_ERROR_MESSAGES,
);

module.exports = { ExternalDocumentNonStandardE };

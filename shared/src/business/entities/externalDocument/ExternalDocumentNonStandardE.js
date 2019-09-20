const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

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

ExternalDocumentNonStandardE.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  trialLocation: 'Select a preferred trial location.',
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
  ExternalDocumentNonStandardE.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardE };

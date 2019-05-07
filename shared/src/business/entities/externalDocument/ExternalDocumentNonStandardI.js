const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/getDocumentTitle');

/**
 *
 * @param rawProps
 * @param ExternalDocumentFactory
 * @constructor
 */
function ExternalDocumentNonStandardI(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.ordinalValue, this.freeText);
};

ExternalDocumentNonStandardI.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  freeText: 'You must provide a value.',
  ordinalValue: 'You must select an iteration.',
};

ExternalDocumentNonStandardI.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  ordinalValue: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardI,
  ExternalDocumentNonStandardI.schema,
  undefined,
  ExternalDocumentNonStandardI.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardI };

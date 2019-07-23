const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @param ExternalDocumentFactory
 * @constructor
 */
function ExternalDocumentNonStandardI(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    freeText: rawProps.freeText,
    ordinalValue: rawProps.ordinalValue,
  });
}

ExternalDocumentNonStandardI.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.ordinalValue, this.freeText);
};

ExternalDocumentNonStandardI.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  freeText: 'Provide an answer.',
  ordinalValue: 'Select an iteration.',
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

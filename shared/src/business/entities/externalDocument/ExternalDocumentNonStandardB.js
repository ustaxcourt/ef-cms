const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardB(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    freeText: rawProps.freeText,
  });
}

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.freeText);
};

ExternalDocumentNonStandardB.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  freeText: 'Provide an answer.',
};

ExternalDocumentNonStandardB.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardB,
  ExternalDocumentNonStandardB.schema,
  undefined,
  ExternalDocumentNonStandardB.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardB };

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
function ExternalDocumentNonStandardG(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    ordinalValue: rawProps.ordinalValue,
  });
}

ExternalDocumentNonStandardG.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.documentType,
  );
};

ExternalDocumentNonStandardG.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  ordinalValue: 'Select an iteration.',
};

ExternalDocumentNonStandardG.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardG,
  ExternalDocumentNonStandardG.schema,
  undefined,
  ExternalDocumentNonStandardG.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardG };

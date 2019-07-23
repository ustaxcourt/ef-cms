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
function ExternalDocumentNonStandardC(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
    freeText: rawProps.freeText,
    previousDocument: rawProps.previousDocument,
  });
}

ExternalDocumentNonStandardC.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    this.previousDocument,
  );
};

ExternalDocumentNonStandardC.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
  freeText: 'Enter name.',
  previousDocument: 'Select a document.',
};

ExternalDocumentNonStandardC.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  previousDocument: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardC,
  ExternalDocumentNonStandardC.schema,
  undefined,
  ExternalDocumentNonStandardC.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardC };

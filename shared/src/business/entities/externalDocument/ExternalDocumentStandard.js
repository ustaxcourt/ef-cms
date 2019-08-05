const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentStandard(rawProps) {
  Object.assign(this, {
    category: rawProps.category,
    documentTitle: rawProps.documentTitle,
    documentType: rawProps.documentType,
  });
}

ExternalDocumentStandard.prototype.getDocumentTitle = function() {
  return this.documentTitle;
};

ExternalDocumentStandard.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a Document Type.',
};

ExternalDocumentStandard.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  undefined,
  ExternalDocumentStandard.errorToMessageMap,
);

module.exports = { ExternalDocumentStandard };

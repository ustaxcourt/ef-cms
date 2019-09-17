const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @param {ExternalDocumentFactory} ExternalDocumentFactory the factory for the secondary document
 * @constructor
 */
function ExternalDocumentNonStandardH(rawProps, ExternalDocumentFactory) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;

  const { secondaryDocument } = rawProps;
  this.secondaryDocument = ExternalDocumentFactory.get(secondaryDocument || {});
}

ExternalDocumentNonStandardH.prototype.getDocumentTitle = function() {
  return replaceBracketed(
    this.documentTitle,
    this.secondaryDocument.getDocumentTitle(),
  );
};

ExternalDocumentNonStandardH.errorToMessageMap = {
  category: 'Select a Category.',
  documentType: 'Select a document type',
  secondaryDocument: 'Select a document',
};

ExternalDocumentNonStandardH.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  secondaryDocument: joi.object().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardH,
  ExternalDocumentNonStandardH.schema,
  function() {
    return !this.getFormattedValidationErrors();
  },
  ExternalDocumentNonStandardH.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardH };

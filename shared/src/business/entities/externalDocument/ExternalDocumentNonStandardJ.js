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
function ExternalDocumentNonStandardJ(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardJ.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentTitle, this.freeText, this.freeText2);
};

ExternalDocumentNonStandardJ.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  freeText: 'You must provide a value.',
  freeText2: 'You must provide a value.',
};

ExternalDocumentNonStandardJ.schema = {
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
  freeText2: joi.string().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardJ,
  ExternalDocumentNonStandardJ.schema,
  undefined,
  ExternalDocumentNonStandardJ.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardJ };

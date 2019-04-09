const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/getDocumentTitle');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardA(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardA.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentType, this.previousDocument);
};

ExternalDocumentNonStandardA.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  previousDocument: 'You must select a document.',
};

ExternalDocumentNonStandardA.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  previousDocument: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardA,
  ExternalDocumentNonStandardA.schema,
  undefined,
  ExternalDocumentNonStandardA.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardA };

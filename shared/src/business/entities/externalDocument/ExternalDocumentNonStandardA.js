const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardA(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardA.errorToMessageMap = {
  category: 'You must select a category.',
  documentName: 'You must select a document.',
  documentType: 'You must select a document type.',
};

ExternalDocumentNonStandardA.schema = joi.object().keys({
  category: joi.string().required(),
  documentName: joi.string().required(),
  documentType: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardA,
  ExternalDocumentNonStandardA.schema,
  undefined,
  ExternalDocumentNonStandardA.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardA };

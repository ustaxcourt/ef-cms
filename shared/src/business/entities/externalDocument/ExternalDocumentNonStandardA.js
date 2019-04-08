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

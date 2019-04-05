const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardC(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardC.errorToMessageMap = {
  category: 'You must select a category.',
  documentName: 'You must select a document.',
  documentType: 'You must select a document type.',
  name: 'You must provide a name.',
};

ExternalDocumentNonStandardC.schema = joi.object().keys({
  category: joi.string().required(),
  documentName: joi.string().required(),
  documentType: joi.string().required(),
  name: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardC,
  ExternalDocumentNonStandardC.schema,
  undefined,
  ExternalDocumentNonStandardC.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardC };

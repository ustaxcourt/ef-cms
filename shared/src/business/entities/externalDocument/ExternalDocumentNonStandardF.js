const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardF(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardF.errorToMessageMap = {
  category: 'You must select a category.',
  documentName: 'You must select a document.',
  documentType: 'You must select a document type.',
  ordinal: 'You must select an iteration.',
};

ExternalDocumentNonStandardF.schema = joi.object().keys({
  category: joi.string().required(),
  documentName: joi.string().required(),
  documentType: joi.string().required(),
  ordinal: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  undefined,
  ExternalDocumentNonStandardF.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardF };

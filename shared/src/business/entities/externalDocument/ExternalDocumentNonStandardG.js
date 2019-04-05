const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardG(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardG.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  ordinalValue: 'You must select an iteration.',
};

ExternalDocumentNonStandardG.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardG,
  ExternalDocumentNonStandardG.schema,
  undefined,
  ExternalDocumentNonStandardG.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardG };

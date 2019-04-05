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
  documentType: 'You must select a document type.',
  ordinalValue: 'You must select an iteration.',
  previousDocument: 'You must select a document.',
};

ExternalDocumentNonStandardF.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  ordinalValue: joi.string().required(),
  previousDocument: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardF,
  ExternalDocumentNonStandardF.schema,
  undefined,
  ExternalDocumentNonStandardF.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardF };

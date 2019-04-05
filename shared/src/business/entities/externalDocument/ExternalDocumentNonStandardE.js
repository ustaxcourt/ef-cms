const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardE(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardE.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  trialLocation: 'You must select a trial location.',
};

ExternalDocumentNonStandardE.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  trialLocation: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardE,
  ExternalDocumentNonStandardE.schema,
  undefined,
  ExternalDocumentNonStandardE.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardE };

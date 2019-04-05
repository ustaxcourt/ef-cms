const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardB(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardB.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  freeText: 'You must provide a value.',
};

ExternalDocumentNonStandardB.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  freeText: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardB,
  ExternalDocumentNonStandardB.schema,
  undefined,
  ExternalDocumentNonStandardB.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardB };

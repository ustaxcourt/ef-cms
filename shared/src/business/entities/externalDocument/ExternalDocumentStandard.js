const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentStandard(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentStandard.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
};

ExternalDocumentStandard.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  undefined,
  ExternalDocumentStandard.errorToMessageMap,
);

module.exports = { ExternalDocumentStandard };

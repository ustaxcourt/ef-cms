const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardH(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardH.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
  secondaryCategory: 'You must select a category.',
  secondaryDocumentType: 'You must select a document type.',
};

ExternalDocumentNonStandardH.schema = joi.object().keys({
  category: joi.string().required(),
  documentType: joi.string().required(),
  secondaryCategory: joi.string().required(),
  secondaryDocumentType: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentNonStandardH,
  ExternalDocumentNonStandardH.schema,
  undefined,
  ExternalDocumentNonStandardH.errorToMessageMap,
);

module.exports = { ExternalDocumentNonStandardH };

const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentStandard(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentStandard.prototype.getDocumentTitle = function() {
  return this.documentTitle;
};

ExternalDocumentStandard.errorToMessageMap = {
  category: 'You must select a category.',
  documentType: 'You must select a document type.',
};

ExternalDocumentStandard.schema = joi.object().keys({
  category: joi.string().required(),
  documentTitle: joi.string().optional(),
  documentType: joi.string().required(),
});

joiValidationDecorator(
  ExternalDocumentStandard,
  ExternalDocumentStandard.schema,
  undefined,
  ExternalDocumentStandard.errorToMessageMap,
);

module.exports = { ExternalDocumentStandard };

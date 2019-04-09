const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { replaceBracketed } = require('../../utilities/getDocumentTitle');

/**
 *
 * @param rawProps
 * @constructor
 */
function ExternalDocumentNonStandardB(rawProps) {
  Object.assign(this, rawProps);
}

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function() {
  return replaceBracketed(this.documentType, this.freeText);
};

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

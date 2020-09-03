const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./ExternalDocumentInformationFactory');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 *
 * @param {object} rawProps the raw document data
 * @constructor
 */
function ExternalDocumentNonStandardB() {}

ExternalDocumentNonStandardB.prototype.init = function init(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
};

ExternalDocumentNonStandardB.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText);
};

ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardB.schema = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  freeText: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardB,
  ExternalDocumentNonStandardB.schema,
  ExternalDocumentNonStandardB.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardB: validEntityDecorator(
    ExternalDocumentNonStandardB,
  ),
};

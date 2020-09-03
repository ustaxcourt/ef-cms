const joi = require('joi');
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
function ExternalDocumentNonStandardG() {}
ExternalDocumentNonStandardG.prototype.init = function init(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.ordinalValue = rawProps.ordinalValue;
};

ExternalDocumentNonStandardG.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.ordinalValue,
    this.documentType,
  );
};

ExternalDocumentNonStandardG.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardG.schema = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  ordinalValue: JoiValidationConstants.STRING.required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardG,
  joi.object(ExternalDocumentNonStandardG.schema),
  ExternalDocumentNonStandardG.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardG: validEntityDecorator(
    ExternalDocumentNonStandardG,
  ),
};

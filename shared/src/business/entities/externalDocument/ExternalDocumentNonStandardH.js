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
 * @param {ExternalDocumentFactory} ExternalDocumentFactory the factory for the secondary document
 * @constructor
 */
function ExternalDocumentNonStandardH() {}
ExternalDocumentNonStandardH.prototype.init = function init(
  rawProps,
  ExternalDocumentFactory,
) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;

  const { secondaryDocument } = rawProps;
  this.secondaryDocument = ExternalDocumentFactory.get(secondaryDocument || {});
};

ExternalDocumentNonStandardH.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.secondaryDocument.getDocumentTitle(),
  );
};

ExternalDocumentNonStandardH.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
};

ExternalDocumentNonStandardH.schema = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.STRING.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  secondaryDocument: joi.object().required(),
};

joiValidationDecorator(
  ExternalDocumentNonStandardH,
  ExternalDocumentNonStandardH.schema,
  ExternalDocumentNonStandardH.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardH: validEntityDecorator(
    ExternalDocumentNonStandardH,
  ),
};

const joi = require('joi');
const {
  baseExternalDocumentValidation,
  externalDocumentDecorator,
} = require('./ExternalDocumentBase');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
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
  externalDocumentDecorator(this, rawProps);

  const { secondaryDocument } = rawProps;
  this.secondaryDocument = ExternalDocumentFactory(secondaryDocument || {});
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
  ...baseExternalDocumentValidation,
  secondaryDocument: joi.object().required(),
  secondaryDocumentFile: joi.object().optional(),
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

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
function ExternalDocumentNonStandardC() {}

ExternalDocumentNonStandardC.prototype.init = function init(rawProps) {
  this.category = rawProps.category;
  this.documentTitle = rawProps.documentTitle;
  this.documentType = rawProps.documentType;
  this.freeText = rawProps.freeText;
  this.previousDocument = rawProps.previousDocument;
};

ExternalDocumentNonStandardC.prototype.getDocumentTitle = function () {
  return replaceBracketed(
    this.documentTitle,
    this.freeText,
    this.previousDocument
      ? this.previousDocument.documentTitle ||
          this.previousDocument.documentType
      : '',
  );
};

ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  freeText: [
    { contains: 'is required', message: 'Enter name' },
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
    },
  ],
};

ExternalDocumentNonStandardC.schema = {
  category: JoiValidationConstants.STRING.required(),
  documentTitle: JoiValidationConstants.DOCUMENT_TITLE.optional(),
  documentType: JoiValidationConstants.STRING.required(),
  freeText: JoiValidationConstants.STRING.max(1000).required(),
  previousDocument: joi
    .object()
    .keys({
      documentTitle: JoiValidationConstants.STRING.optional(),
      documentType: JoiValidationConstants.STRING.required(),
    })
    .required(),
};

joiValidationDecorator(
  validEntityDecorator(ExternalDocumentNonStandardC),
  ExternalDocumentNonStandardC.schema,
  ExternalDocumentNonStandardC.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  ExternalDocumentNonStandardC: validEntityDecorator(
    ExternalDocumentNonStandardC,
  ),
};

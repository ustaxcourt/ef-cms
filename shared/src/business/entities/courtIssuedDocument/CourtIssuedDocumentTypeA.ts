const joi = require('joi');
const {
  courtIssuedDocumentDecorator,
  CourtIssuedDocumentDefault,
} = require('./CourtIssuedDocumentDefault');
const {
  DOCUMENT_TYPES_REQUIRING_DESCRIPTION,
  GENERIC_ORDER_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
  VALIDATION_ERROR_MESSAGES,
} = require('./CourtIssuedDocumentConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { replaceBracketed } = require('../../utilities/replaceBracketed');

/**
 * @param {object} rawProps the raw document data
 * @constructor
 */
function CourtIssuedDocumentTypeA() {}
CourtIssuedDocumentTypeA.prototype.init = function init(rawProps) {
  courtIssuedDocumentDecorator(this, rawProps);
  this.freeText = rawProps.freeText;
  this.isLegacy = rawProps.isLegacy;
  this.serviceStamp = rawProps.serviceStamp;
};

CourtIssuedDocumentTypeA.prototype.getDocumentTitle = function () {
  return replaceBracketed(this.documentTitle, this.freeText);
};

CourtIssuedDocumentTypeA.schema = {
  ...CourtIssuedDocumentDefault.schema,
  freeText: JoiValidationConstants.STRING.max(1000).when('documentType', {
    is: joi.exist().valid(...DOCUMENT_TYPES_REQUIRING_DESCRIPTION),
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  serviceStamp: JoiValidationConstants.STRING.valid(
    ...SERVICE_STAMP_OPTIONS,
  ).when('documentType', {
    is: GENERIC_ORDER_DOCUMENT_TYPE,
    otherwise: joi.optional().allow(null),
    then: joi.when('isLegacy', {
      is: true,
      otherwise: joi.required(),
      then: joi.optional().allow(null),
    }),
  }),
};

joiValidationDecorator(
  CourtIssuedDocumentTypeA,
  CourtIssuedDocumentTypeA.schema,
  VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  CourtIssuedDocumentTypeA: validEntityDecorator(CourtIssuedDocumentTypeA),
};

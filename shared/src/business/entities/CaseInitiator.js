const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');

/**
 * constructor
 * @param rawCaseInitiator
 * @constructor
 */
function CaseInitiator(rawCaseInitiator) {
  Object.assign(this, rawCaseInitiator);
}

joiValidationDecorator(
  CaseInitiator,
  joi.object().keys({
    petitionFile: joi.object().required(),
    requestForPlaceOfTrial: joi.object().required(),
    statementOfTaxpayerIdentificationNumber: joi.object().required(),
  }),
);

module.exports = CaseInitiator;

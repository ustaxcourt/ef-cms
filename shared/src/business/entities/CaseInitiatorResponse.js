const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

/**
 * schema definition
 */
const caseSchema = joi.object().keys({
  petitionDocumentId: joi
    .string()
    .uuid(uuidVersions)
    .required(),
  requestForPlaceOfTrialDocumentId: joi
    .string()
    .uuid(uuidVersions)
    .required(),
  statementOfTaxpayerIdentificationNumberDocumentId: joi
    .string()
    .uuid(uuidVersions)
    .required(),
});

/**
 * Case
 * @param rawCase
 * @constructor
 */
function CaseInitatorResponse(rawResponse) {
  Object.assign(this, rawResponse);
}

/**
 * isValid
 * @returns {boolean}
 */
CaseInitatorResponse.prototype.isValid = function isValid() {
  return joi.validate(this, caseSchema).error === null;
};

/**
 * getValidationError
 * @returns {*}
 */
CaseInitatorResponse.prototype.getValidationError = function getValidationError() {
  return joi.validate(this, caseSchema).error;
};

/**
 * validate
 */
CaseInitatorResponse.prototype.validate = function validate() {
  if (!this.isValid()) {
    throw new Error(
      'The case initiator response was invalid: ' + this.getValidationError(),
    );
  } else {
    return this;
  }
};

module.exports = CaseInitatorResponse;

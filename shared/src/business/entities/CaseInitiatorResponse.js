const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');

const uuidVersions = {
  version: ['uuidv4'],
};

/**
 * Case
 * @param rawCase
 * @constructor
 */
function CaseInitiatorResponse(rawResponse) {
  Object.assign(this, rawResponse);
}

joiValidationDecorator(
  CaseInitiatorResponse,
  joi.object().keys({
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
  }),
);

exports.CaseInitiatorResponse = CaseInitiatorResponse;

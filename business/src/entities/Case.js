const joi = require('joi');
const uuidv4 = require('uuid/v4');

const uuidVersions = {
  version: ['uuidv4'],
};

// TODO: talk to Doug about if we should be using
// separate validation methods for different use cases, or a single validation method?
const caseSchema = joi.object().keys({
  caseId: joi
    .string()
    .uuid(uuidVersions)
    .optional(),
  userId: joi
    .string()
    // .uuid(uuidVersions)
    .optional(),
  createdAt: joi
    .date()
    .iso()
    .optional(),
  docketNumber: joi
    .string()
    .regex(/^[0-9]{5}-[0-9]{2}$/)
    .optional(),
  status: joi
    .string()
    .regex(/^(new)|(general)$/)
    .optional(),
  documents: joi
    .array()
    .length(3)
    .items(
      joi.object({
        documentId: joi
          .string()
          .uuid(uuidVersions)
          .required(),
        documentType: joi.string().required(),
      }),
    )
    .required(),
});

function Case(rawCase) {
  Object.assign(this, rawCase, {
    caseId: uuidv4(),
    createdAt: new Date().toISOString(),
    status: 'new',
  });
}

Case.prototype.isValid = function isValid() {
  return joi.validate(this, caseSchema).error === null;
};

Case.prototype.getValidationError = function getValidationError() {
  return joi.validate(this, caseSchema).error;
};

Case.prototype.validate = function validate() {
  if (!this.isValid()) {
    throw new Error('The case was invalid ' + this.getValidationError());
  }
};

Case.documentTypes = {
  petitionFile: 'Petition',
  requestForPlaceOfTrial: 'Request for Place of Trial',
  statementOfTaxpayerIdentificationNumber:
    'Statement of Taxpayer Identification Number',
};

module.exports = Case;

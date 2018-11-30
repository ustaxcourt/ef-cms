const joi = require('joi-browser');
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
  payGovId: joi.string().optional(),
  payGovDate: joi
    .date()
    .iso()
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
        validated: joi.boolean().optional(),
      }),
    )
    .required(),
});

function Case(rawCase) {
  Object.assign(
    this,
    rawCase,
    {
      caseId: uuidv4(),
      createdAt: new Date().toISOString(),
      status: 'new',
    },
    rawCase.payGovId ? { payGovDate: new Date().toISOString() } : null ,
  );
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

Case.prototype.isPetitionPackageReviewed = function isPetitionPackageReviewed() {
  return this.documents.every(document => document.validated === true);
};

Case.isValidUUID = caseId =>
  caseId &&
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    caseId,
  );

Case.isValidDocketNumber = docketNumber =>
  docketNumber && /\d{5}-\d{2}/.test(docketNumber);

Case.documentTypes = {
  petitionFile: 'Petition',
  requestForPlaceOfTrial: 'Request for Place of Trial',
  statementOfTaxpayerIdentificationNumber:
    'Statement of Taxpayer Identification Number',
};

module.exports = Case;

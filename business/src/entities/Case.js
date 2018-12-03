const joi = require('joi-browser');
const uuidv4 = require('uuid/v4');

const uuidVersions = {
  version: ['uuidv4'],
};

/**
 * schema definition
 */
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
  irsSendDate: joi
    .date()
    .iso()
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
        userId: joi
          .string()
          // .uuid(uuidVersions)
          .optional(),
        documentType: joi.string().required(),
        validated: joi.boolean().optional(),
        reviewDate: joi
          .date()
          .iso()
          .optional(),
        reviewUser: joi.string().optional(),
        status: joi.string().optional(),
        servedDate: joi
          .date()
          .iso()
          .optional(),
        createdAt: joi
          .date()
          .iso()
          .optional(),
      }),
    )
    .required(),
});

/**
 * Case
 * @param rawCase
 * @constructor
 */
function Case(rawCase) {
  Object.assign(
    this,
    rawCase,
    {
      caseId: rawCase.caseId ? rawCase.caseId : uuidv4(),
      createdAt: rawCase.createdAt
        ? rawCase.createdAt
        : new Date().toISOString(),
      status: rawCase.status ? rawCase.status : 'new',
    },
    rawCase.payGovId && !rawCase.payGovDate
      ? { payGovDate: new Date().toISOString() }
      : null,
  );
}

/**
 * isValid
 * @returns {boolean}
 */
Case.prototype.isValid = function isValid() {
  return joi.validate(this, caseSchema).error === null;
};
/**
 * getValidationError
 * @returns {*}
 */
Case.prototype.getValidationError = function getValidationError() {
  return joi.validate(this, caseSchema).error;
};

/**
 * validate
 */
Case.prototype.validate = function validate() {
  if (!this.isValid()) {
    throw new Error('The case was invalid ' + this.getValidationError());
  }
};

/**
 * validateWithError
 * will throw the error provided if the case entity is invalid
 */
Case.prototype.validateWithError = function validate(error) {
  if (!this.isValid()) {
    throw error;
  }
};

/**
 * isPetitionPackageReviewed
 * @returns boolean
 */
Case.prototype.isPetitionPackageReviewed = function isPetitionPackageReviewed() {
  return this.documents.every(document => document.validated === true);
};

/**
 * markAsSentToIrs
 */
Case.prototype.markAsSentToIRS = function() {
  this.irsSendDate = new Date().toISOString();
  this.status = 'general';
  this.documents.every(document => (document.status = 'served'));
};

Case.prototype.markAsPaidByPayGov = function(payGovDate) {
  this.payGovDate = payGovDate;
}

/**
 * isValidCaseId
 * @param caseId
 * @returns {*|boolean}
 */
Case.isValidCaseId = caseId =>
  caseId &&
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    caseId,
  );
/**
 * isValidDocketNumber
 * @param docketNumber
 * @returns {*|boolean}
 */
Case.isValidDocketNumber = docketNumber =>
  docketNumber && /\d{5}-\d{2}/.test(docketNumber);
/**
 * documentTypes
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, statementOfTaxpayerIdentificationNumber: string}}
 */
Case.documentTypes = {
  petitionFile: 'Petition',
  requestForPlaceOfTrial: 'Request for Place of Trial',
  statementOfTaxpayerIdentificationNumber:
    'Statement of Taxpayer Identification Number',
};

module.exports = Case;

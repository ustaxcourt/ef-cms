const { joiValidationDecorator } = require('./JoiValidationDecorator');
const joi = require('joi-browser');
const uuidv4 = require('uuid/v4');

const uuidVersions = {
  version: ['uuidv4'],
};

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

joiValidationDecorator(
  Case,
  joi.object().keys({
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
      .required(),
    respondentId: joi.string().optional(),
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
      .min(3)
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
  }),
);

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
Case.prototype.markAsSentToIRS = function(sendDate) {
  this.irsSendDate = sendDate;
  this.status = 'general';
  this.documents.every(document => (document.status = 'served'));
  return this;
};

Case.prototype.markAsPaidByPayGov = function(payGovDate) {
  this.payGovDate = payGovDate;
  return this;
};

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
Case.isValidDocketNumber = docketNumber => {
  return (
    docketNumber &&
    /^\d{5}-\d{2}$/.test(docketNumber) &&
    parseInt(docketNumber.split('-')[0]) > 100
  );
};

Case.prototype.preValidate = function() {
  return Case.isValidDocketNumber(this.docketNumber);
};

/**
 * documentTypes
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, statementOfTaxpayerIdentificationNumber: string}}
 */
Case.documentTypes = {
  petitionFile: 'Petition',
  requestForPlaceOfTrial: 'Request for Place of Trial',
  statementOfTaxpayerIdentificationNumber:
    'Statement of Taxpayer Identification Number',
  answer: 'Answer',
};

module.exports = Case;

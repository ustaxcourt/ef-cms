const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const uuid = require('uuid');

const uuidVersions = {
  version: ['uuidv4'],
};

const Document = require('./Document');

const docketNumberMatcher = /^(\d{3,5}-\d{2})$/;
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
      caseId: rawCase.caseId ? rawCase.caseId : uuid.v4(),
      createdAt: rawCase.createdAt
        ? rawCase.createdAt
        : new Date().toISOString(),
      status: rawCase.status ? rawCase.status : 'new',
    },
    rawCase.payGovId && !rawCase.payGovDate
      ? { payGovDate: new Date().toISOString() }
      : null,
  );

  if (this.documents && Array.isArray(this.documents)) {
    this.documents = this.documents.map(document => new Document(document));
  } else {
    this.documents = [];
  }

  this.petitioners = [];
  this.petitioners.push({
    name: 'test taxpayer',
    address: '123',
    email: 'test@example.com',
    phone: '(123) 456-7890',
  });
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
      .regex(docketNumberMatcher)
      .required(),
    respondent: joi.object().keys({
      respondentId: joi.string().optional(),
      name: joi.string().optional(),
      addressLine1: joi.string().optional(),
      addressLine2: joi.string().optional(),
      city: joi.string().optional(),
      state: joi.string().optional(),
      zip: joi.string().optional(),
      email: joi.string().optional(),
      isIRSAttorney: joi.boolean().optional(),
      phone: joi.string().optional(),
      barNumber: joi.string().optional(),
    }),
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
      .regex(/^(new|general)$/)
      .optional(),
    petitioners: joi
      .array()
      .optional(),
    documents: joi
      .array()
      .min(3)
      .required(),
  }),
  function() {
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents)
    );
  },
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
    docketNumberMatcher.test(docketNumber) &&
    parseInt(docketNumber.split('-')[0]) > 100
  );
};

Case.stripLeadingZeros = docketNumber => {
  const [number, year] = docketNumber.split('-');
  return `${parseInt(number)}-${year}`;
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

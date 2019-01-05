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

const CASE_TYPES = [
  { type: 'Deficiency', description: 'Notice of Deficiency' },
  {
    type: 'CDP (Lien/Levy)',
    description: 'Notice of Determination Concerning Collection Action',
  },
  {
    type: 'Innocent Spouse',
    description:
      'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
  },
  {
    type: 'Readjustment',
    description: 'Readjustment of Partnership Items Code Section 6226',
  },
  {
    type: 'Adjustment',
    description: 'Adjustment of Partnership Items Code Section 6228',
  },
  {
    type: 'Partnership',
    description: 'Partnership Action Under BBA Section 1101',
  },
  {
    type: 'Whistleblower',
    description:
      'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
  },
  {
    type: 'Worker Classification',
    description: 'Notice of Determination of Worker Classification',
  },
  {
    type: 'Retirement Plan',
    description: 'Declaratory Judgment (Retirement Plan)',
  },
  {
    type: 'Exempt Organization',
    description: 'Declaratory Judgment (Exempt Organization)',
  },
  {
    type: 'Passport',
    description:
      'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
  },
  {
    type: 'Interest Abatement',
    description:
      'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim (or Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement)',
  },
];

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
      caseId: rawCase.caseId || uuid.v4(),
      createdAt: rawCase.createdAt || new Date().toISOString(),
      status: rawCase.status || 'new',
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
    respondent: joi.object().optional(),
    irsNoticeDate: joi
      .date()
      .iso()
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
      .regex(/^(new|general)$/)
      .optional(),
    petitioners: joi.array().optional(),
    documents: joi
      .array()
      .min(3)
      .required(),
    workItems: joi.array().optional(),
  }),
  function() {
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents)
    );
  },
);

Case.prototype.attachDocument = function({ documentType, documentId, userId }) {
  const documentMetadata = {
    documentType,
    documentId,
    userId: userId,
    filedBy: 'Respondent',
    createdAt: new Date().toISOString(),
  };

  this.documents = [...(this.documents || []), documentMetadata];
  this.documents = this.documents.map(document => new Document(document));

  return documentMetadata;
};

Case.prototype.attachRespondent = function({ user }) {
  const respondent = {
    ...user,
    respondentId: user.userId,
  };

  this.respondent = respondent;
};

Case.prototype.addDocument = function(document) {
  document.caseId = this.caseId;
  this.documents = [...(this.documents || []), document];
};

/**
 * markAsSentToIrs
 */
Case.prototype.markAsSentToIRS = function(sendDate) {
  this.irsSendDate = sendDate;
  this.status = 'general';
  this.documents.forEach(document => {
    const doc = new Document(document);
    if (doc.isPetitionDocument()) {
      document.status = 'served';
    }
  });
  return this;
};

Case.prototype.markAsPaidByPayGov = function(payGovDate) {
  this.payGovDate = payGovDate;
  return this;
};

Case.getCaseTypes = () => {
  return CASE_TYPES;
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
  stipulatedDecision: 'Stipulated Decision',
};

module.exports = Case;

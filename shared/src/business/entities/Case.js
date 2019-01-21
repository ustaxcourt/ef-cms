const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const uuid = require('uuid');
const { uniq } = require('lodash');
const { getDocketNumberSuffix } = require('../utilities/getDocketNumberSuffix');

const YearAmount = require('./YearAmount');

const uuidVersions = {
  version: ['uuidv4'],
};

const { REGULAR_TRIAL_CITIES, SMALL_TRIAL_CITIES } = require('./TrialCities');
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
  {
    type: 'Other',
    description: 'Other',
  },
];

// This is the order that they appear in the UI
const PROCEDURE_TYPES = ['Regular', 'Small'];

/**
 * Case
 * @param rawCase
 * @constructor
 */
function Case(rawCase) {
  const Document = require('./Document');
  Object.assign(
    this,
    rawCase,
    {
      caseId: rawCase.caseId || uuid.v4(),
      createdAt: rawCase.createdAt || new Date().toISOString(),
      status: rawCase.status || 'new',
      caseTitle:
        rawCase.petitioners && rawCase.petitioners.length
          ? `${
              rawCase.petitioners[0].name
            }, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`
          : '',
    },
    {
      docketNumberSuffix: getDocketNumberSuffix(rawCase),
    },
    rawCase.payGovId && !rawCase.payGovDate
      ? { payGovDate: new Date().toISOString() }
      : null,
  );

  this.yearAmounts = (this.yearAmounts || []).map(
    yearAmount => new YearAmount(yearAmount),
  );

  if (this.documents && Array.isArray(this.documents)) {
    this.documents = this.documents.map(document => new Document(document));
  } else {
    this.documents = [];
  }
}

Case.name = 'Case';

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
    caseTitle: joi.string().required(),
    caseType: joi.string().required(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    docketNumber: joi
      .string()
      .regex(docketNumberMatcher)
      .required(),
    docketNumberSuffix: joi
      .string()
      .allow(null)
      .optional(),
    respondent: joi
      .object()
      .allow(null)
      .optional(),
    irsNoticeDate: joi
      .date()
      .iso()
      .allow(null)
      .optional(),
    irsSendDate: joi
      .date()
      .iso()
      .optional(),
    payGovId: joi.string().optional(),
    payGovDate: joi
      .date()
      .iso()
      .allow(null)
      .optional(),
    status: joi
      .string()
      .regex(/^(new|general)$/)
      .optional(),
    petitioners: joi.array().optional(),
    documents: joi
      .array()
      .min(1)
      .required(),
    workItems: joi.array().optional(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    yearAmounts: joi.array().optional(),
  }),
  function() {
    const Document = require('./Document');
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents) &&
      YearAmount.validateCollection(this.yearAmounts) &&
      uniq(this.yearAmounts).length === this.yearAmounts.length
    );
  },
  {
    caseTitle: 'A case title is required.',
    docketNumber: 'Docket number is required.',
    documents: 'At least one valid document is required.',
    caseType: 'Case Type is required.',
    petitioners: 'At least one valid petitioner is required.',
    irsNoticeDate: 'A valid IRS Notice Date is a required field for serving.',
    procedureType: 'Procedure Type is required.',
    preferredTrialCity: 'Preferred Trial City is required.',
    yearAmounts: 'A valid year and amount are required.',
    payGovId: 'Fee Payment Id must be in a valid format',
    payGovDate: 'Pay Gov Date is required',
  },
);

Case.prototype.attachDocument = function({ documentType, documentId, userId }) {
  const Document = require('./Document');

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
  const Document = require('./Document');

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

/**
 * stripLeadingZeros
 * @param docketNumber
 * @returns {string}
 */
Case.stripLeadingZeros = docketNumber => {
  const [number, year] = docketNumber.split('-');
  return `${parseInt(number)}-${year}`;
};

/**
 * documentTypes
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, statementOfTaxpayerIdentificationNumber: string, answer: string, stipulatedDecision: string}}
 */
Case.documentTypes = {
  petitionFile: 'Petition',
  requestForPlaceOfTrial: 'Request for Place of Trial',
  statementOfTaxpayerIdentificationNumber:
    'Statement of Taxpayer Identification Number',
  answer: 'Answer',
  stipulatedDecision: 'Stipulated Decision',
  irsNotice: 'IRS Notice',
};

Case.getDocumentTypes = () => {
  return Object.keys(Case.documentTypes).map(key => Case.documentTypes[key]);
};

/**
 * getProcedureTypes
 * @returns {string[]}
 */
Case.getProcedureTypes = () => {
  return PROCEDURE_TYPES;
};

/**
 * getTrialCities
 * @param procedureType
 * @returns {*[]}
 */
Case.getTrialCities = procedureType => {
  switch (procedureType) {
    case 'Small':
      return SMALL_TRIAL_CITIES;
    case 'Regular':
      return REGULAR_TRIAL_CITIES;
    default:
      return REGULAR_TRIAL_CITIES;
  }
};

module.exports = Case;

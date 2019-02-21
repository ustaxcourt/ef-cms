const moment = require('moment');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const uuid = require('uuid');
const { uniqBy } = require('lodash');
const { getDocketNumberSuffix } = require('../utilities/getDocketNumberSuffix');
const YearAmount = require('./YearAmount');
const DocketRecord = require('./DocketRecord');

const uuidVersions = {
  version: ['uuidv4'],
};

const statusMap = {
  general: 'General',
  batchedForIRS: 'Batched for IRS',
  new: 'New',
  recalled: 'Recalled',
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

const FILING_TYPES = ['Myself', 'Myself and my spouse', 'A business', 'Other'];

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
      status: rawCase.status || 'New',
    },
    {
      docketNumberSuffix:
        rawCase.docketNumberSuffix || getDocketNumberSuffix(rawCase),
    },
  );

  this.yearAmounts = (this.yearAmounts || []).map(
    yearAmount => new YearAmount(yearAmount),
  );

  if (Array.isArray(this.documents)) {
    this.documents = this.documents.map(document => new Document(document));
  } else {
    this.documents = [];
  }

  if (Array.isArray(this.docketRecord)) {
    this.docketRecord = this.docketRecord.map(
      docketRecord => new DocketRecord(docketRecord),
    );
  } else {
    this.docketRecord = [];
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
    docketRecord: joi.array().optional(),
    respondent: joi
      .object()
      .allow(null)
      .optional(),
    irsNoticeDate: joi
      .date()
      .iso()
      .allow(null)
      .max('now')
      .optional(),
    irsSendDate: joi
      .date()
      .iso()
      .optional(),
    payGovId: joi
      .string()
      .allow(null)
      .optional(),
    payGovDate: joi
      .date()
      .iso()
      .max('now')
      .allow(null)
      .optional(),
    hasIrsNotice: joi.boolean().optional(),
    status: joi
      .string()
      .valid(Object.keys(statusMap).map(key => statusMap[key]))
      .optional(),
    documents: joi
      .array()
      .min(1)
      .required(),
    workItems: joi.array().optional(),
    preferredTrialCity: joi.string().required(),
    procedureType: joi.string().required(),
    filingType: joi.string().required(),
    yearAmounts: joi
      .array()
      .unique((a, b) => a.year === b.year)
      .optional(),
  }),
  function() {
    const Document = require('./Document');
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents) &&
      YearAmount.validateCollection(this.yearAmounts) &&
      Case.areYearsUnique(this.yearAmounts) &&
      DocketRecord.validateCollection(this.docketRecord)
    );
  },
  {
    docketNumber: 'Docket number is required.',
    documents: 'At least one valid document is required.',
    caseType: 'Case Type is required.',
    irsNoticeDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'The IRS notice date is in the future. Please enter a valid date.',
      },
      'Please enter a valid IRS notice date.',
    ],
    procedureType: 'Procedure Type is required.',
    filingType: 'Filing Type is required.',
    partyType: 'Party Type is required.',
    preferredTrialCity: 'Preferred Trial City is required.',
    yearAmounts: [
      {
        contains: 'contains a duplicate',
        message: 'Duplicate years are not allowed',
      },
      'A valid year and amount are required.',
    ],
    payGovId: 'Fee Payment Id must be in a valid format',
    payGovDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'The Fee Payment date is in the future. Please enter a valid date.',
      },
      'Please enter a valid Fee Payment date.',
    ],
  },
);

/**
 * builds the case title from case contact name(s) based on party type
 *
 * @param rawCase
 * @returns {string}
 */
Case.getCaseTitle = function(rawCase) {
  let caseCaption;
  switch (rawCase.partyType) {
    case 'Petitioner':
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Petitioner & Spouse':
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Petitioners v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Petitioner & Deceased Spouse':
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Deceased, ${
        rawCase.contactPrimary.name
      }, Surviving Spouse, Petitioners v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Estate with an Executor/Personal Representative/Fiduciary/etc.':
      caseCaption = `Estate of ${rawCase.contactSecondary.name}, Deceased, ${
        rawCase.contactPrimary.name
      }, ${
        rawCase.contactPrimary.title
      }, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Estate without an Executor/Personal Representative/Fiduciary/etc.':
      caseCaption = `Estate of ${
        rawCase.contactPrimary.name
      }, Deceased, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Trust':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Trustee, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Corporation':
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Partnership (as the tax matters partner)':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Partnership (as a partner other than tax matters partner)':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, A Partner Other Than the Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Partnership (as a partnership representative under the BBA regime)':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Partnership Representative, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Conservator':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Conservator, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Guardian':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Guardian, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Custodian':
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Custodian, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Next Friend for a Minor (Without a Guardian, Conservator, or other like Fiduciary)':
      caseCaption = `${rawCase.contactSecondary.name}, Minor, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Next Friend for an Incompetent Person (Without a Guardian, Conservator, or other like Fiduciary)':
      caseCaption = `${rawCase.contactSecondary.name}, Incompetent, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Donor':
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Donor, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Transferee':
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Transferee, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case 'Surviving Spouse':
      caseCaption = `${rawCase.contactSecondary.name}, Deceased, ${
        rawCase.contactPrimary.name
      }, Surviving Spouse, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
  }
  return caseCaption;
};

Case.prototype.attachRespondent = function({ user }) {
  const respondent = {
    ...user,
    respondentId: user.userId,
  };

  this.respondent = respondent;
};
/**
 *
 * @param document
 */
Case.prototype.addDocument = function(document) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];

  this.addDocketRecord(
    new DocketRecord({
      filingDate: document.createdAt,
      filedBy: document.filedBy,
      description: document.documentType,
      status: document.status,
    }),
  );
};

/**
 *
 * @param sendDate
 * @returns {Case}
 */
Case.prototype.markAsSentToIRS = function(sendDate) {
  const Document = require('./Document');

  this.irsSendDate = sendDate;
  this.status = 'General';
  this.documents.forEach(document => {
    const doc = new Document(document);
    if (doc.isPetitionDocument()) {
      document.status = 'served';
    }
  });

  const status = `R served on ${moment(sendDate).format('L LT')}`;
  this.docketRecord.forEach(docketRecord => {
    if (docketRecord.description === Case.documentTypes.petitionFile) {
      docketRecord.status = status;
    }
  });

  return this;
};

/**
 *
 * @param sendDate
 * @returns {Case}
 */
Case.prototype.sendToIRSHoldingQueue = function() {
  this.status = statusMap.batchedForIRS;
  return this;
};

Case.prototype.recallFromIRSHoldingQueue = function() {
  this.status = statusMap.recalled;
  return this;
};

/**
 *
 * @param {string} payGovDate an ISO formatted datestring
 * @returns {Case}
 */
Case.prototype.markAsPaidByPayGov = function(payGovDate) {
  this.payGovDate = payGovDate;
  if (payGovDate) {
    this.addDocketRecord(
      new DocketRecord({
        filingDate: payGovDate,
        description: 'Filing fee paid',
      }),
    );
  }
  return this;
};

/**
 *
 * @param docketRecordEntity
 */
Case.prototype.addDocketRecord = function(docketRecordEntity) {
  this.docketRecord = [...this.docketRecord, docketRecordEntity];
};

/**
 *
 * @returns {*[]}
 */
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
  // statementOfTaxpayerIdentificationNumber:
  //   'Statement of Taxpayer Identification Number',
  ownershipDisclosure: 'Ownership Disclosure Statement',
  answer: 'Answer',
  stipulatedDecision: 'Stipulated Decision',
};

/**
 *
 * @param yearAmounts
 * @returns {boolean}
 */
Case.areYearsUnique = yearAmounts => {
  return uniqBy(yearAmounts, 'year').length === yearAmounts.length;
};

/**
 *
 * @returns {*[]}
 */
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
 * getFilingTypes
 * @returns {string[]}
 */
Case.getFilingTypes = () => {
  return FILING_TYPES;
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

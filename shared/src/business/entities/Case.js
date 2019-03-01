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
const { PARTY_TYPES } = require('./Contacts/PetitionContact');

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
  'Deficiency',
  'CDP (Lien/Levy)',
  'Innocent Spouse',
  'Partnership (Section 6226)',
  'Partnership (Section 6228)',
  'Partnership (BBA Section 1101)',
  'Whistleblower',
  'Worker Classification',
  'Declaratory Judgment (Retirement Plan)',
  'Declaratory Judgment (Exempt Organization)',
  'Passport',
  'Interest Abatement',
  'Other',
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
      .max('now')
      .when('hasVerifiedIrsNotice', {
        is: true,
        then: joi.required(),
        otherwise: joi.optional().allow(null),
      }),
    irsSendDate: joi
      .date()
      .iso()
      .optional(),
    partyType: joi.string().required(),
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
    hasIrsNotice: joi.boolean().required(),
    hasVerifiedIrsNotice: joi
      .boolean()
      .optional()
      .allow(null),
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
    hasIrsNotice: 'You must indicate whether you received an IRS notice.',
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
    case PARTY_TYPES.petitioner:
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Petitioners v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Deceased, ${
        rawCase.contactPrimary.name
      }, Surviving Spouse, Petitioners v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${rawCase.contactSecondary.name}, Deceased, ${
        rawCase.contactPrimary.name
      }, ${
        rawCase.contactPrimary.title
      }, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${
        rawCase.contactPrimary.name
      }, Deceased, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Trustee, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.corporation:
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, A Partner Other Than the Tax Matters Partner, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Partnership Representative, Petitioner(s) v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Conservator, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Guardian, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Custodian, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${rawCase.contactSecondary.name}, Minor, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${rawCase.contactSecondary.name}, Incompetent, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Donor, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${
        rawCase.contactPrimary.name
      }, Transferee, Petitioner v. Commissioner of Internal Revenue, Respondent`;
      break;
    case PARTY_TYPES.survivingSpouse:
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

module.exports = Case;

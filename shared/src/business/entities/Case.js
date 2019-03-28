const moment = require('moment');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const joi = require('joi-browser');
const uuid = require('uuid');
const { DocketRecord } = require('./DocketRecord');
const { getDocketNumberSuffix } = require('../utilities/getDocketNumberSuffix');
const { PARTY_TYPES } = require('./contacts/PetitionContact');
const { uniqBy } = require('lodash');
const { YearAmount } = require('./YearAmount');

const uuidVersions = {
  version: ['uuidv4'],
};

const statusMap = {
  batchedForIRS: 'Batched for IRS',
  generalDocket: 'General Docket',
  new: 'New',
  recalled: 'Recalled',
};

exports.STATUS_TYPES = statusMap;

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

const FILING_TYPES = {
  petitioner: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  practitioner: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

exports.CASE_CAPTION_POSTFIX =
  'v. Commissioner of Internal Revenue, Respondent';

/**
 * Case
 * @param rawCase
 * @constructor
 */
function Case(rawCase) {
  const { Document } = require('./Document');

  Object.assign(
    this,
    rawCase,
    {
      caseId: rawCase.caseId || uuid.v4(),
      createdAt: rawCase.createdAt || new Date().toISOString(),
      status: rawCase.status || statusMap.new,
    },
    {
      docketNumberSuffix: getDocketNumberSuffix(rawCase),
    },
  );

  this.initialDocketNumberSuffix =
    this.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

  if (this.caseCaption) {
    this.caseTitle = `${this.caseCaption.trim()} ${
      exports.CASE_CAPTION_POSTFIX
    }`;
    this.initialTitle = this.initialTitle || this.caseTitle;
  }

  this.yearAmounts = (this.yearAmounts || []).map(
    yearAmount => new YearAmount(yearAmount),
  );

  if (Array.isArray(this.documents)) {
    this.documents = this.documents.map(document => new Document(document));
  } else {
    this.documents = [];
  }

  this.documents.forEach(document => {
    document.workItems.forEach(workItem => {
      workItem.docketNumberSuffix = this.docketNumberSuffix;
    });
  });

  if (Array.isArray(this.docketRecord)) {
    this.docketRecord = this.docketRecord.map(
      docketRecord => new DocketRecord(docketRecord),
    );
  } else {
    this.docketRecord = [];
  }

  const isNewCase = this.status === statusMap.new;

  if (!isNewCase) {
    this.updateDocketNumberRecord();
  }

  this.noticeOfAttachments = this.noticeOfAttachments || false;
  this.orderForAmendedPetition = this.orderForAmendedPetition || false;
  this.orderForAmendedPetitionAndFilingFee =
    this.orderForAmendedPetitionAndFilingFee || false;
  this.orderForFilingFee = this.orderForFilingFee || false;
  this.orderForOds = this.orderForOds || false;
  this.orderForRatification = this.orderForRatification || false;
  this.orderToShowCause = this.orderToShowCause || false;

  const trialRecord = this.docketRecord.find(
    record => record.description.indexOf('Request for Place of Trial') !== -1,
  );

  if (this.preferredTrialCity) {
    if (!trialRecord) {
      this.addDocketRecord(
        new DocketRecord({
          description: `Request for Place of Trial at ${
            this.preferredTrialCity
          }`,
          filingDate: this.receivedAt || this.createdAt,
        }),
      );
    }
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
    caseType: joi.string().optional(),
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
    documents: joi.array().optional(),
    filingType: joi.string().optional(),
    hasIrsNotice: joi.boolean().optional(),
    hasVerifiedIrsNotice: joi
      .boolean()
      .optional()
      .allow(null),
    initialDocketNumberSuffix: joi
      .string()
      .allow(null)
      .optional(),
    initialTitle: joi
      .string()
      .allow(null)
      .optional(),
    irsNoticeDate: joi
      .date()
      .iso()
      .max('now')
      .optional()
      .allow(null),
    irsSendDate: joi
      .date()
      .iso()
      .optional(),
    isPaper: joi.boolean().optional(),
    noticeOfAttachments: joi.boolean().optional(),
    orderForAmendedPetition: joi.boolean().optional(),
    orderForAmendedPetitionAndFilingFee: joi.boolean().optional(),
    orderForFilingFee: joi.boolean().optional(),
    orderForOds: joi.boolean().optional(),
    orderForRatification: joi.boolean().optional(),
    orderToShowCause: joi.boolean().optional(),
    partyType: joi.string().optional(),
    payGovDate: joi
      .date()
      .iso()
      .max('now')
      .allow(null)
      .optional(),
    payGovId: joi
      .string()
      .allow(null)
      .optional(),
    practitioner: joi
      .object()
      .allow(null)
      .optional(),
    preferredTrialCity: joi
      .string()
      .optional()
      .allow(null),
    procedureType: joi.string().optional(),
    receivedAt: joi //TODO - should we be storing M/D/YY as ISO strings?
      .date()
      .iso()
      .max('now')
      .optional()
      .allow(null),
    respondent: joi
      .object()
      .allow(null)
      .optional(),
    status: joi
      .string()
      .valid(Object.keys(statusMap).map(key => statusMap[key]))
      .optional(),
    userId: joi
      .string()
      // .uuid(uuidVersions)
      .optional(),
    workItems: joi.array().optional(),
    yearAmounts: joi
      .array()
      .unique((a, b) => a.year === b.year)
      .optional(),
  }),
  function() {
    const { Document } = require('./Document');
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents) &&
      YearAmount.validateCollection(this.yearAmounts) &&
      Case.areYearsUnique(this.yearAmounts) &&
      DocketRecord.validateCollection(this.docketRecord)
    );
  },
  {
    caseType: 'Case Type is required.',
    docketNumber: 'Docket number is required.',
    documents: 'At least one valid document is required.',
    filingType: 'Filing Type is required.',
    hasIrsNotice: 'You must indicate whether you received an IRS notice.',
    irsNoticeDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'The IRS notice date is in the future. Please enter a valid date.',
      },
      'Please enter a valid IRS notice date.',
    ],
    partyType: 'Party Type is required.',
    payGovDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'The Fee Payment date is in the future. Please enter a valid date.',
      },
      'Please enter a valid Fee Payment date.',
    ],
    payGovId: 'Fee Payment Id must be in a valid format',
    preferredTrialCity: 'Preferred Trial City is required.',
    procedureType: 'Procedure Type is required.',
    receivedAt: [
      {
        contains: 'must be less than or equal to',
        message:
          'The Date Received is in the future. Please enter a valid date.',
      },
      'Please enter a valid Date Received.',
    ],
    yearAmounts: [
      {
        contains: 'contains a duplicate',
        message: 'Duplicate years are not allowed',
      },
      'A valid year and amount are required.',
    ],
  },
);

/**
 * builds the case caption from case contact name(s) based on party type
 *
 * @param rawCase
 * @returns {string}
 */
Case.getCaseCaption = function(rawCase) {
  let caseCaption;
  switch (rawCase.partyType) {
    case PARTY_TYPES.corporation:
    case PARTY_TYPES.petitioner:
      caseCaption = `${rawCase.contactPrimary.name}, Petitioner`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Petitioners`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${
        rawCase.contactSecondary.name
      }, Deceased, ${
        rawCase.contactPrimary.name
      }, Surviving Spouse, Petitioners`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${rawCase.contactSecondary.name}, Deceased, ${
        rawCase.contactPrimary.name
      }, ${rawCase.contactPrimary.title}, Petitioner(s)`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${
        rawCase.contactPrimary.name
      }, Deceased, Petitioner`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Trustee, Petitioner(s)`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Partnership Representative, Petitioner(s)`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Conservator, Petitioner`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Guardian, Petitioner`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${rawCase.contactSecondary.name}, ${
        rawCase.contactPrimary.name
      }, Custodian, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${rawCase.contactSecondary.name}, Minor, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${rawCase.contactSecondary.name}, Incompetent, ${
        rawCase.contactPrimary.name
      }, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${rawCase.contactPrimary.name}, Donor, Petitioner`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${rawCase.contactPrimary.name}, Transferee, Petitioner`;
      break;
    case PARTY_TYPES.survivingSpouse:
      caseCaption = `${rawCase.contactSecondary.name}, Deceased, ${
        rawCase.contactPrimary.name
      }, Surviving Spouse, Petitioner`;
      break;
  }
  return caseCaption;
};

/**
 * get the case caption without the ", Petitioner/s/(s)" postfix
 * @param caseCaption
 * @returns caseCaptionNames
 */
Case.getCaseCaptionNames = function(caseCaption) {
  return caseCaption.replace(/\s*,\s*Petitioner(s|\(s\))?\s*$/, '').trim();
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
      description: document.documentType,
      documentId: document.documentId,
      filedBy: document.filedBy,
      filingDate: document.createdAt,
      status: document.status,
    }),
  );
};

/**
 *
 * @param document
 */
Case.prototype.addDocumentWithoutDocketRecord = function(document) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];
};

/**
 *
 * @param sendDate
 * @returns {Case}
 */
Case.prototype.markAsSentToIRS = function(sendDate) {
  const { Document } = require('./Document');

  this.irsSendDate = sendDate;
  this.status = statusMap.generalDocket;
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
 * @param updateCaseTitleDocketRecord
 * @returns {Case}
 */
Case.prototype.updateCaseTitleDocketRecord = function() {
  const caseTitleRegex = /^Caption of case is amended from '(.*)' to '(.*)'/;
  let lastTitle = this.initialTitle;

  this.docketRecord.forEach(docketRecord => {
    const result = caseTitleRegex.exec(docketRecord.description);
    if (result) {
      const [, , changedTitle] = result;
      lastTitle = changedTitle;
    }
  });

  const hasTitleChanged = this.initialTitle && lastTitle !== this.caseTitle;

  if (hasTitleChanged) {
    this.addDocketRecord(
      new DocketRecord({
        description: `Caption of case is amended from '${lastTitle}' to '${
          this.caseTitle
        }'`,
        filingDate: new Date().toISOString(),
      }),
    );
  }

  return this;
};

/**
 *
 * @param updateDocketNumberRecord
 * @returns {Case}
 */
Case.prototype.updateDocketNumberRecord = function() {
  const docketNumberRegex = /^Docket Number is amended from '(.*)' to '(.*)'/;

  const oldDocketNumber =
    this.docketNumber +
    (this.initialDocketNumberSuffix !== '_'
      ? this.initialDocketNumberSuffix
      : '');
  const newDocketNumber = this.docketNumber + (this.docketNumberSuffix || '');

  let found;

  this.docketRecord = this.docketRecord.reduce((acc, docketRecord) => {
    const result = docketNumberRegex.exec(docketRecord.description);
    if (result) {
      const [, , pastChangedDocketNumber] = result;

      if (pastChangedDocketNumber === newDocketNumber) {
        found = true;
        acc.push(docketRecord);
      }
    } else {
      acc.push(docketRecord);
    }
    return acc;
  }, []);

  if (!found && oldDocketNumber != newDocketNumber) {
    this.addDocketRecord(
      new DocketRecord({
        description: `Docket Number is amended from '${oldDocketNumber}' to '${newDocketNumber}'`,
        filingDate: new Date().toISOString(),
      }),
    );
  }

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

Case.prototype.getDocumentById = function({ documentId }) {
  return this.documents.find(document => document.documentId === documentId);
};

/**
 *
 * @param {string} payGovDate an ISO formatted datestring
 * @returns {Case}
 */
Case.prototype.markAsPaidByPayGov = function(payGovDate) {
  this.payGovDate = payGovDate;

  const newDocketItem = {
    description: 'Filing fee paid',
    filingDate: payGovDate,
  };

  let found;
  let docketRecordIndex;
  let datesMatch;

  this.docketRecord.forEach((docketRecord, index) => {
    found = found || docketRecord.description === newDocketItem.description;
    docketRecordIndex = found ? index : docketRecordIndex;
    datesMatch =
      datesMatch ||
      (docketRecord.description === newDocketItem.description &&
        docketRecord.filingDate === newDocketItem.filingDate);
  });

  if (payGovDate && !found) {
    this.addDocketRecord(new DocketRecord(newDocketItem));
  } else if (payGovDate && found && !datesMatch) {
    this.updateDocketRecord(docketRecordIndex, new DocketRecord(newDocketItem));
  }
  return this;
};

/**
 *
 * @param docketRecordEntity
 */
Case.prototype.addDocketRecord = function(docketRecordEntity) {
  this.docketRecord = [...this.docketRecord, docketRecordEntity];
  return this;
};

/**
 *
 * @param docketRecordIndex
 * @param docketRecordEntity
 */
Case.prototype.updateDocketRecord = function(
  docketRecordIndex,
  docketRecordEntity,
) {
  this.docketRecord[docketRecordIndex] = docketRecordEntity;
  return this;
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
 * @type {{petitionFile: string, requestForPlaceOfTrial: string, stin: string, answer: string, stipulatedDecision: string}}
 */
Case.documentTypes = {
  answer: 'Answer',
  ownershipDisclosure: 'Ownership Disclosure Statement',
  petitionFile: 'Petition',
  stin: 'Statement of Taxpayer Identification',
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
 * @param userRole - the role of the user logged in
 * @returns {string[]}
 */
Case.getFilingTypes = userRole => {
  return FILING_TYPES[userRole] || FILING_TYPES.petitioner;
};

/**
 * getWorkItems
 * @returns {WorkItem[]}
 */
Case.prototype.getWorkItems = function() {
  let workItems = [];
  this.documents.forEach(
    document => (workItems = [...workItems, ...(document.workItems || [])]),
  );
  return workItems;
};

exports.Case = Case;

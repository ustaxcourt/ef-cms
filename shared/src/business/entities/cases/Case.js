const joi = require('joi-browser');
const uuid = require('uuid');
const {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} = require('../../utilities/DateHandler');
const {
  getDocketNumberSuffix,
} = require('../../utilities/getDocketNumberSuffix');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { ContactFactory } = require('../contacts/ContactFactory');
const { DocketRecord } = require('../DocketRecord');
const { Document } = require('../Document');
const { find, includes, uniqBy } = require('lodash');
const { MAX_FILE_SIZE_MB } = require('../../../persistence/s3/getUploadPolicy');
const { YearAmount } = require('../YearAmount');

Case.STATUS_TYPES = {
  batchedForIRS: 'Batched for IRS',
  calendared: 'Calendared',
  closed: 'Closed',
  generalDocket: 'General Docket - Not at Issue',
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)',
  new: 'New',
  recalled: 'Recalled',
};

Case.ANSWER_CUTOFF_AMOUNT = 45;
Case.ANSWER_CUTOFF_UNIT = 'day';

Case.CASE_TYPES = [
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
Case.PROCEDURE_TYPES = ['Regular', 'Small'];

Case.FILING_TYPES = {
  petitioner: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  practitioner: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

Case.CASE_CAPTION_POSTFIX = 'v. Commissioner of Internal Revenue, Respondent';

Case.ANSWER_DOCUMENT_CODES = [
  'A',
  'AAPN',
  'ATAP',
  'AAAP',
  'AATP',
  'APA',
  'ATSP',
  'AATS',
  'ASUP',
  'ASAP',
  'AATT',
];

Case.COMMON_ERROR_MESSAGES = {
  caseCaption: 'Case Caption is required.',
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
  ownershipDisclosureFile: 'Ownership Disclosure Statement is required.',
  ownershipDisclosureFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Ownership Disclosure Statement file size is empty.',
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
  petitionFile: 'The Petition file was not selected.',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty.',
  ],
  preferredTrialCity: 'Preferred Trial City is required.',
  procedureType: 'Procedure Type is required.',
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'The Date Received is in the future. Please enter a valid date.',
    },
    'Please enter a valid Date Received.',
  ],
  requestForPlaceOfTrialFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Request for Place of Trial file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Request for Place of Trial file size is empty.',
  ],
  signature: 'You must review the form before submitting.',
  stinFile: 'Statement of Taxpayer Identification Number is required.',
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty.',
  ],
  yearAmounts: [
    {
      contains: 'contains a duplicate',
      message: 'Duplicate years are not allowed',
    },
    'A valid year and amount are required.',
  ],
};

Case.validationName = 'Case';

Case.docketNumberMatcher = /^(\d{3,5}-\d{2})$/;

/**
 * Case Entity
 * Represents a Case that has already been accepted into the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function Case(rawCase) {
  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId || uuid.v4();
  this.caseType = rawCase.caseType;
  this.contactPrimary = rawCase.contactPrimary;
  this.contactSecondary = rawCase.contactSecondary;
  this.createdAt = rawCase.createdAt || createISODateString();
  this.currentVersion = rawCase.currentVersion;
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = getDocketNumberSuffix(rawCase);
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.irsSendDate = rawCase.irsSendDate;
  this.isPaper = rawCase.isPaper;
  this.partyType = rawCase.partyType;
  this.payGovDate = rawCase.payGovDate;
  this.payGovId = rawCase.payGovId;
  this.practitioners = rawCase.practitioners;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt;
  this.respondents = rawCase.respondents || [];
  this.status = rawCase.status || Case.STATUS_TYPES.new;
  this.trialDate = rawCase.trialDate;
  this.trialJudge = rawCase.trialJudge;
  this.trialLocation = rawCase.trialLocation;
  this.trialSessionId = rawCase.trialSessionId;
  this.trialTime = rawCase.trialTime;
  this.userId = rawCase.userId;

  this.initialDocketNumberSuffix =
    rawCase.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

  if (rawCase.caseCaption) {
    this.caseTitle = `${rawCase.caseCaption.trim()} ${
      Case.CASE_CAPTION_POSTFIX
    }`;
    this.initialTitle = rawCase.initialTitle || this.caseTitle;
  }

  this.yearAmounts = (rawCase.yearAmounts || []).map(
    yearAmount => new YearAmount(yearAmount),
  );

  if (Array.isArray(rawCase.documents)) {
    this.documents = rawCase.documents.map(document => new Document(document));
  } else {
    this.documents = [];
  }

  this.documents.forEach(document => {
    document.workItems.forEach(workItem => {
      workItem.docketNumberSuffix = this.docketNumberSuffix;
    });
  });

  if (Array.isArray(rawCase.docketRecord)) {
    this.docketRecord = rawCase.docketRecord.map(
      docketRecord => new DocketRecord(docketRecord),
    );
  } else {
    this.docketRecord = [];
  }

  if (!Array.isArray(this.practitioners)) {
    this.practitioners = [];
  }

  const isNewCase = this.status === Case.STATUS_TYPES.new;

  if (!isNewCase) {
    this.updateDocketNumberRecord();
  }

  this.noticeOfAttachments = rawCase.noticeOfAttachments || false;
  this.orderForAmendedPetition = rawCase.orderForAmendedPetition || false;
  this.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee || false;
  this.orderForFilingFee = rawCase.orderForFilingFee || false;
  this.orderForOds = rawCase.orderForOds || false;
  this.orderForRatification = rawCase.orderForRatification || false;
  this.orderToShowCause = rawCase.orderToShowCause || false;
  this.orderToChangeDesignatedPlaceOfTrial =
    rawCase.orderToChangeDesignatedPlaceOfTrial || false;

  this.orderDesignatingPlaceOfTrial = Case.getDefaultOrderDesignatingPlaceOfTrialValue(
    rawCase.orderDesignatingPlaceOfTrial,
  );
}

joiValidationDecorator(
  Case,
  joi.object().keys({
    caseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    caseType: joi.string().optional(),
    createdAt: joi
      .date()
      .iso()
      .optional(),
    docketNumber: joi
      .string()
      .regex(Case.docketNumberMatcher)
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
    practitioners: joi.array().optional(),
    preferredTrialCity: joi
      .string()
      .optional()
      .allow(null),
    procedureType: joi.string().optional(),
    receivedAt: joi
      .date()
      .iso()
      .max('now')
      .optional()
      .allow(null),
    respondents: joi.array().optional(),
    status: joi
      .string()
      .valid(Object.keys(Case.STATUS_TYPES).map(key => Case.STATUS_TYPES[key]))
      .optional(),
    trialDate: joi
      .date()
      .iso()
      .optional()
      .allow(null),
    trialJudge: joi.string().optional(),
    trialLocation: joi.string().optional(),
    trialSessionId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional(),
    trialTime: joi.string().optional(),
    userId: joi.string().optional(),
    workItems: joi.array().optional(),
    yearAmounts: joi
      .array()
      .unique((a, b) => a.year === b.year)
      .optional(),
  }),
  function() {
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents) &&
      YearAmount.validateCollection(this.yearAmounts) &&
      Case.areYearsUnique(this.yearAmounts) &&
      DocketRecord.validateCollection(this.docketRecord)
    );
  },
  Case.COMMON_ERROR_MESSAGES,
);

/**
 * builds the case caption from case contact name(s) based on party type
 *
 * @param {object} rawCase the raw case data
 * @returns {string} the generated case caption
 */
Case.getCaseCaption = function(rawCase) {
  let caseCaption;
  switch (rawCase.partyType) {
    case ContactFactory.PARTY_TYPES.corporation:
    case ContactFactory.PARTY_TYPES.petitioner:
      caseCaption = `${rawCase.contactPrimary.name}, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.petitionerSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${rawCase.contactSecondary.name}, Petitioners`;
      break;
    case ContactFactory.PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${rawCase.contactSecondary.name}, Deceased, ${rawCase.contactPrimary.name}, Surviving Spouse, Petitioners`;
      break;
    case ContactFactory.PARTY_TYPES.estate:
      caseCaption = `Estate of ${rawCase.contactPrimary.name}, Deceased, ${rawCase.contactPrimary.secondaryName}, ${rawCase.contactPrimary.title}, Petitioner(s)`;
      break;
    case ContactFactory.PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${rawCase.contactPrimary.name}, Deceased, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.trust:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Trustee, Petitioner(s)`;
      break;
    case ContactFactory.PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Tax Matters Partner, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.partnershipBBA:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Partnership Representative, Petitioner(s)`;
      break;
    case ContactFactory.PARTY_TYPES.conservator:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Conservator, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.guardian:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Guardian, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.custodian:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Custodian, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${rawCase.contactPrimary.name}, Minor, ${rawCase.contactPrimary.secondaryName}, Next Friend, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${rawCase.contactPrimary.name}, Incompetent, ${rawCase.contactPrimary.secondaryName}, Next Friend, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.donor:
      caseCaption = `${rawCase.contactPrimary.name}, Donor, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.transferee:
      caseCaption = `${rawCase.contactPrimary.name}, Transferee, Petitioner`;
      break;
    case ContactFactory.PARTY_TYPES.survivingSpouse:
      caseCaption = `${rawCase.contactPrimary.name}, Deceased, ${rawCase.contactPrimary.secondaryName}, Surviving Spouse, Petitioner`;
      break;
  }
  return caseCaption;
};

/**
 * get the case caption without the ", Petitioner/s/(s)" postfix
 *
 * @param {string} caseCaption the original case caption
 * @returns {string} caseCaptionNames the case caption with the postfix removed
 */
Case.getCaseCaptionNames = function(caseCaption) {
  return caseCaption.replace(/\s*,\s*Petitioner(s|\(s\))?\s*$/, '').trim();
};

Case.prototype.attachRespondent = function({ user }) {
  const respondent = {
    ...user,
    respondentId: user.userId,
  };

  this.respondents.push(respondent);
};

Case.prototype.attachPractitioner = function({ user }) {
  const practitioner = {
    ...user,
    practitionerId: user.userId,
  };

  this.practitioners.push(practitioner);
};

/**
 *
 * @param {object} document the document to add to the case
 */
Case.prototype.addDocument = function(document) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];

  this.addDocketRecord(
    new DocketRecord({
      description: document.documentType,
      documentId: document.documentId,
      filedBy: document.filedBy,
      filingDate: this.receivedAt || document.createdAt,
      status: document.status,
    }),
  );
};

/**
 *
 * @param {object} document the document to add to the case
 */
Case.prototype.addDocumentWithoutDocketRecord = function(document) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];
};

Case.prototype.closeCase = function() {
  this.status = Case.STATUS_TYPES.closed;
};

/**
 *
 * @param {Date} sendDate the timestamp when the case was sent to the IRS
 * @returns {Case} the updated case entity
 */
Case.prototype.markAsSentToIRS = function(sendDate) {
  this.irsSendDate = sendDate;
  this.status = Case.STATUS_TYPES.generalDocket;
  this.documents.forEach(document => {
    document.status = 'served';
  });
  const dateServed = prepareDateFromString(undefined, 'L LT');
  const status = `R served on ${dateServed}`;
  this.docketRecord.forEach(docketRecord => {
    if (docketRecord.documentId) {
      docketRecord.status = status;
    }
  });

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
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
        description: `Caption of case is amended from '${lastTitle}' to '${this.caseTitle}'`,
        filingDate: createISODateString(),
      }),
    );
  }

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
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
        filingDate: createISODateString(),
      }),
    );
  }

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.sendToIRSHoldingQueue = function() {
  this.status = Case.STATUS_TYPES.batchedForIRS;
  return this;
};

Case.prototype.recallFromIRSHoldingQueue = function() {
  this.status = Case.STATUS_TYPES.recalled;
  return this;
};

Case.prototype.getDocumentById = function({ documentId }) {
  return this.documents.find(document => document.documentId === documentId);
};

/**
 *
 * @param {string} payGovDate an ISO formatted datestring
 * @returns {Case} the updated case entity
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
    if (docketRecord.description === newDocketItem.description) {
      found = true;
      docketRecordIndex = index;
      if (docketRecord.filingDate === newDocketItem.filingDate) {
        datesMatch = true;
      }
    }
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
 * @param {string} preferredTrialCity the preferred trial city
 * @returns {Case} the updated case entity
 */
Case.prototype.setRequestForTrialDocketRecord = function(preferredTrialCity) {
  this.preferredTrialCity = preferredTrialCity;

  const found = find(this.docketRecord, item =>
    item.description.includes('Request for Place of Trial'),
  );

  if (preferredTrialCity && !found) {
    this.addDocketRecord(
      new DocketRecord({
        description: `Request for Place of Trial at ${this.preferredTrialCity}`,
        eventCode:
          Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
        filingDate: this.receivedAt || this.createdAt,
      }),
    );
  }
  return this;
};

/**
 *
 * @param {DocketRecord} docketRecordEntity the docket record entity to add to case's the docket record
 * @returns {Case} the updated case entity
 */
Case.prototype.addDocketRecord = function(docketRecordEntity) {
  const nextIndex =
    this.docketRecord.reduce(
      (maxIndex, docketRecord, currentIndex) =>
        Math.max(docketRecord.index || 0, currentIndex, maxIndex),
      0,
    ) + 1;
  docketRecordEntity.index = docketRecordEntity.index || nextIndex;
  this.docketRecord = [...this.docketRecord, docketRecordEntity];
  return this;
};

/**
 *
 * @param {DocketRecord} updatedDocketEntry the update docket entry data
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocketRecordEntry = function(updatedDocketEntry) {
  this.docketRecord.some(entry => {
    if (entry.documentId === updatedDocketEntry.documentId) {
      Object.assign(entry, updatedDocketEntry);
      return true;
    }
  });
  return this;
};

/**
 *
 * @param {number} docketRecordIndex the index of the docket record to update
 * @param {DocketRecord} docketRecordEntity the updated docket entry to update on the case
 * @returns {Case} the updated case entity
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
 * @param {Document} updatedDocument the document to update on the case
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocument = function(updatedDocument) {
  this.documents.some(document => {
    if (document.documentId === updatedDocument.documentId) {
      Object.assign(document, updatedDocument);
      return true;
    }
  });
  return this;
};

/**
 * isValidCaseId
 *
 * @param {string} caseId the case id to validate
 * @returns {*|boolean} true if the caseId is valid, false otherwise
 */
Case.isValidCaseId = caseId =>
  caseId &&
  /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(
    caseId,
  );

/**
 * isValidDocketNumber
 *
 * @param {string} docketNumber the docket number to validate
 * @returns {*|boolean} true if the docketNumber is valid, false otherwise
 */
Case.isValidDocketNumber = docketNumber => {
  return (
    docketNumber &&
    Case.docketNumberMatcher.test(docketNumber) &&
    parseInt(docketNumber.split('-')[0]) > 100
  );
};

/**
 * stripLeadingZeros
 *
 * @param {string} docketNumber the docket number
 * @returns {string} the updated docket number
 */
Case.stripLeadingZeros = docketNumber => {
  const [number, year] = docketNumber.split('-');
  return `${parseInt(number)}-${year}`;
};

/**
 *
 * @param {Array} yearAmounts the array of year amounts to check
 * @returns {boolean} true if the years in the array are all unique, false otherwise
 */
Case.areYearsUnique = yearAmounts => {
  return uniqBy(yearAmounts, 'year').length === yearAmounts.length;
};

/**
 * getFilingTypes
 *
 * @param {string} userRole - the role of the user logged in
 * @returns {string[]} array of filing types for the user role
 */
Case.getFilingTypes = userRole => {
  return Case.FILING_TYPES[userRole] || Case.FILING_TYPES.petitioner;
};

/**
 * getWorkItems
 *
 * @returns {WorkItem[]} the work items on the case
 */
Case.prototype.getWorkItems = function() {
  let workItems = [];
  this.documents.forEach(
    document => (workItems = [...workItems, ...(document.workItems || [])]),
  );
  return workItems;
};

/**
 * check a case to see whether it should change to ready for trial and update the
 * status to General Docket - Ready for Trial if so
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.checkForReadyForTrial = function() {
  let docFiledCutoffDate = prepareDateFromString().subtract(
    Case.ANSWER_CUTOFF_AMOUNT,
    Case.ANSWER_CUTOFF_UNIT,
  );

  const isCaseGeneralDocketNotAtIssue =
    this.status === Case.STATUS_TYPES.generalDocket;

  if (isCaseGeneralDocketNotAtIssue) {
    this.documents.forEach(document => {
      const isAnswerDocument = includes(
        Case.ANSWER_DOCUMENT_CODES,
        document.eventCode,
      );

      const docFiledBeforeCutoff = prepareDateFromString(
        document.createdAt,
      ).isBefore(docFiledCutoffDate, Case.ANSWER_CUTOFF_UNIT);

      if (isAnswerDocument && docFiledBeforeCutoff) {
        this.status = Case.STATUS_TYPES.generalDocketReadyForTrial;
      }
    });
  }

  return this;
};

/**
 * generates sort tags used for sorting trials for calendaring
 *
 * @returns {object} the sort tags
 */
Case.prototype.generateTrialSortTags = function() {
  const {
    caseId,
    caseType,
    createdAt,
    preferredTrialCity,
    procedureType,
    receivedAt,
  } = this;

  const caseProcedureSymbol =
    procedureType.toLowerCase() === 'regular' ? 'R' : 'S';

  let casePrioritySymbol = 'C';

  if (caseType.toLowerCase() === 'cdp (lien/levy)') {
    casePrioritySymbol = 'A';
  } else if (caseType.toLowerCase() === 'passport') {
    casePrioritySymbol = 'B';
  }

  const formattedFiledTime = formatDateString(
    receivedAt || createdAt,
    'YYYYMMDDHHmmss',
  );
  const formattedTrialCity = preferredTrialCity.replace(/[\s.,]/g, '');

  const nonHybridSortKey = [
    formattedTrialCity,
    caseProcedureSymbol,
    casePrioritySymbol,
    formattedFiledTime,
    caseId,
  ].join('-');

  const hybridSortKey = [
    formattedTrialCity,
    'H', // Hybrid Tag
    casePrioritySymbol,
    formattedFiledTime,
    caseId,
  ].join('-');

  return {
    hybrid: hybridSortKey,
    nonHybrid: nonHybridSortKey,
  };
};

/**
 * set as calendared
 *
 * @param {object} trialSessionEntity - the trial session that is associated with the case
 * @returns {Case} the updated case entity
 */
Case.prototype.setAsCalendared = function(trialSessionEntity) {
  this.trialSessionId = trialSessionEntity.trialSessionId;
  this.trialDate = trialSessionEntity.startDate;
  this.trialTime = trialSessionEntity.startTime;
  if (trialSessionEntity.judge && trialSessionEntity.judge.name) {
    this.trialJudge = trialSessionEntity.judge.name;
  }
  this.trialLocation = trialSessionEntity.trialLocation;
  this.status = Case.STATUS_TYPES.calendared;
  return this;
};

Case.getDefaultOrderDesignatingPlaceOfTrialValue = function(rawValue) {
  let orderDesignatingPlaceOfTrial = rawValue;
  if (rawValue || rawValue === false) {
    orderDesignatingPlaceOfTrial = rawValue;
  } else if (this.isPaper && !this.preferredTrialCity) {
    orderDesignatingPlaceOfTrial = true;
  } else {
    orderDesignatingPlaceOfTrial = false;
  }
  return orderDesignatingPlaceOfTrial;
};

module.exports = { Case };

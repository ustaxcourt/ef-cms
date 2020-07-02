const joi = require('@hapi/joi');
const {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  CASE_CAPTION_POSTFIX,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  MAX_FILE_SIZE_MB,
  ORDER_TYPES,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
  UNIQUE_OTHER_FILER_TYPE,
} = require('../EntityConstants');
const {
  calculateDifferenceInDays,
  createISODateString,
  formatDateString,
  PATTERNS,
  prepareDateFromString,
} = require('../../utilities/DateHandler');
const {
  getDocketNumberSuffix,
} = require('../../utilities/getDocketNumberSuffix');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { compareStrings } = require('../../utilities/sortFunctions');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Correspondence } = require('../Correspondence');
const { DocketRecord } = require('../DocketRecord');
const { Document } = require('../Document');
const { find, includes, isEmpty } = require('lodash');
const { getTimestampSchema } = require('../../../utilities/dateSchema');
const { IrsPractitioner } = require('../IrsPractitioner');
const { PrivatePractitioner } = require('../PrivatePractitioner');
const { Statistic } = require('../Statistic');
const { User } = require('../User');
const joiStrictTimestamp = getTimestampSchema();

Case.VALIDATION_ERROR_MESSAGES = {
  applicationForWaiverOfFilingFeeFile:
    'Upload an Application for Waiver of Filing Fee',
  applicationForWaiverOfFilingFeeFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Filing Fee Waiver file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Filing Fee Waiver file size is empty',
  ],
  caseCaption: 'Enter a case caption',
  caseType: 'Select a case type',
  docketNumber: 'Docket number is required',
  docketRecord: 'At least one valid Docket Record is required',
  documents: 'At least one valid document is required',
  filingType: 'Select on whose behalf you are filing',
  hasIrsNotice: 'Indicate whether you received an IRS notice',
  hasVerifiedIrsNotice: 'Indicate whether you received an IRS notice',
  irsNoticeDate: [
    {
      contains: 'must be less than or equal to',
      message:
        'The IRS notice date cannot be in the future. Enter a valid date.',
    },
    'Please enter a valid IRS notice date',
  ],
  mailingDate: 'Enter a mailing date',
  ownershipDisclosureFile: 'Upload an Ownership Disclosure Statement',
  ownershipDisclosureFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Ownership Disclosure Statement file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Ownership Disclosure Statement file size is empty',
  ],
  partyType: 'Select a party type',
  petitionFile: 'Upload a Petition',
  petitionFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Petition file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Petition file size is empty',
  ],
  petitionPaymentDate: 'Enter a valid payment date',
  petitionPaymentMethod: 'Enter payment method',
  petitionPaymentStatus: 'Enter payment status',
  petitionPaymentWaivedDate: 'Enter a valid date waived',
  preferredTrialCity: 'Select a trial location',
  procedureType: 'Select a case procedure',
  receivedAt: [
    {
      contains: 'must be less than or equal to',
      message: 'Date received cannot be in the future. Enter a valid date.',
    },
    'Enter a valid date received',
  ],
  requestForPlaceOfTrialFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your Request for Place of Trial file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your Request for Place of Trial file size is empty',
  ],
  sortableDocketNumber: 'Sortable docket number is required',
  stinFile: 'Upload a Statement of Taxpayer Identification Number (STIN)',
  stinFileSize: [
    {
      contains: 'must be less than or equal to',
      message: `Your STIN file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
    },
    'Your STIN file size is empty',
  ],
};

Case.validationName = 'Case';

/**
 * Case Entity
 * Represents a Case that has already been accepted into the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function Case(rawCase, { applicationContext, filtered = false }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }
  this.entityName = 'Case';

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    this.associatedJudge = rawCase.associatedJudge || CHIEF_JUDGE;
    this.automaticBlocked = rawCase.automaticBlocked;
    this.automaticBlockedDate = rawCase.automaticBlockedDate;
    this.automaticBlockedReason = rawCase.automaticBlockedReason;
    this.blocked = rawCase.blocked;
    this.blockedDate = rawCase.blockedDate;
    this.blockedReason = rawCase.blockedReason;
    this.caseNote = rawCase.caseNote;
    this.damages = rawCase.damages;
    this.highPriority = rawCase.highPriority;
    this.highPriorityReason = rawCase.highPriorityReason;
    this.litigationCosts = rawCase.litigationCosts;
    this.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};
    this.status = rawCase.status || CASE_STATUS_TYPES.new;
    this.userId = rawCase.userId;

    if (Array.isArray(rawCase.statistics)) {
      this.statistics = rawCase.statistics.map(
        statistic => new Statistic(statistic, { applicationContext }),
      );
    } else {
      this.statistics = [];
    }
  }

  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId || applicationContext.getUniqueId();
  this.caseType = rawCase.caseType;
  this.closedDate = rawCase.closedDate;
  this.createdAt = rawCase.createdAt || createISODateString();
  if (rawCase.docketNumber) {
    this.docketNumber = rawCase.docketNumber.replace(/^0+/, ''); // strip leading zeroes
  }
  this.docketNumberSuffix = getDocketNumberSuffix(rawCase);
  this.filingType = rawCase.filingType;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.isPaper = rawCase.isPaper;
  this.isSealed = !!rawCase.sealedDate;
  this.leadCaseId = rawCase.leadCaseId;
  this.mailingDate = rawCase.mailingDate;
  this.partyType = rawCase.partyType;
  this.petitionPaymentDate = rawCase.petitionPaymentDate;
  this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  this.petitionPaymentStatus =
    rawCase.petitionPaymentStatus || PAYMENT_STATUS.UNPAID;
  this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt || createISODateString();
  this.sealedDate = rawCase.sealedDate;
  this.sortableDocketNumber =
    rawCase.sortableDocketNumber || this.generateSortableDocketNumber();
  this.trialDate = rawCase.trialDate;
  this.trialLocation = rawCase.trialLocation;
  this.trialSessionId = rawCase.trialSessionId;
  this.trialTime = rawCase.trialTime;
  this.useSameAsPrimary = rawCase.useSameAsPrimary;

  if (applicationContext.getCurrentUser().userId === rawCase.userId) {
    this.userId = rawCase.userId;
  }

  this.initialDocketNumberSuffix =
    rawCase.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

  if (rawCase.caseCaption) {
    this.initialCaption = rawCase.initialCaption || this.caseCaption;
  }

  if (Array.isArray(rawCase.correspondence)) {
    this.correspondence = rawCase.correspondence
      .map(
        correspondence =>
          new Correspondence(correspondence, { applicationContext }),
      )
      .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
  } else {
    this.correspondence = [];
  }

  if (Array.isArray(rawCase.documents)) {
    this.documents = rawCase.documents
      .map(document => new Document(document, { applicationContext }))
      .sort((a, b) => compareStrings(a.createdAt, b.createdAt));

    this.isSealed =
      this.isSealed ||
      this.documents.some(
        document => document.isSealed || document.isLegacySealed,
      );
  } else {
    this.documents = [];
  }

  this.hasPendingItems = this.documents.some(document => document.pending);

  if (Array.isArray(rawCase.privatePractitioners)) {
    this.privatePractitioners = rawCase.privatePractitioners.map(
      practitioner => new PrivatePractitioner(practitioner),
    );
  } else {
    this.privatePractitioners = [];
  }

  if (Array.isArray(rawCase.irsPractitioners)) {
    this.irsPractitioners = rawCase.irsPractitioners.map(
      practitioner => new IrsPractitioner(practitioner),
    );
  } else {
    this.irsPractitioners = [];
  }

  this.documents.forEach(document => {
    document.workItems.forEach(workItem => {
      workItem.docketNumberSuffix = this.docketNumberSuffix;
    });
  });

  if (Array.isArray(rawCase.docketRecord)) {
    this.docketRecord = rawCase.docketRecord.map(
      docketRecord => new DocketRecord(docketRecord, { applicationContext }),
    );
  } else {
    this.docketRecord = [];
  }

  this.noticeOfTrialDate = rawCase.noticeOfTrialDate || createISODateString();
  this.noticeOfAttachments = rawCase.noticeOfAttachments || false;
  this.orderDesignatingPlaceOfTrial =
    rawCase.orderDesignatingPlaceOfTrial || false;
  this.orderForAmendedPetition = rawCase.orderForAmendedPetition || false;
  this.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee || false;
  this.orderForFilingFee = rawCase.orderForFilingFee || false;
  this.orderForOds = rawCase.orderForOds || false;
  this.orderForRatification = rawCase.orderForRatification || false;
  this.orderToShowCause = rawCase.orderToShowCause || false;
  this.orderToChangeDesignatedPlaceOfTrial =
    rawCase.orderToChangeDesignatedPlaceOfTrial || false;

  this.docketNumberWithSuffix =
    this.docketNumber + (this.docketNumberSuffix || '');

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      otherFilers: rawCase.otherFilers,
      otherPetitioners: rawCase.otherPetitioners,
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    isPaper: rawCase.isPaper,
    partyType: rawCase.partyType,
  });

  this.otherFilers = contacts.otherFilers;
  this.otherPetitioners = contacts.otherPetitioners;

  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

Case.VALIDATION_RULES = {
  associatedJudge: joi
    .string()
    .max(50)
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('Judge assigned to this case. Defaults to Chief Judge.'),
  automaticBlocked: joi
    .boolean()
    .optional()
    .description(
      'Temporarily blocked from trial due to a pending item or due date.',
    ),
  automaticBlockedDate: joiStrictTimestamp.when('automaticBlocked', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  automaticBlockedReason: joi
    .string()
    .valid(...Object.values(AUTOMATIC_BLOCKED_REASONS))
    .description('The reason the case was automatically blocked from trial.')
    .when('automaticBlocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
  blocked: joi
    .boolean()
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('Temporarily blocked from trial.'),
  blockedDate: joiStrictTimestamp
    .when('blocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .meta({ tags: ['Restricted'] }),
  blockedReason: joi
    .string()
    .max(250)
    .description(
      'Open text field for describing reason for blocking this case from trial.',
    )
    .when('blocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .meta({ tags: ['Restricted'] }),
  caseCaption: joi
    .string()
    .max(500)
    .required()
    .description(
      'The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.',
    ),
  caseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .required()
    .description('Unique case ID only used by the system.'),
  caseNote: joi
    .string()
    .max(500)
    .optional()
    .meta({ tags: ['Restricted'] }),
  caseType: joi
    .string()
    .valid(...CASE_TYPES)
    .required(),
  closedDate: joiStrictTimestamp.when('status', {
    is: CASE_STATUS_TYPES.closed,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }),
  contactPrimary: joi.object().required(),
  contactSecondary: joi.object().optional().allow(null),
  correspondence: joi
    .array()
    .items(joi.object().meta({ entityName: 'Correspondence' }))
    .description('List of Correspondence documents for the case.'),
  createdAt: joiStrictTimestamp
    .required()
    .description(
      'When the paper or electronic case was added to the system. This value cannot be edited.',
    ),
  damages: joi
    .number()
    .optional()
    .allow(null)
    .description('Damages for the case.'),
  docketNumber: joi
    .string()
    .regex(DOCKET_NUMBER_MATCHER)
    .required()
    .description('Unique case identifier in XXXXX-YY format.'),
  docketNumberSuffix: joi
    .string()
    .allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: joi
    .string()
    .optional()
    .description('Auto-generated from docket number and the suffix.'),
  docketRecord: joi
    .array()
    .items(joi.object().meta({ entityName: 'DocketRecord' }))
    .required()
    .unique((a, b) => a.index === b.index)
    .description('List of DocketRecord Entities for the case.'),
  documents: joi
    .array()
    .items(joi.object().meta({ entityName: 'Document' }))
    .required()
    .description('List of Document Entities for the case.'),
  entityName: joi.string().valid('Case').required(),
  filingType: joi
    .string()
    .valid(
      ...FILING_TYPES[ROLES.petitioner],
      ...FILING_TYPES[ROLES.privatePractitioner],
    )
    .optional(),
  hasVerifiedIrsNotice: joi
    .boolean()
    .optional()
    .allow(null)
    .description(
      'Whether the petitioner received an IRS notice, verified by the petitions clerk.',
    ),
  highPriority: joi
    .boolean()
    .optional()
    .meta({ tags: ['Restricted'] }),
  highPriorityReason: joi
    .string()
    .max(250)
    .when('highPriority', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .meta({ tags: ['Restricted'] }),
  initialCaption: joi
    .string()
    .max(500)
    .allow(null)
    .optional()
    .description('Case caption before modification.'),
  initialDocketNumberSuffix: joi
    .string()
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES), '_')
    .allow(null)
    .optional()
    .description('Case docket number suffix before modification.'),
  irsNoticeDate: joiStrictTimestamp
    .max('now')
    .optional()
    .allow(null)
    .description('Last date that the petitioner is allowed to file before.'),
  irsPractitioners: joi
    .array()
    .optional()
    .description(
      'List of IRS practitioners (also known as respondents) associated with the case.',
    ),
  isPaper: joi.boolean().optional(),
  isSealed: joi.boolean().optional(),
  leadCaseId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .optional()
    .description(
      'If this case is consolidated, this is the ID of the lead case. It is the lowest docket number in the consolidated group.',
    ),
  litigationCosts: joi
    .number()
    .optional()
    .allow(null)
    .description('Litigation costs for the case.'),
  mailingDate: joi
    .string()
    .max(25)
    .when('isPaper', {
      is: true,
      otherwise: joi.allow(null).optional(),
      then: joi.required(),
    })
    .description('Date that petition was mailed to the court.'),
  noticeOfAttachments: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the notice of attachments.'),
  noticeOfTrialDate: joiStrictTimestamp
    .optional()
    .description('Reminder for clerks to review the notice of trial date.'),
  orderDesignatingPlaceOfTrial: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the Order Designating Place of Trial.',
    ),
  orderForAmendedPetition: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the order for amended Petition.',
    ),
  orderForAmendedPetitionAndFilingFee: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the order for amended Petition And filing fee.',
    ),
  orderForFilingFee: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the order for filing fee.'),
  orderForOds: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the order for ODS.'),
  orderForRatification: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the Order for Ratification.'),
  orderToChangeDesignatedPlaceOfTrial: joi
    .boolean()
    .optional()
    .description(
      'Reminder for clerks to review the Order to Change Designated Place Of Trial.',
    ),
  orderToShowCause: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the Order to Show Cause.'),
  otherFilers: joi
    .array()
    .items(joi.object().meta({ entityName: 'OtherFilerContact' }))
    .unique(
      (a, b) =>
        a.otherFilerType === UNIQUE_OTHER_FILER_TYPE &&
        b.otherFilerType === UNIQUE_OTHER_FILER_TYPE,
    )
    .description('List of OtherFilerContact Entities for the case.')
    .optional(),
  otherPetitioners: joi
    .array()
    .items(joi.object().meta({ entityName: 'OtherPetitionerContact' }))
    .description('List of OtherPetitionerContact Entities for the case.')
    .optional(),
  partyType: joi
    .string()
    .valid(...Object.values(PARTY_TYPES))
    .required()
    .description('Party type of the case petitioner.'),
  petitionPaymentDate: joiStrictTimestamp
    .when('petitionPaymentStatus', {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('When the petitioner paid the case fee.'),
  petitionPaymentMethod: joi
    .string()
    .max(50)
    .when('petitionPaymentStatus', {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('How the petitioner paid the case fee.'),
  petitionPaymentStatus: joi
    .string()
    .valid(...Object.values(PAYMENT_STATUS))
    .required()
    .description('Status of the case fee payment.'),
  petitionPaymentWaivedDate: joiStrictTimestamp
    .when('petitionPaymentStatus', {
      is: PAYMENT_STATUS.WAIVED,
      otherwise: joi.allow(null).optional(),
      then: joi.required(),
    })
    .description('When the case fee was waived.'),
  preferredTrialCity: joi
    .alternatives()
    .try(
      joi.string().valid(...TRIAL_CITY_STRINGS, null),
      joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
    )
    .optional()
    .description('Where the petitioner would prefer to hold the case trial.'),
  privatePractitioners: joi
    .array()
    .optional()
    .description('List of private practitioners associated with the case.'),
  procedureType: joi
    .string()
    .valid(...PROCEDURE_TYPES)
    .required()
    .description('Procedure type of the case.'),
  qcCompleteForTrial: joi
    .object()
    .optional()
    .meta({ tags: ['Restricted'] })
    .description(
      'QC Checklist object that must be completed before the case can go to trial.',
    ),
  receivedAt: joiStrictTimestamp
    .required()
    .description(
      'When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited.',
    ),
  sealedDate: joiStrictTimestamp
    .optional()
    .allow(null)
    .description('When the case was sealed from the public.'),
  sortableDocketNumber: joi
    .number()
    .required()
    .description(
      'A sortable representation of the docket number (auto-generated by constructor).',
    ),
  statistics: joi
    .array()
    .items(joi.object().meta({ entityName: 'Statistic' }))
    .when('hasVerifiedIrsNotice', {
      is: true,
      otherwise: joi.optional(),
      then: joi.when('caseType', {
        is: CASE_TYPES_MAP.deficiency,
        otherwise: joi.optional(), // TODO: only allow null?
        then: joi.array().min(1).required(),
      }),
    })
    .description('List of Statistic Entities for the case.'),
  status: joi
    .string()
    .valid(...Object.values(CASE_STATUS_TYPES))
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('Status of the case.'),
  trialDate: joiStrictTimestamp
    .optional()
    .allow(null)
    .description('When this case goes to trial.'),
  trialLocation: joi
    .alternatives()
    .try(
      joi.string().valid(...TRIAL_CITY_STRINGS, null),
      joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
    )
    .optional()
    .description(
      'Where this case goes to trial. This may be different that the preferred trial location.',
    ),
  trialSessionId: joi
    .string()
    .uuid({
      version: ['uuidv4'],
    })
    .optional()
    .description(
      'The unique ID of the trial session associated with this case.',
    ),
  trialTime: joi
    .string()
    .pattern(PATTERNS['H:MM'])
    .optional()
    .description('Time of day when this case goes to trial.'),
  useSameAsPrimary: joi
    .boolean()
    .optional()
    .description(
      'Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process).',
    ),
  userId: joi
    .string()
    .max(50)
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('The unique ID of the User who added the case to the system.'),
  workItems: joi
    .array()
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('List of system messages associated with this case.'),
};

joiValidationDecorator(
  Case,
  joi.object().keys(Case.VALIDATION_RULES),
  Case.VALIDATION_ERROR_MESSAGES,
);

const orderDocumentTypes = ORDER_TYPES.map(orderType => orderType.documentType);
const courtIssuedDocumentTypes = COURT_ISSUED_EVENT_CODES.map(
  courtIssuedDoc => courtIssuedDoc.documentType,
);

/**
 * builds the case caption from case contact name(s) based on party type
 *
 * @param {object} rawCase the raw case data
 * @returns {string} the generated case caption
 */
Case.getCaseCaption = function (rawCase) {
  let caseCaption;
  switch (rawCase.partyType) {
    case PARTY_TYPES.corporation:
    case PARTY_TYPES.petitioner:
      caseCaption = `${rawCase.contactPrimary.name}, Petitioner`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${rawCase.contactSecondary.name}, Petitioners`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${rawCase.contactPrimary.name} & ${rawCase.contactSecondary.name}, Deceased, ${rawCase.contactPrimary.name}, Surviving Spouse, Petitioners`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${rawCase.contactPrimary.name}, Deceased, ${rawCase.contactPrimary.secondaryName}, ${rawCase.contactPrimary.title}, Petitioner(s)`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${rawCase.contactPrimary.name}, Deceased, Petitioner`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Trustee, Petitioner(s)`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Partnership Representative, Petitioner(s)`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Conservator, Petitioner`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Guardian, Petitioner`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${rawCase.contactPrimary.name}, ${rawCase.contactPrimary.secondaryName}, Custodian, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${rawCase.contactPrimary.name}, Minor, ${rawCase.contactPrimary.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${rawCase.contactPrimary.name}, Incompetent, ${rawCase.contactPrimary.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${rawCase.contactPrimary.name}, Donor, Petitioner`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${rawCase.contactPrimary.name}, Transferee, Petitioner`;
      break;
    case PARTY_TYPES.survivingSpouse:
      caseCaption = `${rawCase.contactPrimary.name}, Deceased, ${rawCase.contactPrimary.secondaryName}, Surviving Spouse, Petitioner`;
      break;
  }
  return caseCaption;
};

Case.prototype.toRawObject = function (processPendingItems = true) {
  const result = this.toRawObjectFromJoi();

  if (processPendingItems) {
    result.hasPendingItems = this.doesHavePendingItems();
  }

  return result;
};

Case.prototype.doesHavePendingItems = function () {
  return this.documents.some(document => document.pending);
};

/**
 * get the case caption without the ", Petitioner/s/(s)" postfix
 *
 * @param {string} caseCaption the original case caption
 * @returns {string} caseTitle the case caption with the postfix removed
 */
Case.getCaseTitle = function (caseCaption) {
  return caseCaption.replace(/\s*,\s*Petitioner(s|\(s\))?\s*$/, '').trim();
};

/**
 * attaches an IRS practitioner to the case
 *
 * @param {string} practitioner the irsPractitioner to add to the case
 */
Case.prototype.attachIrsPractitioner = function (practitioner) {
  this.irsPractitioners.push(practitioner);
};

/**
 * updates an IRS practitioner on the case
 *
 * @param {string} practitionerToUpdate the irsPractitioner user object with updated info
 * @returns {void} modifies the irsPractitioners array on the case
 */
Case.prototype.updateIrsPractitioner = function (practitionerToUpdate) {
  const foundPractitioner = this.irsPractitioners.find(
    practitioner => practitioner.userId === practitionerToUpdate.userId,
  );
  if (foundPractitioner) Object.assign(foundPractitioner, practitionerToUpdate);
};

/**
 * removes the given IRS practitioner from the case
 *
 * @param {string} practitionerToRemove the irsPractitioner user object to remove from the case
 * @returns {Case} the modified case entity
 */
Case.prototype.removeIrsPractitioner = function (practitionerToRemove) {
  const index = this.irsPractitioners.findIndex(
    practitioner => practitioner.userId === practitionerToRemove.userId,
  );
  if (index > -1) this.irsPractitioners.splice(index, 1);
  return this;
};

/**
 * attaches a private practitioner to the case
 *
 * @param {string} practitioner the privatePractitioner to add to the case
 */
Case.prototype.attachPrivatePractitioner = function (practitioner) {
  this.privatePractitioners.push(practitioner);
};

/**
 * updates a private practitioner on the case
 *
 * @param {string} practitionerToUpdate the practitioner user object with updated info
 */
Case.prototype.updatePrivatePractitioner = function (practitionerToUpdate) {
  const foundPractitioner = this.privatePractitioners.find(
    practitioner => practitioner.userId === practitionerToUpdate.userId,
  );
  if (foundPractitioner) Object.assign(foundPractitioner, practitionerToUpdate);
};

/**
 * removes the given private practitioner from the case
 *
 * @param {string} practitionerToRemove the practitioner user object to remove from the case
 */
Case.prototype.removePrivatePractitioner = function (practitionerToRemove) {
  const index = this.privatePractitioners.findIndex(
    practitioner => practitioner.userId === practitionerToRemove.userId,
  );
  if (index > -1) this.privatePractitioners.splice(index, 1);
};

/**
 *
 * @param {object} document the document to add to the case
 */
Case.prototype.addDocument = function (document, { applicationContext }) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];

  this.addDocketRecord(
    new DocketRecord(
      {
        description: document.documentType,
        documentId: document.documentId,
        eventCode: document.eventCode,
        filedBy: document.filedBy,
        filingDate: document.receivedAt || document.createdAt,
        numberOfPages: document.numberOfPages,
      },
      { applicationContext },
    ),
  );
};

/**
 *
 * @param {object} document the document to add to the case
 */
Case.prototype.addDocumentWithoutDocketRecord = function (document) {
  document.caseId = this.caseId;
  this.documents = [...this.documents, document];
};

Case.prototype.closeCase = function () {
  this.closedDate = createISODateString();
  this.status = CASE_STATUS_TYPES.closed;
  this.unsetAsBlocked();
  this.unsetAsHighPriority();
  return this;
};

/**
 *
 * @param {Date} sendDate the time stamp when the case was sent to the IRS
 * @returns {Case} the updated case entity
 */
Case.prototype.markAsSentToIRS = function () {
  this.status = CASE_STATUS_TYPES.generalDocket;

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.updateCaseCaptionDocketRecord = function ({
  applicationContext,
}) {
  const caseCaptionRegex = /^Caption of case is amended from '(.*)' to '(.*)'/;
  let lastCaption = this.initialCaption;

  this.docketRecord.forEach(docketRecord => {
    const result = caseCaptionRegex.exec(docketRecord.description);
    if (result) {
      const [, , changedCaption] = result;
      lastCaption = changedCaption.replace(` ${CASE_CAPTION_POSTFIX}`, '');
    }
  });

  const needsCaptionChangedRecord =
    this.initialCaption && lastCaption !== this.caseCaption && !this.isPaper;

  if (needsCaptionChangedRecord) {
    this.addDocketRecord(
      new DocketRecord(
        {
          description: `Caption of case is amended from '${lastCaption} ${CASE_CAPTION_POSTFIX}' to '${this.caseCaption} ${CASE_CAPTION_POSTFIX}'`,
          eventCode: 'MINC',
          filingDate: createISODateString(),
        },
        { applicationContext },
      ),
    );
  }

  return this;
};

/**
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocketNumberRecord = function ({ applicationContext }) {
  const docketNumberRegex = /^Docket Number is amended from '(.*)' to '(.*)'/;

  let lastDocketNumber =
    this.docketNumber +
    (this.initialDocketNumberSuffix !== '_'
      ? this.initialDocketNumberSuffix
      : '');

  const newDocketNumber = this.docketNumber + (this.docketNumberSuffix || '');

  this.docketRecord.forEach(docketRecord => {
    const result = docketNumberRegex.exec(docketRecord.description);
    if (result) {
      const [, , changedDocketNumber] = result;
      lastDocketNumber = changedDocketNumber;
    }
  });

  const needsDocketNumberChangeRecord =
    lastDocketNumber !== newDocketNumber && !this.isPaper;

  if (needsDocketNumberChangeRecord) {
    this.addDocketRecord(
      new DocketRecord(
        {
          description: `Docket Number is amended from '${lastDocketNumber}' to '${newDocketNumber}'`,
          eventCode: 'MIND',
          filingDate: createISODateString(),
        },
        { applicationContext },
      ),
    );
  }

  return this;
};

Case.prototype.getDocumentById = function ({ documentId }) {
  const allCaseDocuments = [...this.documents, ...this.correspondence];

  return allCaseDocuments.find(document => document.documentId === documentId);
};

const getPetitionDocumentFromDocuments = function (documents) {
  return documents.find(
    document =>
      document.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
};

Case.prototype.getPetitionDocument = function () {
  return getPetitionDocumentFromDocuments(this.documents);
};

Case.prototype.getIrsSendDate = function () {
  const petitionDocument = this.getPetitionDocument();
  if (petitionDocument) {
    return petitionDocument.servedAt;
  }
};

/**
 *
 * @param {string} preferredTrialCity the preferred trial city
 * @returns {Case} the updated case entity
 */
Case.prototype.setRequestForTrialDocketRecord = function (
  preferredTrialCity,
  { applicationContext },
) {
  this.preferredTrialCity = preferredTrialCity;

  const found = find(this.docketRecord, item =>
    item.description.includes('Request for Place of Trial'),
  );

  if (preferredTrialCity && !found) {
    this.addDocketRecord(
      new DocketRecord(
        {
          description: `Request for Place of Trial at ${this.preferredTrialCity}`,
          eventCode: INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
          filingDate: this.receivedAt || this.createdAt,
        },
        { applicationContext },
      ),
    );
  }
  return this;
};

/**
 *
 * @param {DocketRecord} docketRecordEntity the docket record entity to add to case's the docket record
 * @returns {Case} the updated case entity
 */
Case.prototype.addDocketRecord = function (docketRecordEntity) {
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
Case.prototype.updateDocketRecordEntry = function (updatedDocketEntry) {
  const foundEntry = this.docketRecord.find(
    entry => entry.docketRecordId === updatedDocketEntry.docketRecordId,
  );
  if (foundEntry) Object.assign(foundEntry, updatedDocketEntry);
  return this;
};

/**
 * finds a docket record by its documentId
 *
 * @param {string} documentId the document id
 * @returns {DocketRecord|undefined} the updated case entity
 */
Case.prototype.getDocketRecordByDocumentId = function (documentId) {
  const foundEntry = this.docketRecord.find(
    entry => entry.documentId === documentId,
  );

  return foundEntry;
};

/**
 *
 * @param {number} docketRecordIndex the index of the docket record to update
 * @param {DocketRecord} docketRecordEntity the updated docket entry to update on the case
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocketRecord = function (
  docketRecordIndex,
  docketRecordEntity,
) {
  this.docketRecord[docketRecordIndex] = docketRecordEntity;
  return this;
};

/**
 *
 * @param {Document|Correspondence} updatedDocument the document or correspondence to update on the case
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocument = function (updatedDocument) {
  const allCaseDocuments = [...this.documents, ...this.correspondence];
  const foundDocument = allCaseDocuments.find(
    document => document.documentId === updatedDocument.documentId,
  );

  if (foundDocument) Object.assign(foundDocument, updatedDocument);

  return this;
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
 * getWorkItems
 *
 * @returns {WorkItem[]} the work items on the case
 */
Case.prototype.getWorkItems = function () {
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
Case.prototype.checkForReadyForTrial = function () {
  const currentDate = prepareDateFromString().toISOString();

  const isCaseGeneralDocketNotAtIssue =
    this.status === CASE_STATUS_TYPES.generalDocket;

  if (isCaseGeneralDocketNotAtIssue) {
    this.documents.forEach(document => {
      const isAnswerDocument = includes(
        ANSWER_DOCUMENT_CODES,
        document.eventCode,
      );

      const daysElapsedSinceDocumentWasFiled = calculateDifferenceInDays(
        currentDate,
        document.createdAt,
      );

      const requiredTimeElapsedSinceFiling =
        daysElapsedSinceDocumentWasFiled > ANSWER_CUTOFF_AMOUNT_IN_DAYS;

      if (isAnswerDocument && requiredTimeElapsedSinceFiling) {
        this.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
      }
    });
  }

  return this;
};

/**
 * generates a sortable docket number in ${year}${index} format
 *
 * @returns {string} the sortable docket number
 */
Case.prototype.generateSortableDocketNumber = function () {
  if (!this.docketNumber) {
    return;
  }
  // Note: This does not yet take into account pre-2000's years
  const docketNumberSplit = this.docketNumber.split('-');
  docketNumberSplit[0] = docketNumberSplit[0].padStart(6, '0');
  return parseInt(`${docketNumberSplit[1]}${docketNumberSplit[0]}`);
};

/**
 * generates sort tags used for sorting trials for calendaring
 *
 * @returns {object} the sort tags
 */
Case.prototype.generateTrialSortTags = function () {
  const {
    caseId,
    caseType,
    highPriority,
    preferredTrialCity,
    procedureType,
    receivedAt,
  } = this;

  const caseProcedureSymbol =
    procedureType.toLowerCase() === 'regular' ? 'R' : 'S';

  let casePrioritySymbol = 'D';

  if (highPriority === true) {
    casePrioritySymbol = 'A';
  } else if (caseType.toLowerCase() === 'cdp (lien/levy)') {
    casePrioritySymbol = 'B';
  } else if (caseType.toLowerCase() === 'passport') {
    casePrioritySymbol = 'C';
  }

  const formattedFiledTime = formatDateString(receivedAt, 'YYYYMMDDHHmmss');
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
Case.prototype.setAsCalendared = function (trialSessionEntity) {
  if (
    trialSessionEntity.isCalendared &&
    trialSessionEntity.judge &&
    trialSessionEntity.judge.name
  ) {
    this.associatedJudge = trialSessionEntity.judge.name;
  }
  this.trialSessionId = trialSessionEntity.trialSessionId;
  this.trialDate = trialSessionEntity.startDate;
  this.trialTime = trialSessionEntity.startTime;
  this.trialLocation = trialSessionEntity.trialLocation;
  if (trialSessionEntity.isCalendared === true) {
    this.status = CASE_STATUS_TYPES.calendared;
  }
  return this;
};

/**
 * returns true if the case is associated with the userId
 *
 * @param {object} arguments arguments
 * @param {object} arguments.caseRaw raw case details
 * @param {string} arguments.userId id of the user account
 * @returns {boolean} if the case is associated
 */
const isAssociatedUser = function ({ caseRaw, user }) {
  const isIrsPractitioner =
    caseRaw.irsPractitioners &&
    caseRaw.irsPractitioners.find(r => r.userId === user.userId);
  const isPrivatePractitioner =
    caseRaw.privatePractitioners &&
    caseRaw.privatePractitioners.find(p => p.userId === user.userId);

  const isIrsSuperuser = user.role === ROLES.irsSuperuser;

  const petitionDocument = (caseRaw.documents || []).find(
    doc => doc.documentType === 'Petition',
  );

  const isPetitionServed = petitionDocument && !!petitionDocument.servedAt;

  return (
    isIrsPractitioner ||
    isPrivatePractitioner ||
    (isIrsSuperuser && isPetitionServed)
  );
};

/**
 * returns true if the case status is already calendared
 *
 * @returns {boolean} if the case is calendared
 */
Case.prototype.isCalendared = function () {
  return this.status === CASE_STATUS_TYPES.calendared;
};

/**
 * returns true if the case status is ready for trial
 *
 * @returns {boolean} if the case is calendared
 */
Case.prototype.isReadyForTrial = function () {
  return this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial;
};

/**
 * set as blocked with a blockedReason
 *
 * @param {string} blockedReason - the reason the case was blocked
 * @returns {Case} the updated case entity
 */
Case.prototype.setAsBlocked = function (blockedReason) {
  this.blocked = true;
  this.blockedReason = blockedReason;
  this.blockedDate = createISODateString();
  return this;
};

/**
 * unblock the case and remove the blockedReason
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.unsetAsBlocked = function () {
  this.blocked = false;
  this.blockedReason = undefined;
  this.blockedDate = undefined;
  return this;
};

/**
 * update as automaticBlocked with an automaticBlockedReason based on
 * provided case deadlines and pending items
 *
 * @param {object} caseDeadlines - the case deadlines
 * @returns {Case} the updated case entity
 */
Case.prototype.updateAutomaticBlocked = function ({ caseDeadlines }) {
  const hasPendingItems = this.doesHavePendingItems();
  let automaticBlockedReason;
  if (hasPendingItems && !isEmpty(caseDeadlines)) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
  } else if (hasPendingItems) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.pending;
  } else if (!isEmpty(caseDeadlines)) {
    automaticBlockedReason = AUTOMATIC_BLOCKED_REASONS.dueDate;
  }
  if (automaticBlockedReason) {
    this.automaticBlocked = true;
    this.automaticBlockedDate = createISODateString();
    this.automaticBlockedReason = automaticBlockedReason;
  } else {
    this.automaticBlocked = false;
    this.automaticBlockedDate = undefined;
    this.automaticBlockedReason = undefined;
  }
  return this;
};

/**
 * set as high priority with a highPriorityReason
 *
 * @param {string} highPriorityReason - the reason the case was set to high priority
 * @returns {Case} the updated case entity
 */
Case.prototype.setAsHighPriority = function (highPriorityReason) {
  this.highPriority = true;
  this.highPriorityReason = highPriorityReason;
  return this;
};

/**
 * unset as high priority and remove the highPriorityReason
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.unsetAsHighPriority = function () {
  this.highPriority = false;
  this.highPriorityReason = undefined;
  return this;
};

/**
 * remove case from trial, setting case status to generalDocketReadyForTrial
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.removeFromTrial = function () {
  this.status = CASE_STATUS_TYPES.generalDocketReadyForTrial;
  this.associatedJudge = CHIEF_JUDGE;
  this.trialDate = undefined;
  this.trialLocation = undefined;
  this.trialSessionId = undefined;
  this.trialTime = undefined;
  return this;
};

/**
 * remove case from trial with optional associated judge
 *
 * @param {string} associatedJudge (optional) the associated judge for the case
 * @returns {Case} the updated case entity
 */
Case.prototype.removeFromTrialWithAssociatedJudge = function (associatedJudge) {
  if (associatedJudge) {
    this.associatedJudge = associatedJudge;
  }

  this.trialDate = undefined;
  this.trialLocation = undefined;
  this.trialSessionId = undefined;
  this.trialTime = undefined;
  return this;
};

/**
 * set associated judge
 *
 * @param {string} associatedJudge the judge to associate with the case
 * @returns {Case} the updated case entity
 */
Case.prototype.setAssociatedJudge = function (associatedJudge) {
  this.associatedJudge = associatedJudge;
  return this;
};

/**
 * set case status
 *
 * @param {string} caseStatus the case status to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseStatus = function (caseStatus) {
  this.status = caseStatus;
  if (
    [
      CASE_STATUS_TYPES.generalDocket,
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    ].includes(caseStatus)
  ) {
    this.associatedJudge = CHIEF_JUDGE;
  } else if (caseStatus === CASE_STATUS_TYPES.closed) {
    this.closeCase();
  }
  return this;
};

/**
 * set case caption
 *
 * @param {string} caseCaption the case caption to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseCaption = function (caseCaption) {
  this.caseCaption = caseCaption;
  return this;
};

/**
 * get case contacts
 *
 * @param {object} shape specific contact params to be returned
 * @returns {object} object containing case contacts
 */
Case.prototype.getCaseContacts = function (shape) {
  const caseContacts = {};
  [
    'contactPrimary',
    'contactSecondary',
    'privatePractitioners',
    'irsPractitioners',
    'otherPetitioners',
    'otherFilers',
  ].forEach(contact => {
    if (!shape || (shape && shape[contact] === true)) {
      caseContacts[contact] = this[contact];
    }
  });

  return caseContacts;
};

/**
 * get consolidation status between current case entity and another case entity
 *
 * @param {object} caseEntity the pending case entity to check
 * @returns {object} object with canConsolidate flag and reason string
 */
Case.prototype.getConsolidationStatus = function ({ caseEntity }) {
  let canConsolidate = true;
  const reason = [];

  if (!this.canConsolidate(caseEntity)) {
    return {
      canConsolidate: false,
      reason: [
        `Case status is ${caseEntity.status} and cannot be consolidated`,
      ],
    };
  }

  if (this.docketNumber === caseEntity.docketNumber) {
    canConsolidate = false;
    reason.push('Cases are the same');
  }

  if (this.status !== caseEntity.status) {
    canConsolidate = false;
    reason.push('Case status is not the same');
  }

  if (this.procedureType !== caseEntity.procedureType) {
    canConsolidate = false;
    reason.push('Case procedure is not the same');
  }

  if (this.trialLocation !== caseEntity.trialLocation) {
    canConsolidate = false;
    reason.push('Place of trial is not the same');
  }

  if (this.associatedJudge !== caseEntity.associatedJudge) {
    canConsolidate = false;
    reason.push('Judge is not the same');
  }

  return { canConsolidate, reason };
};

/**
 * checks case eligibility for consolidation by the current case's status
 *
 * @returns {boolean} true if eligible for consolidation, false otherwise
 * @param {object} caseToConsolidate (optional) case to check for consolidation eligibility
 */
Case.prototype.canConsolidate = function (caseToConsolidate) {
  const ineligibleStatusTypes = [
    CASE_STATUS_TYPES.new,
    CASE_STATUS_TYPES.generalDocket,
    CASE_STATUS_TYPES.closed,
    CASE_STATUS_TYPES.onAppeal,
  ];

  const caseToCheck = caseToConsolidate || this;

  return !ineligibleStatusTypes.includes(caseToCheck.status);
};

/**
 * sets lead case id on the current case
 *
 * @param {string} leadCaseId the caseId of the lead case for consolidation
 * @returns {Case} the updated Case entity
 */
Case.prototype.setLeadCase = function (leadCaseId) {
  this.leadCaseId = leadCaseId;
  return this;
};

/**
 * removes the consolidation from the case by setting leadCaseId to undefined
 *
 * @returns {Case} the updated Case entity
 */
Case.prototype.removeConsolidation = function () {
  this.leadCaseId = undefined;
  return this;
};

/**
 * sorts the given array of cases by docket number
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.sortByDocketNumber = function (cases) {
  const casesOrdered = cases.sort((a, b) => {
    const aSplit = a.docketNumber.split('-');
    const bSplit = b.docketNumber.split('-');

    if (aSplit[1] !== bSplit[1]) {
      // compare years if they aren't the same
      return aSplit[1].localeCompare(bSplit[1]);
    } else {
      // compare index if years are the same
      return aSplit[0].localeCompare(bSplit[0]);
    }
  });

  return casesOrdered;
};

/**
 * return the lead case for the given set of cases based on createdAt
 * (does NOT evaluate leadCaseId)
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.findLeadCaseForCases = function (cases) {
  const casesOrdered = Case.sortByDocketNumber([...cases]);
  return casesOrdered.shift();
};

/**
 * @param {string} documentId the id of the document to check
 * @returns {boolean} true if the document is draft, false otherwise
 */
Case.prototype.isDocumentDraft = function (documentId) {
  const document = this.getDocumentById({ documentId });

  const isNotArchived = !document.archived;
  const isNotServed = !document.servedAt;
  const isDocumentOnDocketRecord = this.docketRecord.find(
    docketEntry => docketEntry.documentId === document.documentId,
  );
  const isStipDecision = document.documentType === 'Stipulated Decision';
  const isDraftOrder = orderDocumentTypes.includes(document.documentType);
  const isCourtIssuedDocument = courtIssuedDocumentTypes.includes(
    document.documentType,
  );
  return (
    isNotArchived &&
    isNotServed &&
    (isStipDecision ||
      (isDraftOrder && !isDocumentOnDocketRecord) ||
      (isCourtIssuedDocument && !isDocumentOnDocketRecord))
  );
};

/**
 * sets the notice of trial date for a case
 *
 * @returns {Case} this case entity
 */
Case.prototype.setNoticeOfTrialDate = function () {
  this.noticeOfTrialDate = createISODateString();
  return this;
};

/**
 * sets the qc complete for trial boolean for a case
 *
 * @param {object} providers the providers object
 * @param {boolean} providers.qcCompleteForTrial the value to set for qcCompleteForTrial
 * @param {string} providers.trialSessionId the id of the trial session to set qcCompleteForTrial for
 * @returns {Case} this case entity
 */
Case.prototype.setQcCompleteForTrial = function ({
  qcCompleteForTrial,
  trialSessionId,
}) {
  this.qcCompleteForTrial[trialSessionId] = qcCompleteForTrial;
  return this;
};

/**
 * sets the sealedDate on a case to the current date and time
 *
 * @returns {Case} this case entity
 */
Case.prototype.setAsSealed = function () {
  this.sealedDate = createISODateString();
  this.isSealed = true;
  return this;
};
/**
 * generates the case confirmation pdf file name
 *
 * @returns {string} this case confirmation pdf file name
 */
Case.prototype.getCaseConfirmationGeneratedPdfFileName = function () {
  return `case-${this.docketNumber}-confirmation.pdf`;
};

/**
 * adds the correspondence document to the list of correspondences on the case
 *
 * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.fileCorrespondence = function (correspondenceEntity) {
  this.correspondence = [...this.correspondence, correspondenceEntity];

  return this;
};

/**
 * adds the statistic to the list of statistics on the case
 *
 * @param {Statistic} statisticEntity the statistic to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.addStatistic = function (statisticEntity) {
  if (this.statistics.length === 12) {
    throw new Error('maximum number of statistics reached');
  }

  this.statistics = [...this.statistics, statisticEntity];

  return this;
};

/**
 * updates the statistic with the given index on the case
 *
 * @param {Statistic} statisticEntity the statistic to update on the case
 * @param {string} statisticId the id of the statistic to update
 * @returns {Case} this case entity
 */
Case.prototype.updateStatistic = function (statisticEntity, statisticId) {
  const statisticToUpdate = this.statistics.find(
    statistic => statistic.statisticId === statisticId,
  );

  if (statisticToUpdate) Object.assign(statisticToUpdate, statisticEntity);

  return this;
};

/**
 * deletes the statistic with the given index from the case
 *
 * @param {string} statisticId the id of the statistic to delete
 * @returns {Case} this case entity
 */
Case.prototype.deleteStatistic = function (statisticId) {
  const statisticIndexToDelete = this.statistics.findIndex(
    statistic => statistic.statisticId === statisticId,
  );

  if (statisticIndexToDelete !== -1) {
    this.statistics.splice(statisticIndexToDelete, 1);
  }

  return this;
};

module.exports = {
  Case,
  getPetitionDocumentFromDocuments,
  isAssociatedUser,
};

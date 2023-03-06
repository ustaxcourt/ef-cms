/* eslint-disable max-lines */
const joi = require('joi');
const {
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_DOCUMENT_CODES,
  AUTOMATIC_BLOCKED_REASONS,
  CASE_CAPTION_POSTFIX,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
  CONTACT_TYPES,
  DOCKET_NUMBER_SUFFIXES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  LEGACY_TRIAL_CITY_STRINGS,
  MAX_FILE_SIZE_MB,
  MINUTE_ENTRIES_MAP,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONER_CONTACT_TYPES,
  PROCEDURE_TYPES,
  ROLES,
  TRIAL_CITY_STRINGS,
  TRIAL_LOCATION_MATCHER,
} = require('../EntityConstants');
const {
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
  dateStringsCompared,
  formatDateString,
  FORMATS,
  PATTERNS,
  prepareDateFromString,
} = require('../../utilities/DateHandler');
const {
  DOCKET_ENTRY_VALIDATION_RULES,
} = require('../EntityValidationConstants');
const {
  getDocketNumberSuffix,
} = require('../../utilities/getDocketNumberSuffix');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const {
  shouldGenerateDocketRecordIndex,
} = require('../../utilities/shouldGenerateDocketRecordIndex');
const { clone, compact, includes, isEmpty } = require('lodash');
const { compareStrings } = require('../../utilities/sortFunctions');
const { ContactFactory } = require('../contacts/ContactFactory');
const { Correspondence } = require('../Correspondence');
const { DocketEntry, isServed } = require('../DocketEntry');
const { IrsPractitioner } = require('../IrsPractitioner');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { Petitioner } = require('../contacts/Petitioner');
const { PrivatePractitioner } = require('../PrivatePractitioner');
const { Statistic } = require('../Statistic');
const { TrialSession } = require('../trialSessions/TrialSession');
const { User } = require('../User');

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
  caseNote: [
    {
      contains: 'must be less than or equal to',
      message: 'Limit is 9000 characters. Enter 9000 or fewer characters.',
    },
  ],
  caseType: 'Select a case type',
  docketEntries: 'At least one valid docket entry is required',
  docketNumber: 'Docket number is required',
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

/**
 * Case Entity
 * Represents a Case that has already been accepted into the system.
 *
 * @param {object} rawCase the raw case data
 * @constructor
 */
function Case() {
  this.entityName = 'Case';
}

Case.prototype.init = function init(
  rawCase,
  { applicationContext, filtered = false },
) {
  caseDecorator(this, rawCase, { applicationContext, filtered });
};

const caseDecorator = (
  obj,
  rawObject,
  { applicationContext, filtered = false },
) => {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  obj.petitioners = [];

  if (
    !filtered ||
    User.isInternalUser(applicationContext.getCurrentUser().role)
  ) {
    assignFieldsForInternalUsers({
      applicationContext,
      obj,
      rawCase: rawObject,
    });
  }

  const params = { applicationContext, filtered, obj, rawCase: rawObject };

  // assignContacts needs to come first before assignDocketEntries
  assignContacts(params);
  assignDocketEntries(params);
  assignHearings(params);
  assignPractitioners(params);
  assignFieldsForAllUsers(params);
};

const assignFieldsForInternalUsers = ({ applicationContext, obj, rawCase }) => {
  obj.associatedJudge = rawCase.associatedJudge || CHIEF_JUDGE;
  obj.automaticBlocked = rawCase.automaticBlocked;
  obj.automaticBlockedDate = rawCase.automaticBlockedDate;
  obj.automaticBlockedReason = rawCase.automaticBlockedReason;
  obj.blocked = rawCase.blocked;
  obj.blockedDate = rawCase.blockedDate;
  obj.blockedReason = rawCase.blockedReason;
  obj.caseNote = rawCase.caseNote;
  obj.damages = rawCase.damages;
  obj.highPriority = rawCase.highPriority;
  obj.highPriorityReason = rawCase.highPriorityReason;
  obj.judgeUserId = rawCase.judgeUserId;
  obj.litigationCosts = rawCase.litigationCosts;
  obj.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};

  obj.noticeOfAttachments = rawCase.noticeOfAttachments || false;
  obj.orderDesignatingPlaceOfTrial =
    rawCase.orderDesignatingPlaceOfTrial || false;
  obj.orderForAmendedPetition = rawCase.orderForAmendedPetition || false;
  obj.orderForAmendedPetitionAndFilingFee =
    rawCase.orderForAmendedPetitionAndFilingFee || false;
  obj.orderForFilingFee = rawCase.orderForFilingFee || false;
  obj.orderForOds = rawCase.orderForOds || false;
  obj.orderForRatification = rawCase.orderForRatification || false;
  obj.orderToShowCause = rawCase.orderToShowCause || false;

  assignArchivedDocketEntries({ applicationContext, obj, rawCase });
  assignStatistics({ applicationContext, obj, rawCase });
  assignCorrespondences({ applicationContext, obj, rawCase });
};

const assignFieldsForAllUsers = ({ obj, rawCase }) => {
  obj.caseCaption = rawCase.caseCaption;
  obj.caseType = rawCase.caseType;
  obj.closedDate = rawCase.closedDate;
  obj.createdAt = rawCase.createdAt || createISODateString();
  if (rawCase.docketNumber) {
    obj.docketNumber = Case.formatDocketNumber(rawCase.docketNumber);
  }
  obj.docketNumberSuffix = getDocketNumberSuffix(rawCase);
  obj.filingType = rawCase.filingType;
  obj.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
  obj.irsNoticeDate = rawCase.irsNoticeDate;
  obj.isPaper = rawCase.isPaper;
  obj.leadDocketNumber = rawCase.leadDocketNumber;
  obj.mailingDate = rawCase.mailingDate;
  obj.partyType = rawCase.partyType;
  obj.petitionPaymentDate = rawCase.petitionPaymentDate;
  obj.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  obj.petitionPaymentStatus =
    rawCase.petitionPaymentStatus || PAYMENT_STATUS.UNPAID;
  obj.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  obj.preferredTrialCity = rawCase.preferredTrialCity;
  obj.procedureType = rawCase.procedureType;
  obj.receivedAt = rawCase.receivedAt || createISODateString();
  obj.sealedDate = rawCase.sealedDate;
  obj.status = rawCase.status || CASE_STATUS_TYPES.new;
  obj.sortableDocketNumber =
    rawCase.sortableDocketNumber ||
    Case.getSortableDocketNumber(rawCase.docketNumber);
  obj.trialDate = rawCase.trialDate;
  obj.trialLocation = rawCase.trialLocation;
  obj.trialSessionId = rawCase.trialSessionId;
  obj.trialTime = rawCase.trialTime;
  obj.useSameAsPrimary = rawCase.useSameAsPrimary;

  obj.initialDocketNumberSuffix =
    rawCase.initialDocketNumberSuffix || obj.docketNumberSuffix || '_';

  if (rawCase.caseCaption) {
    obj.initialCaption = rawCase.initialCaption || obj.caseCaption;
  }

  obj.hasPendingItems = obj.docketEntries.some(docketEntry =>
    DocketEntry.isPending(docketEntry),
  );

  obj.noticeOfTrialDate = rawCase.noticeOfTrialDate;

  obj.docketNumberWithSuffix =
    obj.docketNumber + (obj.docketNumberSuffix || '');

  obj.canAllowDocumentService = rawCase.canAllowDocumentService;
  obj.canAllowPrintableDocketRecord = rawCase.canAllowPrintableDocketRecord;
};

const assignDocketEntries = ({
  applicationContext,
  filtered,
  obj,
  rawCase,
}) => {
  if (Array.isArray(rawCase.docketEntries)) {
    obj.docketEntries = rawCase.docketEntries
      .map(
        docketEntry =>
          new DocketEntry(docketEntry, {
            applicationContext,
            filtered,
            petitioners: obj.petitioners,
          }),
      )
      .sort((a, b) => compareStrings(a.createdAt, b.createdAt));

    obj.isSealed = isSealedCase(rawCase);

    if (
      filtered &&
      applicationContext.getCurrentUser().role !== ROLES.irsSuperuser &&
      (applicationContext.getCurrentUser().role !== ROLES.petitionsClerk ||
        obj.getIrsSendDate())
    ) {
      obj.docketEntries = obj.docketEntries.filter(
        d => d.documentType !== INITIAL_DOCUMENT_TYPES.stin.documentType,
      );
    }
  } else {
    obj.docketEntries = [];
  }
};

const assignHearings = ({ applicationContext, obj, rawCase }) => {
  if (Array.isArray(rawCase.hearings)) {
    obj.hearings = rawCase.hearings
      .map(hearing => new TrialSession(hearing, { applicationContext }))
      .sort((a, b) => compareStrings(a.createdAt, b.createdAt));
  } else {
    obj.hearings = [];
  }
};

const assignArchivedDocketEntries = ({ applicationContext, obj, rawCase }) => {
  if (Array.isArray(rawCase.archivedDocketEntries)) {
    obj.archivedDocketEntries = rawCase.archivedDocketEntries.map(
      docketEntry =>
        new DocketEntry(docketEntry, {
          applicationContext,
          petitioners: obj.petitioners,
        }),
    );
  } else {
    obj.archivedDocketEntries = [];
  }
};

Case.prototype.hasPrivatePractitioners = function hasPrivatePractitioners() {
  return this.privatePractitioners.length > 0;
};

const assignContacts = ({ applicationContext, obj, rawCase }) => {
  if (!rawCase.status || rawCase.status === CASE_STATUS_TYPES.new) {
    const contacts = ContactFactory.createContacts({
      applicationContext,
      contactInfo: {
        primary: getContactPrimary(rawCase) || rawCase.contactPrimary,
        secondary: getContactSecondary(rawCase) || rawCase.contactSecondary,
      },
      partyType: rawCase.partyType,
    });

    obj.petitioners.push(contacts.primary);
    if (contacts.secondary) {
      obj.petitioners.push(contacts.secondary);
    }
  } else {
    if (Array.isArray(rawCase.petitioners)) {
      obj.petitioners = rawCase.petitioners.map(
        petitioner => new Petitioner(petitioner, { applicationContext }),
      );

      setAdditionalNameOnPetitioners({ obj, rawCase });
    }
  }
};

const assignPractitioners = ({ obj, rawCase }) => {
  if (Array.isArray(rawCase.privatePractitioners)) {
    obj.privatePractitioners = rawCase.privatePractitioners.map(
      practitioner => new PrivatePractitioner(practitioner),
    );
  } else {
    obj.privatePractitioners = [];
  }

  if (Array.isArray(rawCase.irsPractitioners)) {
    obj.irsPractitioners = rawCase.irsPractitioners.map(
      practitioner => new IrsPractitioner(practitioner),
    );
  } else {
    obj.irsPractitioners = [];
  }
};

const assignStatistics = ({ applicationContext, obj, rawCase }) => {
  if (Array.isArray(rawCase.statistics)) {
    obj.statistics = rawCase.statistics.map(
      statistic => new Statistic(statistic, { applicationContext }),
    );
  } else {
    obj.statistics = [];
  }
};

const assignCorrespondences = ({ applicationContext, obj, rawCase }) => {
  if (Array.isArray(rawCase.correspondence)) {
    obj.correspondence = rawCase.correspondence
      .map(
        correspondence =>
          new Correspondence(correspondence, { applicationContext }),
      )
      .sort((a, b) => compareStrings(a.filingDate, b.filingDate));
  } else {
    obj.correspondence = [];
  }

  if (Array.isArray(rawCase.archivedCorrespondences)) {
    obj.archivedCorrespondences = rawCase.archivedCorrespondences.map(
      correspondence =>
        new Correspondence(correspondence, { applicationContext }),
    );
  } else {
    obj.archivedCorrespondences = [];
  }
};

Case.VALIDATION_RULES = {
  archivedCorrespondences: joi
    .array()
    .items(Correspondence.VALIDATION_RULES)
    .optional()
    .description('List of Correspondence Entities that were archived.'),
  archivedDocketEntries: joi
    .array()
    .items(DOCKET_ENTRY_VALIDATION_RULES)
    .optional()
    .description(
      'List of DocketEntry Entities that were archived instead of added to the docket record.',
    ),
  associatedJudge: JoiValidationConstants.STRING.max(50)
    .optional()
    .meta({ tags: ['Restricted'] })
    .description('Judge assigned to this case. Defaults to Chief Judge.'),
  automaticBlocked: joi
    .boolean()
    .optional()
    .description(
      'Temporarily blocked from trial due to a pending item or due date.',
    ),
  automaticBlockedDate: JoiValidationConstants.ISO_DATE.when(
    'automaticBlocked',
    {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    },
  ),
  automaticBlockedReason: JoiValidationConstants.STRING.valid(
    ...Object.values(AUTOMATIC_BLOCKED_REASONS),
  )
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
    .when('status', {
      is: CASE_STATUS_TYPES.calendared,
      otherwise: joi.optional(),
      then: joi.invalid(true),
    })
    .description('Temporarily blocked from trial.'),
  blockedDate: JoiValidationConstants.ISO_DATE.when('blocked', {
    is: true,
    otherwise: joi.optional().allow(null),
    then: joi.required(),
  }).meta({ tags: ['Restricted'] }),
  blockedReason: JoiValidationConstants.STRING.max(250)
    .description(
      'Open text field for describing reason for blocking this case from trial.',
    )
    .when('blocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .meta({ tags: ['Restricted'] }),
  canAllowDocumentService: joi.boolean().optional(),
  canAllowPrintableDocketRecord: joi.boolean().optional(),
  caseCaption: JoiValidationConstants.CASE_CAPTION.required().description(
    'The name of the party bringing the case, e.g. "Carol Williams, Petitioner," "Mark Taylor, Incompetent, Debra Thomas, Next Friend, Petitioner," or "Estate of Test Taxpayer, Deceased, Petitioner." This is the first half of the case title.',
  ),
  caseNote: JoiValidationConstants.STRING.max(9000)
    .optional()
    .meta({
      tags: ['Restricted'],
    }),
  caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
  closedDate: JoiValidationConstants.ISO_DATE.when('status', {
    is: joi.exist().valid(...CLOSED_CASE_STATUSES),
    otherwise: joi.optional(),
    then: joi.required(),
  }),
  correspondence: joi
    .array()
    .items(Correspondence.VALIDATION_RULES)
    .optional()
    .description('List of Correspondence documents for the case.'),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the paper or electronic case was added to the system. This value cannot be edited.',
  ),
  damages: joi
    .number()
    .optional()
    .allow(null)
    .description('Damages for the case.'),
  docketEntries: joi
    .array()
    .items(DOCKET_ENTRY_VALIDATION_RULES)
    .required()
    .description('List of DocketEntry Entities for the case.'),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Unique case identifier in XXXXX-YY format.',
  ),
  docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
    .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
    .optional(),
  docketNumberWithSuffix: JoiValidationConstants.STRING.optional().description(
    'Auto-generated from docket number and the suffix.',
  ),
  entityName: JoiValidationConstants.STRING.valid('Case').required(),
  filingType: JoiValidationConstants.STRING.valid(
    ...FILING_TYPES[ROLES.petitioner],
    ...FILING_TYPES[ROLES.privatePractitioner],
  ).optional(),
  hasPendingItems: joi.boolean().optional(),
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
  highPriorityReason: JoiValidationConstants.STRING.max(250)
    .when('highPriority', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .meta({ tags: ['Restricted'] }),
  initialCaption: JoiValidationConstants.CASE_CAPTION.allow(null)
    .optional()
    .description('Case caption before modification.'),
  initialDocketNumberSuffix: JoiValidationConstants.STRING.valid(
    ...Object.values(DOCKET_NUMBER_SUFFIXES),
    '_',
  )
    .allow(null)
    .optional()
    .description('Case docket number suffix before modification.'),
  irsNoticeDate: JoiValidationConstants.ISO_DATE.max('now')
    .optional()
    .allow(null)
    .description('Last date that the petitioner is allowed to file before.'),
  irsPractitioners: joi
    .array()
    .items(IrsPractitioner.VALIDATION_RULES)
    .optional()
    .description(
      'List of IRS practitioners (also known as respondents) associated with the case.',
    ),
  isPaper: joi.boolean().optional(),
  isSealed: joi.boolean().optional(),
  judgeUserId: JoiValidationConstants.UUID.optional().description(
    'Unique ID for the associated judge.',
  ),
  leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional().description(
    'If this case is consolidated, this is the docket number of the lead case. It is the lowest docket number in the consolidated group.',
  ),
  litigationCosts: joi
    .number()
    .optional()
    .allow(null)
    .description('Litigation costs for the case.'),
  mailingDate: JoiValidationConstants.STRING.max(25)
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
  noticeOfTrialDate: JoiValidationConstants.ISO_DATE.optional().description(
    'Reminder for clerks to review the notice of trial date.',
  ),
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
  orderToShowCause: joi
    .boolean()
    .optional()
    .description('Reminder for clerks to review the Order to Show Cause.'),
  partyType: JoiValidationConstants.STRING.valid(...Object.values(PARTY_TYPES))
    .required()
    .description('Party type of the case petitioner.'),
  petitionPaymentDate: JoiValidationConstants.ISO_DATE.when(
    'petitionPaymentStatus',
    {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: JoiValidationConstants.ISO_DATE.max('now').required(),
    },
  ).description('When the petitioner paid the case fee.'),
  petitionPaymentMethod: JoiValidationConstants.STRING.max(50)
    .when('petitionPaymentStatus', {
      is: PAYMENT_STATUS.PAID,
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    })
    .description('How the petitioner paid the case fee.'),
  petitionPaymentStatus: JoiValidationConstants.STRING.valid(
    ...Object.values(PAYMENT_STATUS),
  )
    .required()
    .description('Status of the case fee payment.'),
  petitionPaymentWaivedDate: JoiValidationConstants.ISO_DATE.when(
    'petitionPaymentStatus',
    {
      is: PAYMENT_STATUS.WAIVED,
      otherwise: joi.allow(null).optional(),
      then: JoiValidationConstants.ISO_DATE.max('now').required(),
    },
  ).description('When the case fee was waived.'),
  // Individual items are validated by the ContactFactory.
  petitioners: joi
    .array()
    .unique(
      (a, b) =>
        a.contactType === CONTACT_TYPES.intervenor &&
        b.contactType === CONTACT_TYPES.intervenor,
    )
    .required(),
  preferredTrialCity: joi
    .alternatives()
    .try(
      JoiValidationConstants.STRING.valid(
        ...TRIAL_CITY_STRINGS,
        ...LEGACY_TRIAL_CITY_STRINGS,
        null,
      ),
      JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
    )
    .optional()
    .description('Where the petitioner would prefer to hold the case trial.'),
  privatePractitioners: joi
    .array()
    .items(PrivatePractitioner.VALIDATION_RULES)
    .optional()
    .description('List of private practitioners associated with the case.'),
  procedureType: JoiValidationConstants.STRING.valid(...PROCEDURE_TYPES)
    .required()
    .description('Procedure type of the case.'),
  qcCompleteForTrial: joi
    .object()
    .optional()
    .meta({ tags: ['Restricted'] })
    .description(
      'QC Checklist object that must be completed before the case can go to trial.',
    ),
  receivedAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the case was received by the court. If electronic, this value will be the same as createdAt. If paper, this value can be edited.',
  ),
  sealedDate: JoiValidationConstants.ISO_DATE.optional()
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
    .items(Statistic.VALIDATION_RULES)
    .when('hasVerifiedIrsNotice', {
      is: true,
      otherwise: joi.optional(),
      then: joi.when('caseType', {
        is: CASE_TYPES_MAP.deficiency,
        otherwise: joi.optional(),
        then: joi.array().min(1).required(),
      }),
    })
    .description('List of Statistic Entities for the case.'),
  status: joi
    .alternatives()
    .conditional('closedDate', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.STRING.valid(
        ...Object.values(CASE_STATUS_TYPES),
      ).optional(),
      then: JoiValidationConstants.STRING.required().valid(
        ...CLOSED_CASE_STATUSES,
      ),
    })
    .meta({ tags: ['Restricted'] })
    .description('Status of the case.'),
  trialDate: joi
    .alternatives()
    .conditional('trialSessionId', {
      is: joi.exist().not(null),
      otherwise: JoiValidationConstants.ISO_DATE.optional().allow(null),
      then: JoiValidationConstants.ISO_DATE.required(),
    })
    .description('When this case goes to trial.'),
  trialLocation: joi
    .alternatives()
    .try(
      JoiValidationConstants.STRING.valid(...TRIAL_CITY_STRINGS, null),
      JoiValidationConstants.STRING.pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      JoiValidationConstants.STRING.valid('Standalone Remote'),
    )
    .optional()
    .description(
      'Where this case goes to trial. This may be different that the preferred trial location.',
    ),
  trialSessionId: joi
    .when('status', {
      is: CASE_STATUS_TYPES.calendared,
      otherwise: joi.when('trialDate', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.UUID.optional(),
        then: JoiValidationConstants.UUID.required(),
      }),
      then: JoiValidationConstants.UUID.required(),
    })
    .description(
      'The unique ID of the trial session associated with this case.',
    ),
  trialTime: JoiValidationConstants.STRING.pattern(PATTERNS['H:MM'])
    .optional()
    .description('Time of day when this case goes to trial.'),
  useSameAsPrimary: joi
    .boolean()
    .optional()
    .description(
      'Whether to use the same address for the primary and secondary petitioner contact information (used only in data entry and QC process).',
    ),
};

joiValidationDecorator(
  Case,
  joi.object().keys(Case.VALIDATION_RULES),
  Case.VALIDATION_ERROR_MESSAGES,
);

/**
 * builds the case caption from case contact name(s) based on party type
 *
 * @param {object} rawCase the raw case data
 * @returns {string} the generated case caption
 */
Case.getCaseCaption = function (rawCase) {
  const primaryContact = clone(
    getContactPrimary(rawCase) || rawCase.contactPrimary,
  );
  const secondaryContact = clone(
    getContactSecondary(rawCase) || rawCase.contactSecondary,
  );

  // trim ALL white space from these non-validated strings
  if (primaryContact?.name) {
    primaryContact.name = primaryContact.name.trim();
  }
  if (primaryContact?.secondaryName) {
    primaryContact.secondaryName = primaryContact.secondaryName.trim();
  }
  if (primaryContact?.title) {
    primaryContact.title = primaryContact.title.trim();
  }
  if (secondaryContact?.name) {
    secondaryContact.name = secondaryContact.name.trim();
  }

  return generateCaptionFromContacts({
    partyType: rawCase.partyType,
    primaryContact,
    secondaryContact,
  });
};

const generateCaptionFromContacts = ({
  partyType,
  primaryContact,
  secondaryContact,
}) => {
  let caseCaption;
  switch (partyType) {
    case PARTY_TYPES.corporation:
    case PARTY_TYPES.petitioner:
      caseCaption = `${primaryContact.name}, Petitioner`;
      break;
    case PARTY_TYPES.petitionerSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Petitioners`;
      break;
    case PARTY_TYPES.petitionerDeceasedSpouse:
      caseCaption = `${primaryContact.name} & ${secondaryContact.name}, Deceased, ${primaryContact.name}, Surviving Spouse, Petitioners`;
      break;
    case PARTY_TYPES.estate:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, ${primaryContact.title}, Petitioner(s)`;
      break;
    case PARTY_TYPES.estateWithoutExecutor:
      caseCaption = `Estate of ${primaryContact.name}, Deceased, Petitioner`;
      break;
    case PARTY_TYPES.trust:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Trustee, Petitioner(s)`;
      break;
    case PARTY_TYPES.partnershipAsTaxMattersPartner:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipOtherThanTaxMatters:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, A Partner Other Than the Tax Matters Partner, Petitioner`;
      break;
    case PARTY_TYPES.partnershipBBA:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Partnership Representative, Petitioner(s)`;
      break;
    case PARTY_TYPES.conservator:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Conservator, Petitioner`;
      break;
    case PARTY_TYPES.guardian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Guardian, Petitioner`;
      break;
    case PARTY_TYPES.custodian:
      caseCaption = `${primaryContact.name}, ${primaryContact.secondaryName}, Custodian, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForMinor:
      caseCaption = `${primaryContact.name}, Minor, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.nextFriendForIncompetentPerson:
      caseCaption = `${primaryContact.name}, Incompetent, ${primaryContact.secondaryName}, Next Friend, Petitioner`;
      break;
    case PARTY_TYPES.donor:
      caseCaption = `${primaryContact.name}, Donor, Petitioner`;
      break;
    case PARTY_TYPES.transferee:
      caseCaption = `${primaryContact.name}, Transferee, Petitioner`;
      break;
    case PARTY_TYPES.survivingSpouse:
      caseCaption = `${primaryContact.name}, Deceased, ${primaryContact.secondaryName}, Surviving Spouse, Petitioner`;
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
  return this.docketEntries.some(docketEntry =>
    DocketEntry.isPending(docketEntry),
  );
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
 * archives a docket entry and adds it to the archivedDocketEntries array on the case
 *
 * @param {string} docketEntry the docketEntry to archive
 */
Case.prototype.archiveDocketEntry = function (
  docketEntry,
  { applicationContext },
) {
  const docketEntryToArchive = new DocketEntry(docketEntry, {
    applicationContext,
    petitioners: this.petitioners,
  });
  docketEntryToArchive.archive();
  this.archivedDocketEntries.push(docketEntryToArchive);
  this.deleteDocketEntryById({
    docketEntryId: docketEntryToArchive.docketEntryId,
  });
};

/**
 * archives a correspondence document and adds it to the archivedCorrespondences array on the case
 *
 * @param {string} correspondence the correspondence to archive
 */
Case.prototype.archiveCorrespondence = function (correspondenceEntity) {
  correspondenceEntity.archived = true;
  this.archivedCorrespondences.push(correspondenceEntity);
  this.deleteCorrespondenceById({
    correspondenceId: correspondenceEntity.correspondenceId,
  });
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
 * @param {object} docketEntryEntity the docket entry to add to the case
 */
Case.prototype.addDocketEntry = function (docketEntryEntity) {
  docketEntryEntity.docketNumber = this.docketNumber;

  if (docketEntryEntity.isOnDocketRecord) {
    const updateIndex = shouldGenerateDocketRecordIndex({
      caseDetail: this,
      docketEntry: docketEntryEntity,
    });

    if (updateIndex) {
      docketEntryEntity.index = this.generateNextDocketRecordIndex();
    } else if (
      docketEntryEntity.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode
    ) {
      throw new Error('STIN documents should not be on the docket record.');
    }
  } else if (
    docketEntryEntity.eventCode === INITIAL_DOCUMENT_TYPES.stin.eventCode
  ) {
    docketEntryEntity.index = 0;
  }

  this.docketEntries = [...this.docketEntries, docketEntryEntity];
};

/**
 * Reopen the case with the provided status
 *
 * @param {String} reopenedStatus the status to set the case to
 * @returns {Case} the updated case entity
 */
Case.prototype.reopenCase = function ({ reopenedStatus }) {
  this.closedDate = undefined;
  this.status = reopenedStatus;
  return this;
};

/**
 * Close the case with the provided status
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.closeCase = function ({ closedStatus }) {
  this.closedDate = createISODateString();
  this.status = closedStatus;
  this.unsetAsBlocked();
  this.unsetAsHighPriority();
  return this;
};

/**
 * Determines if the case has been closed
 *
 * @returns {Boolean} true if the case has been closed, false otherwise
 */
Case.prototype.isClosed = function () {
  return isClosed(this);
};

/**
 * Determines if the case has been closed
 *
 * @param {object} rawCase the case
 * @returns {Boolean} true if the case has been closed, false otherwise
 */
const isClosed = function (rawCase) {
  return isClosedStatus(rawCase.status);
};

/**
 * Determines if the case has a closed status
 *
 * @param {string} caseStatus the status of the case
 * @returns {Boolean} true if the case has been closed, false otherwise
 */
const isClosedStatus = function (caseStatus) {
  return CLOSED_CASE_STATUSES.includes(caseStatus);
};

/**
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.markAsSentToIRS = function () {
  this.status = CASE_STATUS_TYPES.generalDocket;

  this.petitioners.map(p => {
    if (PETITIONER_CONTACT_TYPES.includes(p.contactType)) {
      p.contactType = CONTACT_TYPES.petitioner;
    }
  });

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

  this.docketEntries.forEach(docketEntry => {
    const result = caseCaptionRegex.exec(docketEntry.documentTitle);
    if (result) {
      const [, , changedCaption] = result;
      lastCaption = changedCaption.replace(` ${CASE_CAPTION_POSTFIX}`, '');
    }
  });

  const needsCaptionChangedRecord =
    this.initialCaption && lastCaption !== this.caseCaption && !this.isPaper;

  if (needsCaptionChangedRecord) {
    const { userId } = applicationContext.getCurrentUser();

    this.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: `Caption of case is amended from '${lastCaption} ${CASE_CAPTION_POSTFIX}' to '${this.caseCaption} ${CASE_CAPTION_POSTFIX}'`,
          documentType: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.documentType,
          eventCode: MINUTE_ENTRIES_MAP.captionOfCaseIsAmended.eventCode,
          filingDate: createISODateString(),
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId,
        },
        { applicationContext, petitioners: this.petitioners },
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

  this.docketEntries.forEach(docketEntry => {
    const result = docketNumberRegex.exec(docketEntry.documentTitle);
    if (result) {
      const [, , changedDocketNumber] = result;
      lastDocketNumber = changedDocketNumber;
    }
  });

  const needsDocketNumberChangeRecord =
    lastDocketNumber !== newDocketNumber && !this.isPaper;

  if (needsDocketNumberChangeRecord) {
    const { userId } = applicationContext.getCurrentUser();

    this.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: `Docket Number is amended from '${lastDocketNumber}' to '${newDocketNumber}'`,
          documentType: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.documentType,
          eventCode: MINUTE_ENTRIES_MAP.dockedNumberIsAmended.eventCode,
          filingDate: createISODateString(),
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId,
        },
        { applicationContext, petitioners: this.petitioners },
      ),
    );
  }

  return this;
};

/**
 * gets the docketEntry with id docketEntryId from the docketEntries array
 *
 * @params {object} params the params object
 * @params {string} params.docketEntryId the id of the docketEntry to retrieve
 * @returns {object} the retrieved docketEntry
 */
Case.prototype.getDocketEntryById = function ({ docketEntryId }) {
  return this.docketEntries.find(
    docketEntry => docketEntry.docketEntryId === docketEntryId,
  );
};

/**
 * Retrieves the petitioner with id contactId on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the contact object
 */
const getPetitionerById = function (rawCase, contactId) {
  return rawCase.petitioners?.find(
    petitioner => petitioner.contactId === contactId,
  );
};

/**
 * gets the petitioner with id contactId from the petitioners array
 *
 * @params {object} params the params object
 * @params {string} params.contactId the id of the petitioner to retrieve
 * @returns {object} the retrieved petitioner
 */
Case.prototype.getPetitionerById = function (contactId) {
  return getPetitionerById(this, contactId);
};

/**
 * Retrieves the petitioner with email userEmail on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @params {string} params.userEmail the email of the petitioner to retrieve
 * @returns {Object} the contact object
 */
const getPetitionerByEmail = function (rawCase, userEmail) {
  return rawCase.petitioners?.find(
    petitioner => petitioner.email === userEmail,
  );
};

/**
 * checks if the case is eligible for service.
 *
 * @returns {boolean} if the case is eligible or not
 */
Case.prototype.shouldGenerateNoticesForCase = function () {
  return shouldGenerateNoticesForCase(this);
};

/**
 * gets the petitioner with email userEmail from the petitioners array
 *
 * @params {object} params the params object
 * @params {string} params.userEmail the email of the petitioner to retrieve
 * @returns {object} the retrieved petitioner
 */
Case.prototype.getPetitionerByEmail = function (userEmail) {
  return getPetitionerByEmail(this, userEmail);
};
/**
 * adds the petitioner to the petitioners array
 *
 * @params {object} petitioner the petitioner to add to the case
 * @returns {Case} the updated case
 */
Case.prototype.addPetitioner = function (petitioner) {
  this.petitioners.push(petitioner);
  return this;
};

/**
 * returns the practitioner representing a petitioner
 *
 * @params {string} petitionerContactId the id of the petitioner
 * @returns {Object} the practitioner
 */
const getPractitionersRepresenting = function (rawCase, petitionerContactId) {
  return rawCase.privatePractitioners.filter(practitioner =>
    practitioner.representing.includes(petitionerContactId),
  );
};

/**
 * removes the contact from the practitioner they are presenting
 *
 * @params {string} petitionerContactId the id of the petitioner
 */
Case.prototype.removeRepresentingFromPractitioners = function (
  petitionerContactId,
) {
  this.privatePractitioners.forEach(practitioner => {
    const representingArrayIndex =
      practitioner.representing.indexOf(petitionerContactId);
    if (representingArrayIndex >= 0) {
      practitioner.representing.splice(representingArrayIndex, 1);
    }
  });
};

/**
 * returns the practitioner representing a petitioner
 *
 * @params {string} petitionerContactId the id of the petitioner
 * @returns {Object} the practitioner
 */
Case.prototype.getPractitionersRepresenting = function (petitionerContactId) {
  return getPractitionersRepresenting(this, petitionerContactId);
};

/**
 * removes the petitioner from the petitioners array
 *
 * @params {object} contactId the contactId of the petitioner to remove from the case
 */
Case.prototype.removePetitioner = function (contactId) {
  this.petitioners = this.petitioners.filter(
    petitioner => petitioner.contactId !== contactId,
  );
};

/**
 * gets the correspondence with id correspondenceId from the correspondence array
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to retrieve
 * @returns {object} the retrieved correspondence
 */
Case.prototype.getCorrespondenceById = function ({ correspondenceId }) {
  return this.correspondence.find(
    correspondence => correspondence.correspondenceId === correspondenceId,
  );
};

/**
 * gets a document from docketEntries or correspondence arrays
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to retrieve
 * @returns {object} the retrieved correspondence
 */
Case.getAttachmentDocumentById = function ({
  caseDetail,
  documentId,
  useArchived = false,
}) {
  let allCaseDocuments = [
    ...caseDetail.correspondence,
    ...caseDetail.docketEntries,
  ];
  if (useArchived) {
    allCaseDocuments = [
      ...allCaseDocuments,
      ...caseDetail.archivedDocketEntries,
      ...caseDetail.archivedCorrespondences,
    ];
  }
  return allCaseDocuments.find(
    d =>
      d &&
      (d.docketEntryId === documentId || d.correspondenceId === documentId),
  );
};

/**
 * deletes the docket entry with id docketEntryId from the docketEntries array
 *
 * @params {object} params the params object
 * @params {string} params.docketEntryId the id of the docket entry to remove from the docketEntries array
 * @returns {Case} the updated case entity
 */
Case.prototype.deleteDocketEntryById = function ({ docketEntryId }) {
  this.docketEntries = this.docketEntries.filter(
    item => item.docketEntryId !== docketEntryId,
  );

  return this;
};

/**
 * deletes the correspondence with id correspondenceId from the correspondence array
 *
 * @params {object} params the params object
 * @params {string} params.correspondenceId the id of the correspondence to remove from the correspondence array
 * @returns {Case} the updated case entity
 */
Case.prototype.deleteCorrespondenceById = function ({ correspondenceId }) {
  this.correspondence = this.correspondence.filter(
    item => item.correspondenceId !== correspondenceId,
  );

  return this;
};

Case.prototype.getPetitionDocketEntry = function () {
  return getPetitionDocketEntry(this);
};

const getPetitionDocketEntry = function (rawCase) {
  return rawCase.docketEntries?.find(
    docketEntry =>
      docketEntry.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
};

const caseHasServedPetition = rawCase => {
  const petitionDocketEntry = getPetitionDocketEntry(rawCase);
  return petitionDocketEntry && isServed(petitionDocketEntry);
};

Case.prototype.getIrsSendDate = function () {
  const petitionDocketEntry = this.getPetitionDocketEntry();
  if (petitionDocketEntry) {
    return petitionDocketEntry.servedAt;
  }
};

/**
 * gets the next possible (unused) index for the docket record
 *
 * @returns {number} the next docket record index
 */
Case.prototype.generateNextDocketRecordIndex = function () {
  const nextIndex =
    this.docketEntries
      .filter(d => d.isOnDocketRecord && d.index !== undefined)
      .sort((a, b) => a.index - b.index).length + 1;
  return nextIndex;
};

/**
 *
 * @param {DocketEntry} updatedDocketEntry the docket entry to update on the case
 * @returns {Case} the updated case entity
 */
Case.prototype.updateDocketEntry = function (updatedDocketEntry) {
  const foundDocketEntryIndex = this.docketEntries.findIndex(
    docketEntry =>
      docketEntry.docketEntryId === updatedDocketEntry.docketEntryId,
  );

  if (foundDocketEntryIndex !== -1) {
    this.docketEntries[foundDocketEntryIndex] = updatedDocketEntry;

    if (updatedDocketEntry.isOnDocketRecord) {
      const updateIndex = shouldGenerateDocketRecordIndex({
        caseDetail: this,
        docketEntry: updatedDocketEntry,
      });

      if (updateIndex) {
        updatedDocketEntry.index = this.generateNextDocketRecordIndex();
      }
    }
  }

  return this;
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
    this.docketEntries.forEach(docketEntry => {
      const isAnswerDocument = includes(
        ANSWER_DOCUMENT_CODES,
        docketEntry.eventCode,
      );

      const daysElapsedSinceDocumentWasFiled = calculateDifferenceInDays(
        currentDate,
        docketEntry.createdAt,
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
 * returns a sortable docket number in ${year}${index} format
 *
 * @param {string} docketNumber the docket number to use
 * @returns {string|void} the sortable docket number
 */
Case.getSortableDocketNumber = function (docketNumber) {
  if (!docketNumber) {
    return;
  }

  // NOTE: 1574-65 is the oldest case in DAWSON, which was filed in 1965
  const oldestYear = 65;

  const [sequentialNumber, yearFiled] = docketNumber.split('-');
  const sequentialNumberPadded = sequentialNumber.padStart(6, '0');
  const yearFiledAdjusted =
    parseInt(yearFiled) >= oldestYear ? `19${yearFiled}` : `20${yearFiled}`;

  return parseInt(`${yearFiledAdjusted}${sequentialNumberPadded}`);
};

/**
 * generates sort tags used for sorting trials for calendaring
 *
 * @returns {object} the sort tags
 */
Case.prototype.generateTrialSortTags = function () {
  const {
    caseType,
    docketNumber,
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

  const formattedFiledTime = formatDateString(
    receivedAt,
    FORMATS.TRIAL_SORT_TAG,
  );
  const formattedTrialCity = preferredTrialCity.replace(/[\s.,]/g, '');

  const nonHybridSortKey = [
    formattedTrialCity,
    caseProcedureSymbol,
    casePrioritySymbol,
    formattedFiledTime,
    docketNumber,
  ].join('-');

  const hybridSortKey = [
    formattedTrialCity,
    'H', // Hybrid Tag
    casePrioritySymbol,
    formattedFiledTime,
    docketNumber,
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
  this.updateTrialSessionInformation(trialSessionEntity);
  if (trialSessionEntity.isCalendared === true) {
    this.status = CASE_STATUS_TYPES.calendared;
  }
  return this;
};

/**
 * update trial session information
 *
 * @param {object} trialSessionEntity - the trial session that is associated with the case
 * @returns {Case} the updated case entity
 */
Case.prototype.updateTrialSessionInformation = function (trialSessionEntity) {
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

  return this;
};

/**
 * returns true if the case is associated with the userId
 *
 * @param {object} arguments arguments
 * @param {object} arguments.caseRaw raw case details
 * @param {string} arguments.user the user account
 * @returns {boolean} if the case is associated
 */
const isAssociatedUser = function ({ caseRaw, user }) {
  const isIrsPractitioner =
    caseRaw.irsPractitioners &&
    caseRaw.irsPractitioners.find(r => r.userId === user.userId);

  const isPrivatePractitioner =
    caseRaw.privatePractitioners &&
    caseRaw.privatePractitioners.find(p => p.userId === user.userId);

  const isPartyOnCase = !!getPetitionerById(caseRaw, user.userId);

  const isIrsSuperuser = user.role === ROLES.irsSuperuser;

  const petitionDocketEntry = (caseRaw.docketEntries || []).find(
    doc => doc.documentType === 'Petition',
  );

  const isPetitionServed = petitionDocketEntry && isServed(petitionDocketEntry);

  return (
    isIrsPractitioner ||
    isPrivatePractitioner ||
    isPartyOnCase ||
    (isIrsSuperuser && isPetitionServed)
  );
};

/**
 * @param {Object} options the options argument
 * @param {Array} options.consolidatedCases an array of consolidated cases
 * @param {String} userId the user's id
 * @returns {boolean} true if the user is a party of the case
 */
const isUserPartOfGroup = function ({ consolidatedCases, userId }) {
  return consolidatedCases.some(aCase =>
    userIsDirectlyAssociated({ aCase, userId }),
  );
};

/**
 * @param {Object} options the options argument
 * @param {Object} options.aCase A Case
 * @param {String} options.userId the user's id
 * @returns {boolean} true if the user is a party of the case
 */
const userIsDirectlyAssociated = function ({ aCase, userId }) {
  const userIsPartyToCase = [
    ...(aCase.petitioners || []),
    ...(aCase.privatePractitioners || []),
    ...(aCase.irsPractitioners || []),
  ].some(user => user?.userId === userId || user?.contactId === userId);
  return userIsPartyToCase;
};

/**
 * Computes and sets additionalName for contactPrimary depending on partyType
 */
const setAdditionalNameOnPetitioners = function ({ obj, rawCase }) {
  const contactPrimary = getContactPrimary(rawCase);

  if (contactPrimary && !contactPrimary.additionalName) {
    const contactPrimaryRef = obj.petitioners.find(
      p => p.contactId === contactPrimary.contactId,
    );

    switch (rawCase.partyType) {
      case PARTY_TYPES.conservator:
      case PARTY_TYPES.custodian:
      case PARTY_TYPES.guardian:
      case PARTY_TYPES.nextFriendForIncompetentPerson:
      case PARTY_TYPES.nextFriendForMinor:
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
      case PARTY_TYPES.partnershipBBA:
      case PARTY_TYPES.survivingSpouse:
      case PARTY_TYPES.trust:
        contactPrimaryRef.additionalName = contactPrimaryRef.secondaryName;
        delete contactPrimaryRef.secondaryName;
        break;
      case PARTY_TYPES.estate: {
        const additionalNameFields = compact([
          contactPrimaryRef.secondaryName,
          contactPrimaryRef.title,
        ]);
        contactPrimaryRef.additionalName = additionalNameFields.join(', ');
        delete contactPrimaryRef.secondaryName;
        delete contactPrimaryRef.title;
        break;
      }
      case PARTY_TYPES.estateWithoutExecutor:
      case PARTY_TYPES.corporation:
      case PARTY_TYPES.petitionerDeceasedSpouse:
        contactPrimaryRef.additionalName = `c/o ${contactPrimaryRef.inCareOf}`;
        delete contactPrimaryRef.inCareOf;
        break;
      default:
        break;
    }
  }
};

/**
 * Retrieves the contact from the case based on whatever contactType is specified
 *
 * @param {Object} providers the providers object
 * @param {String} providers.contactType the type of contact we are looking for (primary or secondary)
 * @param {Object} providers.rawCase the raw case
 * @returns {Object|void} the contact object on the case
 */
const getContactPrimaryOrSecondary = function ({ contactType, rawCase }) {
  if (!rawCase.petitioners) {
    return;
  } else if (!rawCase.status || rawCase.status === CASE_STATUS_TYPES.new) {
    return rawCase.petitioners.find(p => p.contactType === contactType);
  }

  const petitioners = rawCase.petitioners.filter(
    p => p.contactType === CONTACT_TYPES.petitioner,
  );

  if (contactType === CONTACT_TYPES.primary) {
    return petitioners[0];
  } else if (contactType === CONTACT_TYPES.secondary) {
    return petitioners[1];
  }
};

/**
 * Retrieves the primary contact on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the primary contact object on the case
 */
const getContactPrimary = function (rawCase) {
  return getContactPrimaryOrSecondary({
    contactType: CONTACT_TYPES.primary,
    rawCase,
  });
};

/**
 * Returns the primary contact on the case
 *
 * @returns {Object} the primary contact object on the case
 */
Case.prototype.getContactPrimary = function () {
  return getContactPrimary(this);
};

/**
 * Retrieves the secondary contact on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Object} the secondary contact object on the case
 */
const getContactSecondary = function (rawCase) {
  return getContactPrimaryOrSecondary({
    contactType: CONTACT_TYPES.secondary,
    rawCase,
  });
};

/**
 * Retrieves the other filers on the case
 *
 * @param {object} arguments.rawCase the raw case
 * @returns {Array} the other filers on the case
 */
const getOtherFilers = function (rawCase) {
  return rawCase.petitioners?.filter(
    p =>
      p.contactType === CONTACT_TYPES.participant ||
      p.contactType === CONTACT_TYPES.intervenor,
  );
};

/**
 * Checks if the provided userId is a private practitioner or irs practitioner on the case.
 *
 * @param {string} userId the userId of the user to check
 * @returns  {boolean} if the userId is a private practitioner or irs practitioner on the case
 */
Case.prototype.isPractitioner = function (userId) {
  return (
    this.privatePractitioners.some(p => p.userId === userId) ||
    this.irsPractitioners.some(p => p.userId === userId)
  );
};

/**
 * Returns the secondary contact on the case
 *
 * @returns {Object} the secondary contact object on the case
 */
Case.prototype.getContactSecondary = function () {
  return getContactSecondary(this);
};

/**
 * Returns the other filers on the case
 *
 * @returns {Array} the other filers on the case
 */
Case.prototype.getOtherFilers = function () {
  return getOtherFilers(this);
};

/**
 * Updates the specified contact object in the case petitioner's array
 *
 * @param {object} arguments.rawCase the raw case object
 * @param {object} arguments.updatedPetitioner the updated petitioner object
 */
const updatePetitioner = function (rawCase, updatedPetitioner) {
  const petitionerIndex = rawCase.petitioners.findIndex(
    p => p.contactId === updatedPetitioner.contactId,
  );

  if (petitionerIndex !== -1) {
    rawCase.petitioners[petitionerIndex] = updatedPetitioner;
  } else {
    throw new Error(
      `Petitioner was not found on case ${rawCase.docketNumber}.`,
    );
  }
};

/**
 * Updates the specified contact object in the case petitioner's array
 *
 * @param {object} arguments.updatedPetitioner the updated petitioner object
 */
Case.prototype.updatePetitioner = function (updatedPetitioner) {
  updatePetitioner(this, updatedPetitioner);
};

/**
 * Determines if provided user is associated with the case
 *
 * @param {object} arguments.user the user account
 * @returns {boolean} true if the user provided is associated with the case, false otherwise
 */
Case.prototype.isAssociatedUser = function ({ user }) {
  return isAssociatedUser({ caseRaw: this, user });
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
  return (
    this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial &&
    this.preferredTrialCity &&
    !this.blocked &&
    !this.automaticBlocked
  );
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
 * @param {string} caseStatus optional case status to set the case to
 * @param {string} associatedJudge optional associatedJudge to set on the case
 * @returns {Case} the updated case entity
 */
Case.prototype.removeFromTrial = function (caseStatus, associatedJudge) {
  this.setAssociatedJudge(associatedJudge || CHIEF_JUDGE);
  this.setCaseStatus(
    caseStatus || CASE_STATUS_TYPES.generalDocketReadyForTrial,
  );
  this.trialDate = undefined;
  this.trialLocation = undefined;
  this.trialSessionId = undefined;
  this.trialTime = undefined;
  return this;
};

/**
 * check to see if trialSessionId is a hearing
 *
 * @param {string} trialSessionId trial session id to check
 * @returns {boolean} whether or not the trial session id associated is a hearing or not
 */
Case.prototype.isHearing = function (trialSessionId) {
  return this.hearings.some(
    trialSession => trialSession.trialSessionId === trialSessionId,
  );
};

/**
 * removes a hearing from the case.hearings array
 *
 * @param {string} trialSessionId trial session id associated with hearing to remove
 */
Case.prototype.removeFromHearing = function (trialSessionId) {
  const removeIndex = this.hearings
    .map(trialSession => trialSession.trialSessionId)
    .indexOf(trialSessionId);

  this.hearings.splice(removeIndex, 1);
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
 * @param {string} updatedCaseStatus the case status to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseStatus = function (updatedCaseStatus) {
  const previousCaseStatus = this.status;

  this.status = updatedCaseStatus;

  if (
    [
      CASE_STATUS_TYPES.generalDocket,
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    ].includes(updatedCaseStatus)
  ) {
    this.associatedJudge = CHIEF_JUDGE;
  }

  if (isClosedStatus(updatedCaseStatus)) {
    this.closeCase({ closedStatus: updatedCaseStatus });
  } else {
    if (isClosedStatus(previousCaseStatus)) {
      this.reopenCase({ reopenedStatus: updatedCaseStatus });
    }
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

  if (this.preferredTrialCity !== caseEntity.preferredTrialCity) {
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
    CASE_STATUS_TYPES.onAppeal,
    ...CLOSED_CASE_STATUSES,
  ];

  const caseToCheck = caseToConsolidate || this;

  return !ineligibleStatusTypes.includes(caseToCheck.status);
};

/**
 * sets lead docket number on the current case
 *
 * @param {string} leadDocketNumber the docketNumber of the lead case for consolidation
 * @returns {Case} the updated Case entity
 */
Case.prototype.setLeadCase = function (leadDocketNumber) {
  this.leadDocketNumber = leadDocketNumber;
  return this;
};

/**
 * removes the consolidation from the case by setting leadDocketNumber to undefined
 *
 * @returns {Case} the updated Case entity
 */
Case.prototype.removeConsolidation = function () {
  this.leadDocketNumber = undefined;
  return this;
};

/**
 * checks all the practitioners on the case to see if there is a privatePractitioner associated with the userId
 *
 * @param {String} userId the id of the user
 * @returns {boolean} if the userId has a privatePractitioner associated with them
 */
const isUserIdRepresentedByPrivatePractitioner = function (rawCase, userId) {
  return !!rawCase.privatePractitioners?.find(practitioner =>
    practitioner.representing.find(id => id === userId),
  );
};

/**
 * checks all the practitioners on the case to see if there is a privatePractitioner associated with the userId
 *
 * @param {String} userId the id of the user
 * @returns {boolean} if the userId has a privatePractitioner associated with them
 */
Case.prototype.isUserIdRepresentedByPrivatePractitioner = function (userId) {
  return isUserIdRepresentedByPrivatePractitioner(this, userId);
};

/**
 * sorts the given array of cases by docket number
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.sortByDocketNumber = function (cases) {
  return cases.sort((a, b) => {
    const aSplit = a.docketNumber.split('-');
    const bSplit = b.docketNumber.split('-');

    if (aSplit[1] !== bSplit[1]) {
      // compare years if they aren't the same;
      // compare as strings, because they *might* have suffix
      return aSplit[1].localeCompare(bSplit[1]);
    } else {
      // compare index if years are the same, compare as integers
      return +aSplit[0] - +bSplit[0];
    }
  });
};

/**
 * return the lead case for the given set of cases based on createdAt
 * (does NOT evaluate leadDocketNumber)
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.findLeadCaseForCases = function (cases) {
  const casesOrdered = Case.sortByDocketNumber([...cases]);
  return casesOrdered.shift();
};

/**
 * re-formats docket number with any leading zeroes and suffix removed
 *
 * @param {string} docketNumber the docket number to re-format
 * @returns {string} the formatted docket Number
 */
Case.formatDocketNumber = function formatDocketNumber(docketNumber) {
  const regex = /^0*(\d+-\d{2}).*/;
  return docketNumber.replace(regex, '$1');
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
 * sets isSealed to false and sealedDate to undefined on a case
 *
 * @returns {Case} this case entity
 */
Case.prototype.setAsUnsealed = function () {
  this.isSealed = false;
  this.sealedDate = undefined;
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
 * updates the correspondence document on the case
 *
 * @param {Correspondence} correspondenceEntity the correspondence document to add to the case
 * @returns {Case} this case entity
 */
Case.prototype.updateCorrespondence = function (correspondenceEntity) {
  const foundCorrespondence = this.correspondence.find(
    correspondence =>
      correspondence.correspondenceId === correspondenceEntity.correspondenceId,
  );

  if (foundCorrespondence)
    Object.assign(foundCorrespondence, correspondenceEntity);

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

/**
 * Returns true if at least one party on the case has the provided serviceIndicator type.
 *
 * @param {Object} rawCase the raw case object
 * @param {string} serviceType the serviceIndicator type to check for
 * @returns {Boolean} true if at least one party on the case has the provided serviceIndicator type, false otherwise.
 */
const hasPartyWithServiceType = function (rawCase, serviceType) {
  return (
    rawCase.petitioners.some(p => p.serviceIndicator === serviceType) ||
    (rawCase.privatePractitioners &&
      rawCase.privatePractitioners.find(
        pp => pp.serviceIndicator === serviceType,
      )) ||
    (rawCase.irsPractitioners &&
      rawCase.irsPractitioners.find(ip => ip.serviceIndicator === serviceType))
  );
};

/**
 * Returns true if at least one party on the case has the provided serviceIndicator type.
 *
 * @param {string} serviceType the serviceIndicator type to check for
 * @returns {Boolean} true if at least one party on the case has the provided serviceIndicator type, false otherwise.
 */
Case.prototype.hasPartyWithServiceType = function (serviceType) {
  return hasPartyWithServiceType(this, serviceType);
};

/**
 * Returns true if the case should be displayed as eligible for trial sessions
 *
 * @returns {Boolean} true if the case is eligible
 */
Case.prototype.getShouldHaveTrialSortMappingRecords = function () {
  return !!(
    (this.highPriority ||
      this.status === CASE_STATUS_TYPES.generalDocketReadyForTrial) &&
    this.preferredTrialCity &&
    !this.blocked &&
    (!this.automaticBlocked || (this.automaticBlocked && this.highPriority))
  );
};

const isSealedCase = rawCase => rawCase.isSealed || !!rawCase.sealedDate;

const isLeadCase = rawCase => rawCase.docketNumber === rawCase.leadDocketNumber;

const caseHasServedDocketEntries = rawCase => {
  return !!rawCase.docketEntries.some(docketEntry => isServed(docketEntry));
};

/**
 * determines if the case is in a state where documents can be served
 *
 * @param {Object} rawCase The Case we are using to determine whether we can allow document service
 * @returns {Boolean} whether or not documents can be served on the case
 */
const canAllowDocumentServiceForCase = rawCase => {
  if (typeof rawCase.canAllowDocumentService !== 'undefined') {
    return rawCase.canAllowDocumentService;
  }
  return CASE_STATUS_TYPES.new !== rawCase.status;
};

/**
 * determines whether or not to file automatically generated notices for notice of change of address
 *
 * @param {Object} rawCase the court case
 * @returns {Boolean} whether or not we should automatically generate notices for a change of address
 */
const shouldGenerateNoticesForCase = rawCase => {
  if (typeof rawCase.shouldGenerateNotices !== 'undefined') {
    return rawCase.shouldGenerateNotices;
  }
  const isOpen = ![...CLOSED_CASE_STATUSES, CASE_STATUS_TYPES.new].includes(
    rawCase.status,
  );
  const MAX_CLOSED_DATE = calculateISODate({
    howMuch: -6,
    units: 'months',
  });
  const isRecent =
    rawCase.closedDate &&
    dateStringsCompared(rawCase.closedDate, MAX_CLOSED_DATE) >= 0;
  return Boolean(isOpen || isRecent);
};

/**
 *  determines whether or not we should show the printable docket record
 *
 * @param {Object} rawCase  the case we are using to determine whether we should show the printable docket record
 * @returns {Boolean} whether or not we should show the printable docket record
 */
const canAllowPrintableDocketRecord = rawCase => {
  if (typeof rawCase.canAllowPrintableDocketRecord !== 'undefined') {
    return rawCase.canAllowPrintableDocketRecord;
  }
  return rawCase.status !== CASE_STATUS_TYPES.new;
};

module.exports = {
  Case: validEntityDecorator(Case),
  canAllowDocumentServiceForCase,
  canAllowPrintableDocketRecord,
  caseDecorator,
  caseHasServedDocketEntries,
  caseHasServedPetition,
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getPetitionDocketEntry,
  getPetitionerById,
  getPractitionersRepresenting,
  hasPartyWithServiceType,
  isAssociatedUser,
  isClosed,
  isClosedStatus,
  isLeadCase,
  isSealedCase,
  isUserIdRepresentedByPrivatePractitioner,
  isUserPartOfGroup,
  shouldGenerateNoticesForCase,
  updatePetitioner,
  userIsDirectlyAssociated,
};

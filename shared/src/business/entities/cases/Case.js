const joi = require('@hapi/joi');
const {
  CHIEF_JUDGE,
  DOCKET_NUMBER_MATCHER,
  TRIAL_LOCATION_MATCHER,
} = require('./CaseConstants');
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
const { find, includes, isEmpty } = require('lodash');
const { MAX_FILE_SIZE_MB } = require('../../../persistence/s3/getUploadPolicy');
const { Order } = require('../orders/Order');
const { Practitioner } = require('../Practitioner');
const { Respondent } = require('../Respondent');
const { TrialSession } = require('../trialSessions/TrialSession');
const { User } = require('../User');

const orderDocumentTypes = Order.ORDER_TYPES.map(
  orderType => orderType.documentType,
);
const courtIssuedDocumentTypes = Document.COURT_ISSUED_EVENT_CODES.map(
  courtIssuedDoc => courtIssuedDoc.documentType,
);

Case.PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not Paid',
  WAIVED: 'Waived',
};

Case.STATUS_TYPES = {
  assignedCase: 'Assigned - Case', // Case has been assigned to a judge
  assignedMotion: 'Assigned - Motion', // Someone has requested a judge for the case
  calendared: 'Calendared', // Case has been scheduled for trial
  cav: 'CAV', // Core alternative valuation
  closed: 'Closed', // Judge has made a ruling to close the case
  generalDocket: 'General Docket - Not at Issue', // Submitted to the IRS
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)', // Case is ready for trial
  inProgress: 'In Progress', // Case has been saved for later
  jurisdictionRetained: 'Jurisdiction Retained', // Jurisdiction of a case is retained by a specific judge — usually after the case is on a judge’s trial calendar
  new: 'New', // Case has not been QCed
  onAppeal: 'On Appeal', // After the trial, the case has gone to the appeals court
  rule155: 'Rule 155', // Where the Court has filed or stated its opinion or issued a dispositive order determining the issues in a case, it may withhold entry of its decision for the purpose of permitting the parties to submit computations pursuant to the Court’s determination of the issues, showing the correct amount to be included in the decision.
  submitted: 'Submitted', // Submitted to the judge for decision
};

Case.STATUS_TYPES_WITH_ASSOCIATED_JUDGE = [
  Case.STATUS_TYPES.assignedCase,
  Case.STATUS_TYPES.assignedMotion,
  Case.STATUS_TYPES.cav,
  Case.STATUS_TYPES.jurisdictionRetained,
  Case.STATUS_TYPES.rule155,
  Case.STATUS_TYPES.submitted,
];

Case.STATUS_TYPES_MANUAL_UPDATE = [
  Case.STATUS_TYPES.assignedCase,
  Case.STATUS_TYPES.assignedMotion,
  Case.STATUS_TYPES.cav,
  Case.STATUS_TYPES.closed,
  Case.STATUS_TYPES.generalDocket,
  Case.STATUS_TYPES.generalDocketReadyForTrial,
  Case.STATUS_TYPES.jurisdictionRetained,
  Case.STATUS_TYPES.onAppeal,
  Case.STATUS_TYPES.rule155,
  Case.STATUS_TYPES.submitted,
];

Case.ANSWER_CUTOFF_AMOUNT = 45;
Case.ANSWER_CUTOFF_UNIT = 'day';

Case.CASE_TYPES_MAP = {
  cdp: 'CDP (Lien/Levy)',
  deficiency: 'Deficiency',
  djExemptOrg: 'Declaratory Judgment (Exempt Organization)',
  djRetirementPlan: 'Declaratory Judgment (Retirement Plan)',
  innocentSpouse: 'Innocent Spouse',
  interestAbatement: 'Interest Abatement',
  other: 'Other',
  partnershipSection1101: 'Partnership (BBA Section 1101)',
  partnershipSection6226: 'Partnership (Section 6226)',
  partnershipSection6228: 'Partnership (Section 6228)',
  passport: 'Passport',
  whistleblower: 'Whistleblower',
  workerClassification: 'Worker Classification',
};

Case.CASE_TYPES = Object.values(Case.CASE_TYPES_MAP);

// This is the order that they appear in the UI
Case.PROCEDURE_TYPES = ['Regular', 'Small'];

Case.FILING_TYPES = {
  [User.ROLES.petitioner]: [
    'Myself',
    'Myself and my spouse',
    'A business',
    'Other',
  ],
  [User.ROLES.practitioner]: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

Case.CASE_CAPTION_POSTFIX = 'v. Commissioner of Internal Revenue, Respondent';

Case.ANSWER_DOCUMENT_CODES = [
  'A',
  'AAAP',
  'AAPN',
  'AATP',
  'AATS',
  'AATT',
  'APA',
  'ASAP',
  'ASUP',
  'ATAP',
  'ATSP',
];

Case.AUTOMATIC_BLOCKED_REASONS = {
  dueDate: 'Due Date',
  pending: 'Pending Item',
  pendingAndDueDate: 'Pending Item and Due Date',
};

Case.CHIEF_JUDGE = CHIEF_JUDGE;

Case.DOCKET_NUMBER_SUFFIXES = ['W', 'P', 'X', 'R', 'SL', 'L', 'S'];

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
  petitionPaymentDate: 'Enter a payment date',
  petitionPaymentMethod: 'Enter payment method',
  petitionPaymentStatus: 'Enter payment status',
  petitionPaymentWaivedDate: 'Enter date of waiver',
  preferredTrialCity: 'Select a preferred trial location',
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
  stinFile: 'Upload a statement of taxpayer identification',
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
function Case(rawCase, { applicationContext }) {
  if (!applicationContext) {
    throw new TypeError('applicationContext must be defined');
  }

  if (User.isInternalUser(applicationContext.getCurrentUser().role)) {
    this.caseNote = rawCase.caseNote;
    this.qcCompleteForTrial = rawCase.qcCompleteForTrial || {};
  }

  // TODO: as part of the security task, these values also need to be restricted
  this.associatedJudge = rawCase.associatedJudge || Case.CHIEF_JUDGE;
  this.automaticBlocked = rawCase.automaticBlocked;
  this.automaticBlockedDate = rawCase.automaticBlockedDate;
  this.automaticBlockedReason = rawCase.automaticBlockedReason;
  this.blocked = rawCase.blocked;
  this.blockedDate = rawCase.blockedDate;
  this.blockedReason = rawCase.blockedReason;
  this.highPriority = rawCase.highPriority;
  this.highPriorityReason = rawCase.highPriorityReason;

  this.status = rawCase.status || Case.STATUS_TYPES.new;
  this.userId = rawCase.userId;

  this.caseCaption = rawCase.caseCaption;
  this.caseId = rawCase.caseId || applicationContext.getUniqueId();
  this.caseType = rawCase.caseType;
  this.closedDate = rawCase.closedDate;
  this.createdAt = rawCase.createdAt || createISODateString();
  this.docketNumber = rawCase.docketNumber;
  this.docketNumberSuffix = getDocketNumberSuffix(rawCase);
  this.filingType = rawCase.filingType;
  this.hasIrsNotice = rawCase.hasIrsNotice;
  this.hasVerifiedIrsNotice = rawCase.hasVerifiedIrsNotice;
  this.irsNoticeDate = rawCase.irsNoticeDate;
  this.irsSendDate = rawCase.irsSendDate;
  this.isPaper = rawCase.isPaper;
  this.isSealed = !!rawCase.sealedDate;
  this.leadCaseId = rawCase.leadCaseId;
  this.mailingDate = rawCase.mailingDate;
  this.partyType = rawCase.partyType;
  this.petitionPaymentDate = rawCase.petitionPaymentDate;
  this.petitionPaymentMethod = rawCase.petitionPaymentMethod;
  this.petitionPaymentStatus =
    rawCase.petitionPaymentStatus || Case.PAYMENT_STATUS.UNPAID;
  this.petitionPaymentWaivedDate = rawCase.petitionPaymentWaivedDate;
  this.preferredTrialCity = rawCase.preferredTrialCity;
  this.procedureType = rawCase.procedureType;
  this.receivedAt = rawCase.receivedAt || createISODateString();
  this.sealedDate = rawCase.sealedDate;
  this.trialDate = rawCase.trialDate;
  this.trialLocation = rawCase.trialLocation;
  this.trialSessionId = rawCase.trialSessionId;
  this.trialTime = rawCase.trialTime;

  this.initialDocketNumberSuffix =
    rawCase.initialDocketNumberSuffix || this.docketNumberSuffix || '_';

  if (rawCase.caseCaption) {
    this.setCaseTitle(rawCase.caseCaption);
    this.initialTitle = rawCase.initialTitle || this.caseTitle;
  }

  if (Array.isArray(rawCase.documents)) {
    this.documents = rawCase.documents.map(
      document => new Document(document, { applicationContext }),
    );
  } else {
    this.documents = [];
  }

  this.hasPendingItems = this.documents.some(document => document.pending);

  if (Array.isArray(rawCase.practitioners)) {
    this.practitioners = rawCase.practitioners.map(
      practitioner => new Practitioner(practitioner),
    );
  } else {
    this.practitioners = [];
  }

  if (Array.isArray(rawCase.respondents)) {
    this.respondents = rawCase.respondents.map(
      respondent => new Respondent(respondent),
    );
  } else {
    this.respondents = [];
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
    {
      isPaper: rawCase.isPaper,
      preferredTrialCity: rawCase.preferredTrialCity,
      rawValue: rawCase.orderDesignatingPlaceOfTrial,
    },
  );

  const contacts = ContactFactory.createContacts({
    contactInfo: {
      primary: rawCase.contactPrimary,
      secondary: rawCase.contactSecondary,
    },
    isPaper: rawCase.isPaper,
    partyType: rawCase.partyType,
  });
  this.contactPrimary = contacts.primary;
  this.contactSecondary = contacts.secondary;
}

joiValidationDecorator(
  Case,
  joi.object().keys({
    associatedJudge: joi
      .string()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('Judge assigned to this case. Defaults to Chief Judge.'),
    automaticBlocked: joi
      .boolean()
      .optional()
      .description(
        'Temporarily blocked from trial due to a pending item or due date.',
      ),
    automaticBlockedDate: joi.when('automaticBlocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi
        .date()
        .iso()
        .required(),
    }),
    automaticBlockedReason: joi.when('automaticBlocked', {
      is: true,
      otherwise: joi.optional().allow(null),
      then: joi
        .string()
        .valid(...Object.values(Case.AUTOMATIC_BLOCKED_REASONS))
        .required()
        .description(
          'The reason the case was automatically blocked from trial.',
        ),
    }),
    blocked: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('Temporarily blocked from trial.'),
    blockedDate: joi
      .when('blocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi
          .date()
          .iso()
          .required(),
      })
      .meta({ tags: ['Restricted'] }),
    blockedReason: joi
      .when('blocked', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi
          .string()
          .required()
          .description(
            'Open text field for describing reason for blocking this case from trial.',
          ),
      })
      .meta({ tags: ['Restricted'] }),
    caseCaption: joi
      .string()
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
      .optional()
      .meta({ tags: ['Restricted'] }),
    caseType: joi
      .string()
      .valid(...Case.CASE_TYPES)
      .required(),
    closedDate: joi.when('status', {
      is: Case.STATUS_TYPES.closed,
      otherwise: joi.optional().allow(null),
      then: joi
        .date()
        .iso()
        .required(),
    }),
    contactPrimary: joi.object().required(),
    contactSecondary: joi
      .object()
      .optional()
      .allow(null),
    createdAt: joi
      .date()
      .iso()
      .required()
      .description('When the case was added to the system.'),
    docketNumber: joi
      .string()
      .regex(DOCKET_NUMBER_MATCHER)
      .required()
      .description('Unique case ID in XXXXX-YY format.'),
    docketNumberSuffix: joi
      .string()
      .allow(null)
      .valid(...Object.values(Case.DOCKET_NUMBER_SUFFIXES))
      .optional(),
    docketRecord: joi
      .array()
      .items(joi.object().meta({ entityName: 'DocketRecord' }))
      .min(1)
      .required()
      .unique((a, b) => a.index === b.index)
      .description('List of DocketRecord Entities for the case.'),
    documents: joi
      .array()
      .items(joi.object().meta({ entityName: 'Document' }))
      .min(1)
      .required()
      .description('List of Document Entities for the case.'),
    filingType: joi
      .string()
      .valid(
        ...Case.FILING_TYPES[User.ROLES.petitioner],
        ...Case.FILING_TYPES[User.ROLES.practitioner],
      )
      .optional(),
    hasIrsNotice: joi.boolean().optional(),
    hasVerifiedIrsNotice: joi
      .boolean()
      .optional()
      .allow(null),
    highPriority: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] }),
    highPriorityReason: joi
      .when('highPriority', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.string().required(),
      })
      .meta({ tags: ['Restricted'] }),
    initialDocketNumberSuffix: joi
      .string()
      .allow(null)
      .optional()
      .description('Case docket number suffix before modification.'),
    initialTitle: joi
      .string()
      .allow(null)
      .optional()
      .description('Case title before modification.'),
    irsNoticeDate: joi
      .date()
      .iso()
      .max('now')
      .optional()
      .allow(null)
      .description('Last date that the petitioner is allowed to file before.'),
    irsSendDate: joi
      .date()
      .iso()
      .optional()
      .description('When the case was sent to the IRS by the court.'),
    isPaper: joi.boolean().optional(),
    leadCaseId: joi
      .string()
      .uuid({
        version: ['uuidv4'],
      })
      .optional()
      .description(
        'If this case is consolidated, this is the ID of the lead case. It is the lowest docket number in the consolidated group.',
      ),
    mailingDate: joi
      .when('isPaper', {
        is: true,
        otherwise: joi
          .string()
          .max(25)
          .allow(null)
          .optional(),
        then: joi
          .string()
          .max(25)
          .required(),
      })
      .description('Date that petition was mailed to the court.'),
    noticeOfAttachments: joi
      .boolean()
      .optional()
      .description('Reminder for clerks to review the notice of attachments.'),
    noticeOfTrialDate: joi
      .date()
      .iso()
      .optional()
      .description('Reminder for clerks to review the notice of trial date.'),
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
    partyType: joi
      .string()
      .valid(...Object.values(ContactFactory.PARTY_TYPES))
      .required()
      .description('Party type of the case petitioner.'),
    petitionPaymentDate: joi
      .when('petitionPaymentStatus', {
        is: Case.PAYMENT_STATUS.PAID,
        otherwise: joi
          .date()
          .iso()
          .optional()
          .allow(null),
        then: joi
          .date()
          .iso()
          .required(),
      })
      .description('When the petitioner payed the case fee.'),
    petitionPaymentMethod: joi
      .when('petitionPaymentStatus', {
        is: Case.PAYMENT_STATUS.PAID,
        otherwise: joi
          .string()
          .allow(null)
          .optional(),
        then: joi.string().required(),
      })
      .description('How the petitioner payed the case fee.'),
    petitionPaymentStatus: joi
      .string()
      .valid(...Object.values(Case.PAYMENT_STATUS))
      .required()
      .description('Status of the case fee payment.'),
    petitionPaymentWaivedDate: joi
      .when('petitionPaymentStatus', {
        is: Case.PAYMENT_STATUS.WAIVED,
        otherwise: joi
          .date()
          .iso()
          .allow(null)
          .optional(),
        then: joi
          .date()
          .iso()
          .required(),
      })
      .description('When the case fee was waived.'),
    practitioners: joi
      .array()
      .optional()
      .description('List of practitioners associated with the case.'),
    preferredTrialCity: joi
      .alternatives()
      .try(
        joi.string().valid(...TrialSession.TRIAL_CITY_STRINGS, null),
        joi.string().pattern(TRIAL_LOCATION_MATCHER), // Allow unique values for testing
      )
      .optional()
      .description('Where the petitioner would prefer to hold the case trial.'),
    procedureType: joi
      .string()
      .valid(...Case.PROCEDURE_TYPES)
      .required()
      .description('Procedure type of the case.'),
    qcCompleteForTrial: joi
      .object()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description(
        'QC Checklist object that must be completed before the case can go to trial.',
      ),
    receivedAt: joi
      .date()
      .iso()
      .required()
      .allow(null)
      .description('When the case was received by the court.'),
    respondents: joi
      .array()
      .optional()
      .description(
        'List of respondents (from the IRS) associated with the case.',
      ),
    sealedDate: joi
      .date()
      .iso()
      .optional()
      .allow(null)
      .description('When the case was sealed from the public.'),
    status: joi
      .string()
      .valid(...Object.values(Case.STATUS_TYPES))
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('Status of the case.'),
    trialDate: joi
      .date()
      .iso()
      .optional()
      .allow(null)
      .description('When this case goes to trial.'),
    trialLocation: joi
      .alternatives()
      .try(
        joi.string().valid(...TrialSession.TRIAL_CITY_STRINGS, null),
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
      .pattern(/^[0-9]+:([0-5][0-9])$/)
      .optional()
      .description('Time of day when this case goes to trial.'),
    userId: joi
      .string()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description(
        'The unique ID of the User who added the case to the system.',
      ),
    workItems: joi
      .array()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description('List of system messages associated with this case.'),
  }),
  function() {
    return (
      Case.isValidDocketNumber(this.docketNumber) &&
      Document.validateCollection(this.documents) &&
      DocketRecord.validateCollection(this.docketRecord) &&
      Respondent.validateCollection(this.respondents) &&
      Practitioner.validateCollection(this.practitioners)
    );
  },
  Case.VALIDATION_ERROR_MESSAGES,
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

Case.prototype.toRawObject = function() {
  const result = this.toRawObjectFromJoi();
  result.hasPendingItems = this.doesHavePendingItems();
  return result;
};

Case.prototype.doesHavePendingItems = function() {
  return this.documents.some(document => document.pending);
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

Case.prototype.attachRespondent = function(respondent) {
  this.respondents.push(respondent);
};

/**
 * updates a respondent on the case
 *
 * @param {string} respondentToUpdate the respondent user object with updated info
 * @returns {void} modifies the respondents array on the case
 */
Case.prototype.updateRespondent = function(respondentToUpdate) {
  const foundRespondent = this.respondents.find(
    respondent => respondent.userId === respondentToUpdate.userId,
  );
  if (foundRespondent) Object.assign(foundRespondent, respondentToUpdate);
};

/**
 * removes the given respondent from the case
 *
 * @param {string} respondentToRemove the respondent user object to remove from the case
 * @returns {Case} the modified case entity
 */
Case.prototype.removeRespondent = function(respondentToRemove) {
  const index = this.respondents.findIndex(
    respondent => respondent.userId === respondentToRemove.userId,
  );
  if (index > -1) this.respondents.splice(index, 1);
  return this;
};

Case.prototype.attachPractitioner = function(practitioner) {
  this.practitioners.push(practitioner);
};

/**
 * updates a practitioner on the case
 *
 * @param {string} practitionerToUpdate the practitioner user object with updated info
 */
Case.prototype.updatePractitioner = function(practitionerToUpdate) {
  const foundPractitioner = this.practitioners.find(
    practitioner => practitioner.userId === practitionerToUpdate.userId,
  );
  if (foundPractitioner) Object.assign(foundPractitioner, practitionerToUpdate);
};

/**
 * removes the given practitioner from the case
 *
 * @param {string} practitionerToRemove the practitioner user object to remove from the case
 */
Case.prototype.removePractitioner = function(practitionerToRemove) {
  const index = this.practitioners.findIndex(
    practitioner => practitioner.userId === practitionerToRemove.userId,
  );
  if (index > -1) this.practitioners.splice(index, 1);
};

/**
 *
 * @param {object} document the document to add to the case
 */
Case.prototype.addDocument = function(document, { applicationContext }) {
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
        status: document.status,
      },
      { applicationContext },
    ),
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
  this.closedDate = createISODateString();
  this.status = Case.STATUS_TYPES.closed;
  this.unsetAsBlocked();
  this.unsetAsHighPriority();
  return this;
};

/**
 *
 * @param {Date} sendDate the time stamp when the case was sent to the IRS
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
Case.prototype.updateCaseTitleDocketRecord = function({ applicationContext }) {
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
      new DocketRecord(
        {
          description: `Caption of case is amended from '${lastTitle}' to '${this.caseTitle}'`,
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
Case.prototype.updateDocketNumberRecord = function({ applicationContext }) {
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

  const hasDocketNumberChanged = lastDocketNumber !== newDocketNumber;

  if (hasDocketNumberChanged) {
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

Case.prototype.getDocumentById = function({ documentId }) {
  return this.documents.find(document => document.documentId === documentId);
};

/**
 *
 * @returns {boolean} whether to show case name for primary
 */
Case.prototype.getShowCaseNameForPrimary = function() {
  return !(this.contactSecondary && this.contactSecondary.name);
};

/**
 *
 * @param {string} preferredTrialCity the preferred trial city
 * @returns {Case} the updated case entity
 */
Case.prototype.setRequestForTrialDocketRecord = function(
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
          eventCode:
            Document.INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
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
  const foundEntry = this.docketRecord.find(
    entry => entry.documentId === updatedDocketEntry.documentId,
  );
  if (foundEntry) Object.assign(foundEntry, updatedDocketEntry);
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
  const foundDocument = this.documents.find(
    document => document.documentId === updatedDocument.documentId,
  );
  if (foundDocument) Object.assign(foundDocument, updatedDocument);
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
    DOCKET_NUMBER_MATCHER.test(docketNumber) &&
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
Case.prototype.setAsCalendared = function(trialSessionEntity) {
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
    this.status = Case.STATUS_TYPES.calendared;
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
const isAssociatedUser = function({ caseRaw, userId }) {
  const isRespondent =
    caseRaw.respondents && caseRaw.respondents.find(r => r.userId === userId);
  const isPractitioner =
    caseRaw.practitioners &&
    caseRaw.practitioners.find(p => p.userId === userId);
  return isRespondent || isPractitioner;
};

/**
 * returns true if the case status is already calendared
 *
 * @returns {boolean} if the case is calendared
 */
Case.prototype.isCalendared = function() {
  return this.status === Case.STATUS_TYPES.calendared;
};

/**
 * returns true if the case status is ready for trial
 *
 * @returns {boolean} if the case is calendared
 */
Case.prototype.isReadyForTrial = function() {
  return this.status === Case.STATUS_TYPES.generalDocketReadyForTrial;
};

/**
 * getDefaultOrderDesignatingPlaceOfTrialValue
 *
 * @returns {boolean} the value of if an order is needed for place of trial.
 */
Case.getDefaultOrderDesignatingPlaceOfTrialValue = function({
  isPaper,
  preferredTrialCity,
  rawValue,
}) {
  let orderDesignatingPlaceOfTrial;
  if (rawValue || rawValue === false) {
    orderDesignatingPlaceOfTrial = rawValue;
  } else if (isPaper && !preferredTrialCity) {
    orderDesignatingPlaceOfTrial = true;
  } else {
    orderDesignatingPlaceOfTrial = false;
  }
  return orderDesignatingPlaceOfTrial;
};

/**
 * set as blocked with a blockedReason
 *
 * @param {string} blockedReason - the reason the case was blocked
 * @returns {Case} the updated case entity
 */
Case.prototype.setAsBlocked = function(blockedReason) {
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
Case.prototype.unsetAsBlocked = function() {
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
Case.prototype.updateAutomaticBlocked = function({ caseDeadlines }) {
  const hasPendingItems = this.doesHavePendingItems();
  let automaticBlockedReason;
  if (hasPendingItems && !isEmpty(caseDeadlines)) {
    automaticBlockedReason = Case.AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate;
  } else if (hasPendingItems) {
    automaticBlockedReason = Case.AUTOMATIC_BLOCKED_REASONS.pending;
  } else if (!isEmpty(caseDeadlines)) {
    automaticBlockedReason = Case.AUTOMATIC_BLOCKED_REASONS.dueDate;
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
Case.prototype.setAsHighPriority = function(highPriorityReason) {
  this.highPriority = true;
  this.highPriorityReason = highPriorityReason;
  return this;
};

/**
 * unset as high priority and remove the highPriorityReason
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.unsetAsHighPriority = function() {
  this.highPriority = false;
  this.highPriorityReason = undefined;
  return this;
};

/**
 * remove case from trial, setting case status to generalDocketReadyForTrial
 *
 * @returns {Case} the updated case entity
 */
Case.prototype.removeFromTrial = function() {
  this.status = Case.STATUS_TYPES.generalDocketReadyForTrial;
  this.associatedJudge = Case.CHIEF_JUDGE;
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
Case.prototype.removeFromTrialWithAssociatedJudge = function(associatedJudge) {
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
Case.prototype.setAssociatedJudge = function(associatedJudge) {
  this.associatedJudge = associatedJudge;
  return this;
};

/**
 * set case status
 *
 * @param {string} caseStatus the case status to update
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseStatus = function(caseStatus) {
  this.status = caseStatus;
  if (
    [
      Case.STATUS_TYPES.generalDocket,
      Case.STATUS_TYPES.generalDocketReadyForTrial,
    ].includes(caseStatus)
  ) {
    this.associatedJudge = Case.CHIEF_JUDGE;
  } else if (caseStatus === Case.STATUS_TYPES.closed) {
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
Case.prototype.setCaseCaption = function(caseCaption) {
  this.caseCaption = caseCaption;
  this.setCaseTitle(caseCaption);
  return this;
};

/**
 * set case title
 *
 * @param {string} caseCaption the case caption to build the case title
 * @returns {Case} the updated case entity
 */
Case.prototype.setCaseTitle = function(caseCaption) {
  this.caseTitle = `${caseCaption.trim()} ${Case.CASE_CAPTION_POSTFIX}`;
  return this;
};

/**
 * get case contacts
 *
 * @param {object} shape specific contact params to be returned
 * @returns {object} object containing case contacts
 */
Case.prototype.getCaseContacts = function(shape) {
  const caseContacts = {};
  [
    'contactPrimary',
    'contactSecondary',
    'practitioners',
    'respondents',
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
Case.prototype.getConsolidationStatus = function({ caseEntity }) {
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
Case.prototype.canConsolidate = function(caseToConsolidate) {
  const ineligibleStatusTypes = [
    Case.STATUS_TYPES.new,
    Case.STATUS_TYPES.inProgress,
    Case.STATUS_TYPES.generalDocket,
    Case.STATUS_TYPES.closed,
    Case.STATUS_TYPES.onAppeal,
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
Case.prototype.setLeadCase = function(leadCaseId) {
  this.leadCaseId = leadCaseId;
  return this;
};

/**
 * removes the consolidation from the case by setting leadCaseId to undefined
 *
 * @returns {Case} the updated Case entity
 */
Case.prototype.removeConsolidation = function() {
  this.leadCaseId = undefined;
  return this;
};

/**
 * sorts the given array of cases by docket number
 *
 * @param {Array} cases the cases to check for lead case computation
 * @returns {Case} the lead Case entity
 */
Case.sortByDocketNumber = function(cases) {
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
Case.findLeadCaseForCases = function(cases) {
  const casesOrdered = Case.sortByDocketNumber([...cases]);
  return casesOrdered.shift();
};

/**
 * @param {string} documentId the id of the document to check
 * @returns {boolean} true if the document is draft, false otherwise
 */
Case.prototype.isDocumentDraft = function(documentId) {
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
Case.prototype.setNoticeOfTrialDate = function() {
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
Case.prototype.setQcCompleteForTrial = function({
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
Case.prototype.setAsSealed = function() {
  this.sealedDate = createISODateString();
  this.isSealed = true;
  return this;
};
/**
 * generates the case confirmation pdf file name
 *
 * @returns {string} this case confirmation pdf file name
 */
Case.prototype.getCaseConfirmationGeneratedPdfFileName = function() {
  return `case-${this.docketNumber}-confirmation.pdf`;
};

exports.Case = Case;
exports.isAssociatedUser = isAssociatedUser;

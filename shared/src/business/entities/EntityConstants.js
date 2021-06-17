/* eslint-disable max-lines */
const COURT_ISSUED_EVENT_CODES = require('../../tools/courtIssuedEventCodes.json');
const deepFreeze = require('deep-freeze');
const DOCUMENT_EXTERNAL_CATEGORIES_MAP = require('../../tools/externalFilingEvents.json');
const DOCUMENT_INTERNAL_CATEGORIES_MAP = require('../../tools/internalFilingEvents.json');
const { flatten, sortBy, union, without } = require('lodash');
const { formatNow } = require('../utilities/DateHandler');

// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
// a number (100 to 99999) followed by a - and a 2 digit year
const DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

const CURRENT_YEAR = +formatNow('YYYY');

const DEFAULT_PRACTITIONER_BIRTH_YEAR = 1950;

// city, state, optional unique ID (generated automatically in testing files)
const TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

const SERVED_PARTIES_CODES = { BOTH: 'B', PETITIONER: 'P', RESPONDENT: 'R' };

const ORDER_JUDGE_FIELD = 'signedJudgeName';

const TRIAL_SESSION_PROCEEDING_TYPES = {
  inPerson: 'In Person',
  remote: 'Remote',
};

const PARTY_VIEW_TABS = {
  participantsAndCounsel: 'Intervenor/Participant(s)',
  petitionersAndCounsel: 'Petitioner(s) & Counsel',
  respondentCounsel: 'Respondent Counsel',
};

const DEFAULT_PROCEEDING_TYPE = TRIAL_SESSION_PROCEEDING_TYPES.inPerson;

const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

const DOCUMENT_PROCESSING_STATUS_OPTIONS = {
  COMPLETE: 'complete',
  PENDING: 'pending',
};

const NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP = [
  { documentType: 'Notice of Change of Address', eventCode: 'NCA' },
  {
    documentType: 'Notice of Change of Address and Telephone Number',
    eventCode: 'NCAP',
  },
  { documentType: 'Notice of Change of Telephone Number', eventCode: 'NCP' },
];
const NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES =
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.map(n => n.eventCode);

const CHIEF_JUDGE = 'Chief Judge';

const DOCKET_NUMBER_SUFFIXES = {
  DECLARATORY_JUDGEMENTS_FOR_EXEMPT_ORGS: 'X',
  DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION: 'R',
  DISCLOSURE: 'D',
  LIEN_LEVY: 'L',
  PASSPORT: 'P',
  SMALL: 'S',
  SMALL_LIEN_LEVY: 'SL',
  WHISTLEBLOWER: 'W',
};

const CASE_STATUS_TYPES = {
  assignedCase: 'Assigned - Case', // Case has been assigned to a judge
  assignedMotion: 'Assigned - Motion', // Someone has requested a judge for the case
  calendared: 'Calendared', // Case has been scheduled for trial
  cav: 'CAV', // Core alternative valuation
  closed: 'Closed', // Judge has made a ruling to close the case
  generalDocket: 'General Docket - Not at Issue', // Submitted to the IRS
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)', // Case is ready for trial
  jurisdictionRetained: 'Jurisdiction Retained', // Jurisdiction of a case is retained by a specific judge — usually after the case is on a judge’s trial calendar
  new: 'New', // Case has not been QCed
  onAppeal: 'On Appeal', // After the trial, the case has gone to the appeals court
  rule155: 'Rule 155', // Where the Court has filed or stated its opinion or issued a dispositive order determining the issues in a case, it may withhold entry of its decision for the purpose of permitting the parties to submit computations pursuant to the Court’s determination of the issues, showing the correct amount to be included in the decision.
  submitted: 'Submitted', // Submitted to the judge for decision
};

const DOCUMENT_RELATIONSHIPS = {
  PRIMARY: 'primaryDocument',
  PRIMARY_SUPPORTING: 'primarySupportingDocument',
  SECONDARY: 'secondaryDocument',
  SECONDARY_SUPPORTING: 'secondarySupportingDocument',
  SUPPORTING: 'supportingDocument',
};

const DOCUMENT_SEARCH_SORT = {
  FILING_DATE_ASC: 'FILING_DATE_ASC',
  FILING_DATE_DESC: 'FILING_DATE_DESC',
  NUMBER_OF_PAGES_ASC: 'NUMBER_OF_PAGES_ASC',
  NUMBER_OF_PAGES_DESC: 'NUMBER_OF_PAGES_DESC',
};

const TODAYS_ORDERS_SORTS = {
  ...DOCUMENT_SEARCH_SORT,
};

const TODAYS_ORDERS_SORT_DEFAULT = TODAYS_ORDERS_SORTS.FILING_DATE_DESC;

// This docket entry type isn't defined anywhere else
const STIN_DOCKET_ENTRY_TYPE = {
  documentType: 'Statement of Taxpayer Identification',
  eventCode: 'STIN',
};

const pickEventCode = d => d.eventCode;

const UNSERVABLE_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isUnservable,
).map(pickEventCode);

const ORDER_TYPES = [
  {
    documentType: 'Order',
    eventCode: 'O',
  },
  {
    documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
    documentType: 'Order of Dismissal for Lack of Jurisdiction',
    eventCode: 'ODJ',
  },
  {
    documentTitle: 'Order of Dismissal',
    documentType: 'Order of Dismissal',
    eventCode: 'OD',
  },
  {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
  },
  {
    documentTitle: 'Order to Show Cause',
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  {
    documentTitle: 'Order and Decision',
    documentType: 'Order and Decision',
    eventCode: 'OAD',
  },
  {
    documentTitle: 'Decision',
    documentType: 'Decision',
    eventCode: 'DEC',
  },
  {
    documentType: 'Notice',
    eventCode: 'NOT',
  },
];

const BENCH_OPINION_EVENT_CODE = 'OST';

const ORDER_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isOrder && d.eventCode !== BENCH_OPINION_EVENT_CODE,
).map(pickEventCode);

const DOCUMENT_NOTICE_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isNotice,
).map(pickEventCode);

const OPINION_DOCUMENT_TYPES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isOpinion,
);
const OPINION_EVENT_CODES_WITH_BENCH_OPINION = [
  ...OPINION_DOCUMENT_TYPES.map(pickEventCode),
  BENCH_OPINION_EVENT_CODE,
];

const DOCUMENT_EXTERNAL_CATEGORIES = Object.keys(
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
);
const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
);
const COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET =
  COURT_ISSUED_EVENT_CODES.filter(d => d.requiresCoversheet).map(pickEventCode);
const EVENT_CODES_REQUIRING_SIGNATURE = COURT_ISSUED_EVENT_CODES.filter(
  d => d.requiresSignature,
).map(pickEventCode);

// _without returns a new array with values from arg1 sans values subsequent args
const EVENT_CODES_REQUIRING_JUDGE_SIGNATURE = without(
  EVENT_CODES_REQUIRING_SIGNATURE,
  'NTD',
  'NOT',
);

const EXTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
).map(t => t.documentType);

const INTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
).map(t => t.documentType);

const COURT_ISSUED_DOCUMENT_TYPES = COURT_ISSUED_EVENT_CODES.map(
  t => t.documentType,
);

const AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
)
  .filter(d => d.isAutogenerated)
  .map(d => d.documentType);

const AUTOGENERATED_INTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
)
  .filter(d => d.isAutogenerated)
  .map(d => d.documentType);

const EXTERNAL_DOCUMENTS_ARRAY = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
);

const INTERNAL_DOCUMENTS_ARRAY = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
);

const SCENARIOS = [
  'Standard',
  'Nonstandard A',
  'Nonstandard B',
  'Nonstandard C',
  'Nonstandard D',
  'Nonstandard E',
  'Nonstandard F',
  'Nonstandard G',
  'Nonstandard H',
  'Nonstandard I',
  'Nonstandard J',
  'Type A',
  'Type B',
  'Type C',
  'Type D',
  'Type E',
  'Type F',
  'Type G',
  'Type H',
];

const TRANSCRIPT_EVENT_CODE = 'TRAN';
const CORRECTED_TRANSCRIPT_EVENT_CODE = 'CTRA';
const REVISED_TRANSCRIPT_EVENT_CODE = 'RTRA';

const LODGED_EVENT_CODE = 'MISCL';

/* eslint-disable sort-keys-fix/sort-keys-fix */
const OBJECTIONS_OPTIONS_MAP = {
  YES: 'Yes',
  NO: 'No',
  UNKNOWN: 'Unknown',
};
const OBJECTIONS_OPTIONS = [...Object.values(OBJECTIONS_OPTIONS_MAP)];

const CONTACT_CHANGE_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
)
  .filter(d => d.isContactChange)
  .map(d => d.documentType);

const TRACKED_DOCUMENT_TYPES = {
  application: {
    category: 'Application',
  },
  motion: {
    category: 'Motion',
  },
  orderToShowCause: {
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
  },
  proposedStipulatedDecision: {
    documentType: 'Proposed Stipulated Decision',
    eventCode: 'PSDE',
  },
};

const EXTERNAL_TRACKED_DOCUMENT_EVENT_CODES = EXTERNAL_DOCUMENTS_ARRAY.filter(
  doc =>
    doc.category === TRACKED_DOCUMENT_TYPES.application.category ||
    doc.category === TRACKED_DOCUMENT_TYPES.motion.category,
).map(x => x.eventCode);
const INTERNAL_TRACKED_DOCUMENT_EVENT_CODES = INTERNAL_DOCUMENTS_ARRAY.filter(
  doc =>
    doc.category === TRACKED_DOCUMENT_TYPES.application.category ||
    doc.category === TRACKED_DOCUMENT_TYPES.motion.category,
).map(x => x.eventCode);

const TRACKED_DOCUMENT_TYPES_EVENT_CODES = union(
  EXTERNAL_TRACKED_DOCUMENT_EVENT_CODES,
  INTERNAL_TRACKED_DOCUMENT_EVENT_CODES,
  [
    TRACKED_DOCUMENT_TYPES.proposedStipulatedDecision.eventCode,
    TRACKED_DOCUMENT_TYPES.orderToShowCause.eventCode,
  ],
);

// TODO: should come from internal or external filing event
const INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentTitle: 'Application for Waiver of Filing Fee',
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
  },
  ownershipDisclosure: {
    documentTitle: 'Ownership Disclosure Statement',
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'DISC',
  },
  petition: {
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: STIN_DOCKET_ENTRY_TYPE,
};

const INITIAL_DOCUMENT_TYPES_FILE_MAP = {
  applicationForWaiverOfFilingFee: 'applicationForWaiverOfFilingFeeFile',
  ownershipDisclosure: 'ownershipDisclosureFile',
  petition: 'petitionFile',
  requestForPlaceOfTrial: 'requestForPlaceOfTrialFile',
  stin: 'stinFile',
};

const INITIAL_DOCUMENT_TYPES_MAP = {
  applicationForWaiverOfFilingFeeFile:
    INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
  ownershipDisclosureFile:
    INITIAL_DOCUMENT_TYPES.ownershipDisclosure.documentType,
  petitionFile: INITIAL_DOCUMENT_TYPES.petition.documentType,
  requestForPlaceOfTrialFile:
    INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
  stinFile: INITIAL_DOCUMENT_TYPES.stin.documentType,
};

const MINUTE_ENTRIES_MAP = {
  captionOfCaseIsAmended: {
    description:
      'Caption of case is amended from [lastCaption] [CASE_CAPTION_POSTFIX] to [caseCaption] [CASE_CAPTION_POSTFIX]',
    eventCode: 'MINC',
    documentType: 'Caption of case is amended',
  },
  dockedNumberIsAmended: {
    description:
      'Docket Number is amended from [lastDocketNumber] to [newDocketNumber]',
    eventCode: 'MIND',
    documentType: 'Docket Number is amended',
  },
  filingFeePaid: {
    description: 'Filing Fee Paid',
    documentType: 'Filing Fee Paid',
    eventCode: 'FEE',
  },
  filingFeeWaived: {
    description: 'Filing Fee Waived',
    documentType: 'Filing Fee Waived',
    eventCode: 'FEEW',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
};

const SPTO_DOCUMENT = COURT_ISSUED_EVENT_CODES.find(
  doc => doc.eventCode === 'SPTO',
);
const SPOS_DOCUMENT = COURT_ISSUED_EVENT_CODES.find(
  doc => doc.eventCode === 'SPOS',
);

const EVENT_CODES_VISIBLE_TO_PUBLIC = [
  ...COURT_ISSUED_EVENT_CODES.filter(d => d.isOrder || d.isOpinion).map(
    d => d.eventCode,
  ),
  'DEC',
  'ODL',
  'SPTN',
];

const SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: {
    documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
    documentType: 'Notice of Docket Change',
    eventCode: 'NODC',
  },
  noticeOfTrial: {
    documentTitle: 'Notice of Trial on [Date] at [Time]',
    documentType: 'Notice of Trial',
    eventCode: 'NTD',
  },
  standingPretrialOrderForSmallCase: {
    documentTitle: SPOS_DOCUMENT.documentTitle,
    documentType: SPOS_DOCUMENT.documentType,
    eventCode: SPOS_DOCUMENT.eventCode,
  },
  standingPretrialOrder: {
    documentTitle: SPTO_DOCUMENT.documentTitle,
    documentType: SPTO_DOCUMENT.documentType,
    eventCode: SPTO_DOCUMENT.eventCode,
  },
};

const PROPOSED_STIPULATED_DECISION_EVENT_CODE = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
).find(d => d.documentType === 'Proposed Stipulated Decision').eventCode;
const STIPULATED_DECISION_EVENT_CODE = COURT_ISSUED_EVENT_CODES.find(
  d => d.documentType === 'Stipulated Decision',
).eventCode;

const SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP = [
  {
    documentType: 'Entry of Appearance',
    documentTitle: 'Entry of Appearance',
    eventCode: 'EA',
  },
  {
    documentType: 'Limited Entry of Appearance',
    documentTitle: 'Limited Entry of Appearance',
    eventCode: 'LEA',
  },
  {
    documentType: 'Substitution of Counsel',
    documentTitle: 'Substitution of Counsel',
    eventCode: 'SOC',
  },
  {
    documentType: 'Notice of Intervention',
    documentTitle: 'Notice of Intervention',
    eventCode: 'NOI',
  },
  {
    documentType: 'Notice of Election to Participate',
    documentTitle: 'Notice of Election to Participate',
    eventCode: 'NOEP',
  },
  {
    documentType: 'Notice of Election to Intervene',
    documentTitle: 'Notice of Election to Intervene',
    eventCode: 'NOEI',
  },
];
const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES =
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.map(d => d.documentType);

const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not paid',
  WAIVED: 'Waived',
};

const PROCEDURE_TYPES = ['Regular', 'Small']; // This is the order that they appear in the UI

const STATUS_TYPES_WITH_ASSOCIATED_JUDGE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const STATUS_TYPES_MANUAL_UPDATE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.generalDocket,
  CASE_STATUS_TYPES.generalDocketReadyForTrial,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.onAppeal,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
];

const ANSWER_DOCUMENT_CODES = [
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

const CASE_CAPTION_POSTFIX = 'v. Commissioner of Internal Revenue, Respondent';

const AUTOMATIC_BLOCKED_REASONS = {
  dueDate: 'Due Date',
  pending: 'Pending Item',
  pendingAndDueDate: 'Pending Item and Due Date',
};

const CASE_TYPES_MAP = {
  cdp: 'CDP (Lien/Levy)',
  deficiency: 'Deficiency',
  djExemptOrg: 'Declaratory Judgment (Exempt Organization)',
  djRetirementPlan: 'Declaratory Judgment (Retirement Plan)',
  disclosure: 'Disclosure',
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

const CASE_TYPES = Object.values(CASE_TYPES_MAP);

const CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE = {
  [CASE_TYPES_MAP.deficiency]: 'Notice of Deficiency',
  [CASE_TYPES_MAP.cdp]: 'Notice of Determination Concerning Collection Action',
  [CASE_TYPES_MAP.innocentSpouse]:
    'Notice of Determination Concerning Relief From Joint and Several Liability Under Section 6015',
  Disclosure1: 'Notice of Intention to Disclose',
  Disclosure2:
    'Notice - We Are Going To Make Your Determination Letter Available for Public Inspection',
  [CASE_TYPES_MAP.partnershipSection6226]:
    'Readjustment of Partnership Items Code Section 6226',
  [CASE_TYPES_MAP.partnershipSection6228]:
    'Adjustment of Partnership Items Code Section 6228',
  [CASE_TYPES_MAP.partnershipSection1101]:
    'Partnership Action Under BBA Section 1101',
  [CASE_TYPES_MAP.whistleblower]:
    'Notice of Determination Under Section 7623 Concerning Whistleblower Action',
  [CASE_TYPES_MAP.workerClassification]:
    'Notice of Determination of Worker Classification',
  [CASE_TYPES_MAP.passport]:
    'Notice of Certification of Your Seriously Delinquent Federal Tax Debt to the Department of State',
  [CASE_TYPES_MAP.interestAbatement]:
    'Notice of Final Determination for Full or Partial Disallowance of Interest Abatement Claim',
  [CASE_TYPES_MAP.other]: 'Other',
};

const CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE = {
  [CASE_TYPES_MAP.cdp]: 'CDP (Lien/Levy)',
  [CASE_TYPES_MAP.innocentSpouse]: 'Innocent Spouse',
  [CASE_TYPES_MAP.whistleblower]: 'Whistleblower',
  [CASE_TYPES_MAP.workerClassification]: 'Worker Classification',
  [CASE_TYPES_MAP.djRetirementPlan]: 'Declaratory Judgment (Retirement Plan)',
  [CASE_TYPES_MAP.djExemptOrg]: 'Declaratory Judgment (Exempt Organization)',
  [CASE_TYPES_MAP.disclosure]: 'Disclosure',
  [CASE_TYPES_MAP.interestAbatement]:
    'Interest Abatement - Failure of IRS to Make Final Determination Within 180 Days After Claim for Abatement',
  [CASE_TYPES_MAP.other]: 'Other',
};

const ROLES = {
  adc: 'adc',
  admin: 'admin',
  admissionsClerk: 'admissionsclerk',
  chambers: 'chambers',
  clerkOfCourt: 'clerkofcourt',
  docketClerk: 'docketclerk',
  floater: 'floater',
  general: 'general',
  inactivePractitioner: 'inactivePractitioner',
  irsPractitioner: 'irsPractitioner',
  irsSuperuser: 'irsSuperuser',
  judge: 'judge',
  legacyJudge: 'legacyJudge',
  petitioner: 'petitioner',
  petitionsClerk: 'petitionsclerk',
  privatePractitioner: 'privatePractitioner',
  reportersOffice: 'reportersOffice',
  trialClerk: 'trialclerk',
};

const FILING_TYPES = {
  [ROLES.petitioner]: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  [ROLES.privatePractitioner]: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

const ANSWER_CUTOFF_AMOUNT_IN_DAYS = 45;

const ANSWER_CUTOFF_UNIT = 'day';

const COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
};

const US_STATES = {
  AK: 'Alaska',
  AL: 'Alabama',
  AR: 'Arkansas',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

const US_STATES_OTHER = [
  'AA',
  'AE',
  'AP',
  'AS',
  'FM',
  'GU',
  'MH',
  'MP',
  'PR',
  'PW',
  'VI',
];

const STATE_NOT_AVAILABLE = 'N/A';

const PARTY_TYPES = {
  conservator: 'Conservator',
  corporation: 'Corporation',
  custodian: 'Custodian',
  donor: 'Donor',
  estate: 'Estate with an executor/personal representative/fiduciary/etc.',
  estateWithoutExecutor:
    'Estate without an executor/personal representative/fiduciary/etc.',
  guardian: 'Guardian',
  nextFriendForIncompetentPerson:
    'Next friend for a legally incompetent person (without a guardian, conservator, or other like fiduciary)',
  nextFriendForMinor:
    'Next friend for a minor (without a guardian, conservator, or other like fiduciary)',
  partnershipAsTaxMattersPartner: 'Partnership (as the Tax Matters Partner)',
  partnershipBBA:
    'Partnership (as a partnership representative under the BBA regime)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than Tax Matters Partner)',
  petitioner: 'Petitioner',
  petitionerDeceasedSpouse: 'Petitioner & deceased spouse',
  petitionerSpouse: 'Petitioner & spouse',
  survivingSpouse: 'Surviving spouse',
  transferee: 'Transferee',
  trust: 'Trust',
};

const BUSINESS_TYPES = {
  corporation: PARTY_TYPES.corporation,
  partnershipAsTaxMattersPartner: PARTY_TYPES.partnershipAsTaxMattersPartner,
  partnershipBBA: PARTY_TYPES.partnershipBBA,
  partnershipOtherThanTaxMatters: PARTY_TYPES.partnershipOtherThanTaxMatters,
};

const ESTATE_TYPES = {
  estate: PARTY_TYPES.estate,
  estateWithoutExecutor: PARTY_TYPES.estateWithoutExecutor,
  trust: PARTY_TYPES.trust,
};

const OTHER_TYPES = {
  conservator: PARTY_TYPES.conservator,
  custodian: PARTY_TYPES.custodian,
  guardian: PARTY_TYPES.guardian,
  nextFriendForIncompetentPerson: PARTY_TYPES.nextFriendForIncompetentPerson,
  nextFriendForMinor: PARTY_TYPES.nextFriendForMinor,
};

const CONTACT_TYPES = {
  intervenor: 'intervenor',
  otherFiler: 'otherFilers', // TODO 8135: This can be deleted once 0033 migration script has run on all ENVs
  otherPetitioner: 'otherPetitioner',
  otherPetitioners: 'otherPetitioners', // TODO 8135: This can be deleted once 0033 migration script has run on all ENVs
  participant: 'participant',
  petitioner: 'petitioner',
  primary: 'primary',
  secondary: 'secondary',
};

const CONTACT_TYPE_TITLES = {
  intervenor: 'Intervenor',
  petitioner: 'Petitioner',
  otherFilers: 'Petitioner',
  otherPetitioner: 'Petitioner',
  participant: 'Participant',
  primary: 'Petitioner',
  secondary: 'Petitioner',
};

const PETITIONER_CONTACT_TYPES = [
  CONTACT_TYPES.primary,
  CONTACT_TYPES.secondary,
  CONTACT_TYPES.otherPetitioner,
];

const COMMON_CITIES = [
  { city: 'Birmingham', state: 'Alabama' },
  { city: 'Mobile', state: 'Alabama' },
  { city: 'Anchorage', state: 'Alaska' },
  { city: 'Phoenix', state: 'Arizona' },
  { city: 'Little Rock', state: 'Arkansas' },
  { city: 'Los Angeles', state: 'California' },
  { city: 'San Diego', state: 'California' },
  { city: 'San Francisco', state: 'California' },
  { city: 'Denver', state: 'Colorado' },
  { city: 'Hartford', state: 'Connecticut' },
  { city: 'Washington', state: 'District of Columbia' },
  { city: 'Jacksonville', state: 'Florida' },
  { city: 'Miami', state: 'Florida' },
  { city: 'Tampa', state: 'Florida' },
  { city: 'Atlanta', state: 'Georgia' },
  { city: 'Honolulu', state: 'Hawaii' },
  { city: 'Boise', state: 'Idaho' },
  { city: 'Chicago', state: 'Illinois' },
  { city: 'Indianapolis', state: 'Indiana' },
  { city: 'Des Moines', state: 'Iowa' },
  { city: 'Louisville', state: 'Kentucky' },
  { city: 'New Orleans', state: 'Louisiana' },
  { city: 'Baltimore', state: 'Maryland' },
  { city: 'Boston', state: 'Massachusetts' },
  { city: 'Detroit', state: 'Michigan' },
  { city: 'St. Paul', state: 'Minnesota' },
  { city: 'Jackson', state: 'Mississippi' },
  { city: 'Kansas City', state: 'Missouri' },
  { city: 'St. Louis', state: 'Missouri' },
  { city: 'Helena', state: 'Montana' },
  { city: 'Omaha', state: 'Nebraska' },
  { city: 'Las Vegas', state: 'Nevada' },
  { city: 'Reno', state: 'Nevada' },
  { city: 'Albuquerque', state: 'New Mexico' },
  { city: 'Buffalo', state: 'New York' },
  { city: 'New York City', state: 'New York' },
  { city: 'Winston-Salem', state: 'North Carolina' },
  { city: 'Cincinnati', state: 'Ohio' },
  { city: 'Cleveland', state: 'Ohio' },
  { city: 'Columbus', state: 'Ohio' },
  { city: 'Oklahoma City', state: 'Oklahoma' },
  { city: 'Portland', state: 'Oregon' },
  { city: 'Philadelphia', state: 'Pennsylvania' },
  { city: 'Pittsburgh', state: 'Pennsylvania' },
  { city: 'Columbia', state: 'South Carolina' },
  { city: 'Knoxville', state: 'Tennessee' },
  { city: 'Memphis', state: 'Tennessee' },
  { city: 'Nashville', state: 'Tennessee' },
  { city: 'Dallas', state: 'Texas' },
  { city: 'El Paso', state: 'Texas' },
  { city: 'Houston', state: 'Texas' },
  { city: 'Lubbock', state: 'Texas' },
  { city: 'San Antonio', state: 'Texas' },
  { city: 'Salt Lake City', state: 'Utah' },
  { city: 'Richmond', state: 'Virginia' },
  { city: 'Seattle', state: 'Washington' },
  { city: 'Spokane', state: 'Washington' },
  { city: 'Charleston', state: 'West Virginia' },
  { city: 'Milwaukee', state: 'Wisconsin' },
];

const SMALL_CITIES = [
  { city: 'Fresno', state: 'California' },
  { city: 'Tallahassee', state: 'Florida' },
  { city: 'Pocatello', state: 'Idaho' },
  { city: 'Peoria', state: 'Illinois' },
  { city: 'Wichita', state: 'Kansas' },
  { city: 'Shreveport', state: 'Louisiana' },
  { city: 'Portland', state: 'Maine' },
  { city: 'Billings', state: 'Montana' },
  { city: 'Albany', state: 'New York' },
  { city: 'Syracuse', state: 'New York' },
  { city: 'Bismarck', state: 'North Dakota' },
  { city: 'Aberdeen', state: 'South Dakota' },
  { city: 'Burlington', state: 'Vermont' },
  { city: 'Roanoke', state: 'Virginia' },
  { city: 'Cheyenne', state: 'Wyoming' },
  ...COMMON_CITIES,
];

const TRIAL_CITIES = {
  ALL: SMALL_CITIES,
  REGULAR: COMMON_CITIES,
  SMALL: SMALL_CITIES,
};

const LEGACY_TRIAL_CITIES = [
  { city: 'Biloxi', state: 'Mississippi' },
  { city: 'Huntington', state: 'West Virginia' },
  { city: 'Maui', state: 'Hawaii' },
  { city: 'Missoula', state: 'Montana' },
  { city: 'Newark', state: 'New Jersey' },
  { city: 'Pasadena', state: 'California' },
  { city: 'Tulsa', state: 'Oklahoma' },
  { city: 'Westbury', state: 'New York' },
];

const TRIAL_CITY_STRINGS = SMALL_CITIES.map(
  trialLocation => `${trialLocation.city}, ${trialLocation.state}`,
);

const LEGACY_TRIAL_CITY_STRINGS = LEGACY_TRIAL_CITIES.map(
  trialLocation => `${trialLocation.city}, ${trialLocation.state}`,
);

const SESSION_TERMS = ['Winter', 'Fall', 'Spring', 'Summer'];

const SESSION_TYPES = {
  regular: 'Regular',
  small: 'Small',
  hybrid: 'Hybrid',
  special: 'Special',
  motionHearing: 'Motion/Hearing',
};

const SESSION_STATUS_GROUPS = {
  all: 'All',
  closed: 'Closed',
  new: 'New',
  open: 'Open',
};

const MAX_FILE_SIZE_MB = 250; // megabytes
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // bytes -> megabytes

const ADC_SECTION = 'adc';
const ADMISSIONS_SECTION = 'admissions';
const CHAMBERS_SECTION = 'chambers';
const CLERK_OF_COURT_SECTION = 'clerkofcourt';
const DOCKET_SECTION = 'docket';
const FLOATER_SECTION = 'floater';
const IRS_SYSTEM_SECTION = 'irsSystem';
const PETITIONS_SECTION = 'petitions';
const REPORTERS_OFFICE_SECTION = 'reportersOffice';
const TRIAL_CLERKS_SECTION = 'trialClerks';

const SECTIONS = sortBy([
  ADC_SECTION,
  ADMISSIONS_SECTION,
  CHAMBERS_SECTION,
  CLERK_OF_COURT_SECTION,
  DOCKET_SECTION,
  FLOATER_SECTION,
  PETITIONS_SECTION,
  REPORTERS_OFFICE_SECTION,
  TRIAL_CLERKS_SECTION,
]);

const TRIAL_STATUS_TYPES = [
  'Set for Trial',
  'Dismissed',
  'Continued',
  'Rule 122',
  'A Basis Reached',
  'Settled',
  'Recall',
  'Taken Under Advisement',
];

const SCAN_MODES = {
  DUPLEX: 'duplex',
  FEEDER: 'feeder',
  FLATBED: 'flatbed',
};

const SCAN_MODE_LABELS = {
  DUPLEX: 'Double sided',
  FEEDER: 'Single sided',
  FLATBED: 'Flatbed',
};

const EMPLOYER_OPTIONS = ['IRS', 'DOJ', 'Private'];

const PRACTITIONER_TYPE_OPTIONS = ['Attorney', 'Non-Attorney'];

const ADMISSIONS_STATUS_OPTIONS = [
  'Active',
  'Suspended',
  'Disbarred',
  'Resigned',
  'Deceased',
  'Inactive',
];

const DEFAULT_PROCEDURE_TYPE = PROCEDURE_TYPES[0];

const CASE_SEARCH_MIN_YEAR = 1986;
const CASE_SEARCH_PAGE_SIZE = 25; // number of results returned for each page when searching for a case
const CASE_INVENTORY_PAGE_SIZE = 25; // number of results returned for each page in the case inventory report
const CASE_LIST_PAGE_SIZE = 20; // number of results returned for each page for the external user dashboard case list
const DEADLINE_REPORT_PAGE_SIZE = 100; // number of results returned for each page for the case deadline report
const TODAYS_ORDERS_PAGE_SIZE = 100; // number of results returned for each page for the today's orders page

// TODO: event codes need to be reorganized
const ALL_EVENT_CODES = flatten([
  ...Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
  ...Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
  ...Object.values(INITIAL_DOCUMENT_TYPES),
  ...Object.values(MINUTE_ENTRIES_MAP),
  ...Object.values(SYSTEM_GENERATED_DOCUMENT_TYPES),
])
  .map(item => item.eventCode)
  .concat(COURT_ISSUED_EVENT_CODES.map(item => item.eventCode))
  .sort();

const ALL_DOCUMENT_TYPES_MAP = (() => {
  const allFilingEvents = flatten([
    ...Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
    ...Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
  ]);
  const filingEventTypes = allFilingEvents;
  const orderDocTypes = ORDER_TYPES;
  const initialTypes = Object.values(INITIAL_DOCUMENT_TYPES);
  const signedTypes = Object.values(SIGNED_DOCUMENT_TYPES);
  const systemGeneratedTypes = Object.values(SYSTEM_GENERATED_DOCUMENT_TYPES);
  const minuteEntryTypes = Object.values(MINUTE_ENTRIES_MAP);

  const documentTypes = [
    ...initialTypes,
    ...PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
    ...filingEventTypes,
    ...orderDocTypes,
    ...COURT_ISSUED_EVENT_CODES,
    ...signedTypes,
    ...systemGeneratedTypes,
    ...minuteEntryTypes,
  ];
  return documentTypes;
})();

const ALL_DOCUMENT_TYPES = (() => {
  return ALL_DOCUMENT_TYPES_MAP.map(d => d.documentType)
    .filter(d => d)
    .sort();
})();

const UNIQUE_OTHER_FILER_TYPE = 'Intervenor';
const OTHER_FILER_TYPES = [
  UNIQUE_OTHER_FILER_TYPE,
  'Tax Matters Partner',
  'Partner Other Than Tax Matters Partner',
];

const CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT = 5;

const TRIAL_SESSION_ELIGIBLE_CASES_BUFFER = 50;

const ADVANCED_SEARCH_TABS = {
  CASE: 'case',
  OPINION: 'opinion',
  ORDER: 'order',
  PRACTITIONER: 'practitioner',
};

module.exports = deepFreeze({
  ADC_SECTION,
  ADMISSIONS_SECTION,
  ADMISSIONS_STATUS_OPTIONS,
  ADVANCED_SEARCH_TABS,
  ALL_DOCUMENT_TYPES,
  ALL_DOCUMENT_TYPES_MAP,
  ALL_EVENT_CODES,
  ANSWER_CUTOFF_AMOUNT_IN_DAYS,
  ANSWER_CUTOFF_UNIT,
  ANSWER_DOCUMENT_CODES,
  AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES,
  AUTOGENERATED_INTERNAL_DOCUMENT_TYPES,
  AUTOMATIC_BLOCKED_REASONS,
  BENCH_OPINION_EVENT_CODE,
  BUSINESS_TYPES,
  CASE_CAPTION_POSTFIX,
  CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT,
  CASE_SEARCH_MIN_YEAR,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
  CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE,
  CASE_INVENTORY_PAGE_SIZE,
  CASE_SEARCH_PAGE_SIZE,
  CASE_LIST_PAGE_SIZE,
  CASE_STATUS_TYPES,
  CASE_TYPES,
  CASE_TYPES_MAP,
  CHAMBERS_SECTION,
  CHIEF_JUDGE,
  CLERK_OF_COURT_SECTION,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  CONTACT_TYPES,
  CONTACT_TYPE_TITLES,
  PETITIONER_CONTACT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES,
  COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET,
  CURRENT_YEAR,
  DEADLINE_REPORT_PAGE_SIZE,
  DEFAULT_PRACTITIONER_BIRTH_YEAR,
  DEFAULT_PROCEDURE_TYPE,
  DEFAULT_PROCEEDING_TYPE,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  DOCKET_SECTION,
  EXTERNAL_DOCUMENTS_ARRAY,
  DOCUMENT_EXTERNAL_CATEGORIES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  DOCUMENT_INTERNAL_CATEGORIES,
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  DOCUMENT_SEARCH_SORT,
  EMPLOYER_OPTIONS,
  ESTATE_TYPES,
  EVENT_CODES_VISIBLE_TO_PUBLIC,
  EVENT_CODES_REQUIRING_JUDGE_SIGNATURE,
  EVENT_CODES_REQUIRING_SIGNATURE,
  EXTERNAL_DOCUMENT_TYPES,
  FILING_TYPES,
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_FILE_MAP,
  INTERNAL_DOCUMENTS_ARRAY,
  INITIAL_DOCUMENT_TYPES_MAP,
  INTERNAL_DOCUMENT_TYPES,
  IRS_SYSTEM_SECTION,
  LODGED_EVENT_CODE,
  MAX_ELASTICSEARCH_PAGINATION: 10000,
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  MAX_SEARCH_CLIENT_RESULTS: 200,
  MAX_SEARCH_RESULTS: 100, // a fraction of MAX_SEARCH_CLIENT_RESULTS
  MINUTE_ENTRIES_MAP,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES,
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP,
  OBJECTIONS_OPTIONS,
  OBJECTIONS_OPTIONS_MAP,
  OPINION_DOCUMENT_TYPES,
  OPINION_EVENT_CODES_WITH_BENCH_OPINION,
  ORDER_EVENT_CODES,
  ORDER_TYPES,
  OTHER_FILER_TYPES,
  OTHER_TYPES,
  ORDER_JUDGE_FIELD,
  PARTY_TYPES,
  PARTY_VIEW_TABS,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  PRACTITIONER_TYPE_OPTIONS,
  PROCEDURE_TYPES,
  PROPOSED_STIPULATED_DECISION_EVENT_CODE,
  ROLES,
  SCAN_MODE_LABELS,
  SCAN_MODES,
  SCENARIOS,
  SECTIONS,
  SERVED_PARTIES_CODES,
  SERVICE_INDICATOR_TYPES,
  SESSION_STATUS_GROUPS,
  SESSION_TERMS,
  SESSION_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STATE_NOT_AVAILABLE,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  STIPULATED_DECISION_EVENT_CODE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TODAYS_ORDERS_PAGE_SIZE,
  TODAYS_ORDERS_SORT_DEFAULT,
  TODAYS_ORDERS_SORTS,
  TRACKED_DOCUMENT_TYPES_EVENT_CODES,
  TRANSCRIPT_EVENT_CODE,
  CORRECTED_TRANSCRIPT_EVENT_CODE,
  REVISED_TRANSCRIPT_EVENT_CODE,
  TRIAL_CITIES,
  TRIAL_CITY_STRINGS,
  TRIAL_SESSION_PROCEEDING_TYPES,
  TRIAL_CLERKS_SECTION,
  TRIAL_LOCATION_MATCHER,
  TRIAL_SESSION_ELIGIBLE_CASES_BUFFER,
  TRIAL_STATUS_TYPES,
  UNIQUE_OTHER_FILER_TYPE,
  UNSERVABLE_EVENT_CODES,
  LEGACY_TRIAL_CITY_STRINGS,
  US_STATES,
  US_STATES_OTHER,
});

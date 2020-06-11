const courtIssuedEventCodes = require('../../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../../tools/externalFilingEvents.json');
const documentMapInternal = require('../../tools/internalFilingEvents.json');

const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

const DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

const TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

const CHIEF_JUDGE = 'Chief Judge';

const DOCKET_NUMBER_SUFFIXES = ['W', 'P', 'X', 'R', 'SL', 'L', 'S'];

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

const DOCUMENT_RELATIONSHIPS = [
  'primaryDocument',
  'primarySupportingDocument',
  'secondaryDocument',
  'secondarySupportingDocument',
  'supportingDocument',
];

const ORDER_DOCUMENT_TYPES = [
  'O',
  'OAJ',
  'OAL',
  'OAP',
  'OAPF',
  'OAR',
  'OAS',
  'OASL',
  'OAW',
  'OAX',
  'OCA',
  'OD',
  'ODD',
  'ODL',
  'ODP',
  'ODR',
  'ODS',
  'ODSL',
  'ODW',
  'ODX',
  'OF',
  'OFAB',
  'OFFX',
  'OFWD',
  'OFX',
  'OIP',
  'OJR',
  'OODS',
  'OPFX',
  'OPX',
  'ORAP',
  'OROP',
  'OSC',
  'OSCP',
  'OST',
  'OSUB',
  'OAD',
  'ODJ',
];

const DOCUMENT_NOTICE_EVENT_CODES = ['NOT'];
const DOCUMENT_CATEGORIES = Object.keys(documentMapExternal);
const DOCUMENT_CATEGORY_MAP = documentMapExternal;
const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
const DOCUMENT_INTERNAL_CATEGORY_MAP = documentMapInternal;
const COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;
const OPINION_DOCUMENT_TYPES = ['MOP', 'SOP', 'TCOP'];

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

const OBJECTIONS_OPTIONS = ['No', 'Yes', 'Unknown'];

const CONTACT_CHANGE_DOCUMENT_TYPES = [
  'Notice of Change of Address',
  'Notice of Change of Telephone Number',
  'Notice of Change of Address and Telephone Number',
];

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

const INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
  },
  ownershipDisclosure: {
    documentType: 'Ownership Disclosure Statement',
    eventCode: 'DISC',
  },
  petition: {
    documentType: 'Petition',
    eventCode: 'P',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
  },
};

const NOTICE_OF_DOCKET_CHANGE = {
  documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
  documentType: 'Notice of Docket Change',
  eventCode: 'NODC',
};

const NOTICE_OF_TRIAL = {
  documentTitle: 'Notice of Trial on [Date] at [Time]',
  documentType: 'Notice of Trial',
  eventCode: 'NDT',
};

const STANDING_PRETRIAL_NOTICE = {
  documentTitle: 'Standing Pretrial Notice',
  documentType: 'Standing Pretrial Notice',
  eventCode: 'SPTN',
};

const STANDING_PRETRIAL_ORDER = {
  documentTitle: 'Standing Pretrial Order',
  documentType: 'Standing Pretrial Order',
  eventCode: 'SPTO',
};

const SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfDocketChange: NOTICE_OF_DOCKET_CHANGE,
  noticeOfTrial: NOTICE_OF_TRIAL,
  standingPretrialNotice: STANDING_PRETRIAL_NOTICE,
  standingPretrialOrder: STANDING_PRETRIAL_ORDER,
};

const SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES = [
  'Entry of Appearance',
  'Substitution of Counsel',
];

const EVENT_CODES = [
  INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.eventCode,
  INITIAL_DOCUMENT_TYPES.ownershipDisclosure.eventCode,
  INITIAL_DOCUMENT_TYPES.petition.eventCode,
  INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.eventCode,
  INITIAL_DOCUMENT_TYPES.stin.eventCode,
  NOTICE_OF_DOCKET_CHANGE.eventCode,
  NOTICE_OF_TRIAL.eventCode,
  STANDING_PRETRIAL_NOTICE.eventCode,
  STANDING_PRETRIAL_ORDER.eventCode,
  'MISL',
  'FEE',
  'FEEW',
  'MGRTED',
  'MIND',
  'MINC',
];

const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not Paid',
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

module.exports = {
  ANSWER_DOCUMENT_CODES,
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  CONTACT_CHANGE_DOCUMENT_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_INTERNAL_CATEGORIES,
  DOCUMENT_INTERNAL_CATEGORY_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  EVENT_CODES,
  INITIAL_DOCUMENT_TYPES,
  NOTICE_OF_DOCKET_CHANGE,
  NOTICE_OF_TRIAL,
  OBJECTIONS_OPTIONS,
  OPINION_DOCUMENT_TYPES,
  ORDER_DOCUMENT_TYPES,
  PAYMENT_STATUS,
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES,
  PROCEDURE_TYPES,
  SCENARIOS,
  SERVICE_INDICATOR_TYPES,
  SIGNED_DOCUMENT_TYPES,
  STANDING_PRETRIAL_NOTICE,
  STANDING_PRETRIAL_ORDER,
  STATUS_TYPES_MANUAL_UPDATE,
  STATUS_TYPES_WITH_ASSOCIATED_JUDGE,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRACKED_DOCUMENT_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_LOCATION_MATCHER,
};

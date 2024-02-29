/* eslint-disable max-lines */
import { ENTERED_AND_SERVED_EVENT_CODES } from './courtIssuedDocument/CourtIssuedDocumentConstants';
import { FORMATS, formatNow } from '../utilities/DateHandler';
import { flatten, omit, pick, sortBy, union, uniq, without } from 'lodash';
import courtIssuedEventCodesJson from '../../tools/courtIssuedEventCodes.json';
import externalFilingEventsJson from '../../tools/externalFilingEvents.json';
import internalFilingEventsJson from '../../tools/internalFilingEvents.json';

// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
// a number (100 to 99999) followed by a - and a 2 digit year
export const DOCUMENT_INTERNAL_CATEGORIES_MAP = internalFilingEventsJson;
export const DOCUMENT_EXTERNAL_CATEGORIES_MAP = externalFilingEventsJson;
export const COURT_ISSUED_EVENT_CODES = courtIssuedEventCodesJson;

export const DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

export const CURRENT_YEAR = +formatNow(FORMATS.YEAR);

export const DEFAULT_PRACTITIONER_BIRTH_YEAR = 1950;

export const MAX_PRACTITIONER_DOCUMENT_DESCRIPTION_CHARACTERS = 1000;

export const MAX_STAMP_CUSTOM_TEXT_CHARACTERS = 60;

export const EXHIBIT_EVENT_CODES = ['EXH', 'PTE', 'HE', 'TE', 'M123', 'STIP'];

export const AMENDMENT_EVENT_CODES = ['AMAT', 'ADMT'];

export const STANDING_PRETRIAL_EVENT_CODES = ['SPOS', 'SPTO'];

export const CLERK_OF_THE_COURT_CONFIGURATION = 'clerk-of-court-configuration';

export const LEGACY_DOCUMENT_TYPES = [
  {
    documentType: 'Designation of Counsel to Receive Service',
    eventCode: 'DSC',
  },
];

// city, state, optional unique ID (generated automatically in testing files)
export const TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

export const PARTIES_CODES = { BOTH: 'B', PETITIONER: 'P', RESPONDENT: 'R' };

export const AMENDED_PETITION_FORM_NAME = 'amended-petition-form.pdf';

export const TRIAL_SESSION_PROCEEDING_TYPES = {
  inPerson: 'In Person',
  remote: 'Remote',
} as const;
const TRIAL_PROCEEDINGS = Object.values(TRIAL_SESSION_PROCEEDING_TYPES);
export type TrialSessionProceedingType = (typeof TRIAL_PROCEEDINGS)[number];

export const TRIAL_SESSION_SCOPE_TYPES = {
  locationBased: 'Location-based',
  standaloneRemote: 'Standalone Remote',
} as const;
const TRIAL_SESSION_SCOPES = Object.values(TRIAL_SESSION_SCOPE_TYPES);
export type TrialSessionScope = (typeof TRIAL_SESSION_SCOPES)[number];

export const JURISDICTIONAL_OPTIONS = {
  restoredToDocket: 'The case is restored to the general docket',
  undersigned: 'Jurisdiction is retained by the undersigned',
};

export const MOTION_DISPOSITIONS = { DENIED: 'Denied', GRANTED: 'Granted' };

export const STRICKEN_FROM_TRIAL_SESSION_MESSAGE =
  'This case is stricken from the trial session';

export const PARTY_VIEW_TABS = {
  participantsAndCounsel: 'Intervenor/Participant(s)',
  petitionersAndCounsel: 'Petitioner(s) & Counsel',
  respondentCounsel: 'Respondent Counsel',
};

export const ALLOWLIST_FEATURE_FLAGS = {
  CHIEF_JUDGE_NAME: {
    key: 'chief-judge-name',
  },
  CONSOLIDATED_CASES_ADD_DOCKET_NUMBERS: {
    disabledMessage:
      'The ability to add multiple docket entries to an order is disabled.',
    key: 'consolidated-cases-add-docket-numbers',
  },
  DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE: {
    key: 'document-visibility-policy-change-date',
  },
  E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG: {
    key: 'e-consent-fields-enabled-feature-flag',
  },
  ENTITY_LOCKING_FEATURE_FLAG: {
    key: 'entity-locking-feature-flag',
  },
  USE_CHANGE_OF_ADDRESS_LAMBDA: {
    disabledMessage:
      'A flag to know when to use the change of address lambda for processing.',
    key: 'use-change-of-address-lambda',
  },
  USE_EXTERNAL_PDF_GENERATION: {
    disabledMessage:
      'A flag to tell the code to directly generation pdfs or to do in an external lambda.',
    key: 'use-external-pdf-generation',
  },
};

export const CONFIGURATION_ITEM_KEYS = {
  SECTION_OUTBOX_NUMBER_OF_DAYS: {
    key: 'section-outbox-number-of-days',
  },
};

export const DEFAULT_PROCEEDING_TYPE = TRIAL_SESSION_PROCEEDING_TYPES.inPerson;

export const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

export const DOCUMENT_PROCESSING_STATUS_OPTIONS = {
  COMPLETE: 'complete',
  PENDING: 'pending',
};

export const NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP = [
  {
    documentType: 'Notice of Change of Address',
    eventCode: 'NCA',
    title: 'Notice of Change of Address',
  },
  {
    documentType: 'Notice of Change of Address and Telephone Number',
    eventCode: 'NCAP',
    title: 'Notice of Change of Address and Telephone Number',
  },
  {
    documentType: 'Notice of Change of Telephone Number',
    eventCode: 'NCP',
    title: 'Notice of Change of Telephone Number',
  },
  {
    documentType: 'Notice of Change of Email Address',
    eventCode: 'NOCE',
    title: 'Notice of Change of Email Address',
  },
];

export const NOTICE_OF_CHANGE_CONTACT_INFORMATION_EVENT_CODES =
  NOTICE_OF_CHANGE_CONTACT_INFORMATION_MAP.map(n => n.eventCode);

export const CHIEF_JUDGE = 'Chief Judge';

export const DOCKET_NUMBER_SUFFIXES = {
  DECLARATORY_JUDGEMENTS_FOR_EXEMPT_ORGS: 'X',
  DECLARATORY_JUDGEMENTS_FOR_RETIREMENT_PLAN_REVOCATION: 'R',
  DISCLOSURE: 'D',
  LIEN_LEVY: 'L',
  PASSPORT: 'P',
  SMALL: 'S',
  SMALL_LIEN_LEVY: 'SL',
  WHISTLEBLOWER: 'W',
};

export const CASE_STATUS_TYPES = {
  assignedCase: 'Assigned - Case', // Case has been assigned to a judge
  assignedMotion: 'Assigned - Motion', // Someone has requested a judge for the case
  calendared: 'Calendared', // Case has been scheduled for trial
  cav: 'CAV', // Core alternative valuation
  closed: 'Closed', // Judge has made a ruling to close the case (either because it has been settled, adjudicated, or withdrawn)
  closedDismissed: 'Closed - Dismissed', // Judge has made a ruling to close the case because it has been dismissed
  generalDocket: 'General Docket - Not at Issue', // Submitted to the IRS
  generalDocketReadyForTrial: 'General Docket - At Issue (Ready for Trial)', // Case is ready for trial
  jurisdictionRetained: 'Jurisdiction Retained', // Jurisdiction of a case is retained by a specific judge — usually after the case is on a judge’s trial calendar
  new: 'New', // Case has not been QCed
  onAppeal: 'On Appeal', // After the trial, the case has gone to the appeals court
  rule155: 'Rule 155', // Where the Court has filed or stated its opinion or issued a dispositive order determining the issues in a case, it may withhold entry of its decision for the purpose of permitting the parties to submit computations pursuant to the Court’s determination of the issues, showing the correct amount to be included in the decision.
  submitted: 'Submitted', // Submitted to the judge for decision
  submittedRule122: 'Submitted - Rule 122', // Case submitted for decision without requiring a trial
} as const;
export const CASE_STATUSES = Object.values(CASE_STATUS_TYPES);
export type CaseStatus = (typeof CASE_STATUSES)[number];

export const CAV_AND_SUBMITTED_CASE_STATUS = [
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.submitted,
  CASE_STATUS_TYPES.submittedRule122,
];

export type CAV_AND_SUBMITTED_CASE_STATUS_TYPES =
  typeof CAV_AND_SUBMITTED_CASE_STATUS;

export const CLOSED_CASE_STATUSES = [
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
];

export const DOCUMENT_RELATIONSHIPS = {
  PRIMARY: 'primaryDocument',
  PRIMARY_SUPPORTING: 'primarySupportingDocument',
  SECONDARY: 'secondaryDocument',
  SECONDARY_SUPPORTING: 'secondarySupportingDocument',
  SUPPORTING: 'supportingDocument',
};

export const DOCUMENT_SERVED_MESSAGES = {
  ENTRY_ADDED: 'Your entry has been added to the docket record.',
  EXTERNAL_ENTRY_ADDED:
    'Document filed and is accessible from the Docket Record.',
  GENERIC: 'Document served.',
  SELECTED_CASES: 'Document served to selected cases in group.',
};

export const DOCUMENT_SEARCH_SORT = {
  FILING_DATE_ASC: 'FILING_DATE_ASC',
  FILING_DATE_DESC: 'FILING_DATE_DESC',
  NUMBER_OF_PAGES_ASC: 'NUMBER_OF_PAGES_ASC',
  NUMBER_OF_PAGES_DESC: 'NUMBER_OF_PAGES_DESC',
};

export const TODAYS_ORDERS_SORTS = {
  ...DOCUMENT_SEARCH_SORT,
};

export const TODAYS_ORDERS_SORT_DEFAULT = TODAYS_ORDERS_SORTS.FILING_DATE_DESC;

// This docket entry type isn't defined anywhere else
export const STIN_DOCKET_ENTRY_TYPE = {
  documentType: 'Statement of Taxpayer Identification',
  eventCode: 'STIN',
  sort: 1,
  tabTitle: 'STIN',
};

const pickEventCode = (d: { eventCode: string }): string => d.eventCode;

export const UNSERVABLE_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isUnservable,
).map(pickEventCode);

export const CASE_DISMISSAL_ORDER_TYPES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.closesAndDismissesCase,
).map(pickEventCode);

export const ORDER_TYPES = [
  {
    documentType: 'Order',
    eventCode: 'O',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
    documentType: 'Order of Dismissal for Lack of Jurisdiction',
    eventCode: 'ODJ',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Order of Dismissal',
    documentType: 'Order of Dismissal',
    eventCode: 'OD',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Order of Dismissal and Decision',
    documentType: 'Order of Dismissal and Decision',
    eventCode: 'ODD',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Order for Filing Fee',
    documentType: 'Order for Filing Fee',
    eventCode: 'OF',
    overrideFreeText: false,
  },
  {
    documentTitle: 'Order for Amended Petition',
    documentType: 'Order for Amended Petition',
    eventCode: 'OAP',
    overrideFreeText: false,
  },
  {
    documentTitle: 'Order for Amended Petition and Filing Fee',
    documentType: 'Order for Amended Petition and Filing Fee',
    eventCode: 'OAPF',
    overrideFreeText: false,
  },
  {
    documentTitle: 'Order to Show Cause',
    documentType: 'Order to Show Cause',
    eventCode: 'OSC',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Order petr(s) to show cause why "S" should not be removed',
    documentType: 'Order petr(s) to show cause why "S" should not be removed',
    eventCode: 'OSCP',
    overrideFreeText: false,
  },
  {
    documentTitle: 'Order and Decision',
    documentType: 'Order and Decision',
    eventCode: 'OAD',
    overrideFreeText: true,
  },
  {
    documentTitle: 'Decision',
    documentType: 'Decision',
    eventCode: 'DEC',
    overrideFreeText: true,
  },
  {
    documentType: 'Notice',
    eventCode: 'NOT',
    overrideFreeText: true,
  },
];

export const BENCH_OPINION_EVENT_CODE = 'OST';

export const NOTICE_EVENT_CODE = 'NOT';

export const ADVANCED_SEARCH_OPINION_TYPES = {
  Bench: BENCH_OPINION_EVENT_CODE,
  Memorandum: 'MOP',
  Summary: 'SOP',
  'T.C.': 'TCOP',
};

export const ADVANCED_SEARCH_OPINION_TYPES_LIST = [
  {
    eventCode: ADVANCED_SEARCH_OPINION_TYPES['T.C.'],
    label: 'T.C.',
  },
  {
    eventCode: ADVANCED_SEARCH_OPINION_TYPES.Memorandum,
    label: 'Memorandum',
  },
  {
    eventCode: ADVANCED_SEARCH_OPINION_TYPES.Summary,
    label: 'Summary',
  },
  {
    eventCode: ADVANCED_SEARCH_OPINION_TYPES.Bench,
    label: 'Bench Opinion (Order of Service of Transcript)',
  },
];

export const ORDER_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isOrder && d.eventCode !== BENCH_OPINION_EVENT_CODE,
).map(pickEventCode);

export const GENERIC_ORDER_EVENT_CODE = COURT_ISSUED_EVENT_CODES.find(
  d => d.documentType === 'Order',
)!.eventCode;

export const DOCUMENT_NOTICE_EVENT_CODES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isNotice,
).map(pickEventCode);

export const OPINION_DOCUMENT_TYPES = COURT_ISSUED_EVENT_CODES.filter(
  d => d.isOpinion,
);
export const OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION = [
  ...OPINION_DOCUMENT_TYPES.map(pickEventCode),
];

export const OPINION_EVENT_CODES_WITH_BENCH_OPINION = [
  ...OPINION_EVENT_CODES_WITHOUT_BENCH_OPINION,
  BENCH_OPINION_EVENT_CODE,
];

export const DOCUMENT_EXTERNAL_CATEGORIES = Object.keys(
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
);
export const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(
  DOCUMENT_INTERNAL_CATEGORIES_MAP,
);
export const COURT_ISSUED_EVENT_CODES_REQUIRING_COVERSHEET =
  COURT_ISSUED_EVENT_CODES.filter(d => d.requiresCoversheet).map(pickEventCode);

export const EVENT_CODES_REQUIRING_SIGNATURE = COURT_ISSUED_EVENT_CODES.filter(
  d => d.requiresSignature,
).map(pickEventCode);

// _without returns a new array with values from arg1 sans values subsequent args
export const EVENT_CODES_REQUIRING_JUDGE_SIGNATURE = without(
  EVENT_CODES_REQUIRING_SIGNATURE,
  'NTD',
  'NOT',
);

export const JUDGE_ACTIVITY_REPORT_ORDER_EVENT_CODES = ORDER_EVENT_CODES.filter(
  eventCode => {
    const excludedOrderEventCodes = ['OAJ', 'SPOS', 'SPTO', 'OST'];
    return !excludedOrderEventCodes.includes(eventCode);
  },
);

export const EXTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
).map(t => t.documentType);

export const INTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
).map(t => t.documentType);

export const COURT_ISSUED_DOCUMENT_TYPES = COURT_ISSUED_EVENT_CODES.map(
  t => t.documentType,
);

export const AUTOGENERATED_EXTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
)
  .filter((d: Record<string, any>) => d.isAutogenerated)
  .map(d => d.documentType);

export const AUTOGENERATED_INTERNAL_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
)
  .filter((d: Record<string, any>) => d.isAutogenerated)
  .map(d => d.documentType);

export const EXTERNAL_DOCUMENTS_ARRAY = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
);

export const INTERNAL_DOCUMENTS_ARRAY = flatten(
  Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
);

export const MOTION_EVENT_CODES = [
  ...DOCUMENT_INTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
    return entry.eventCode;
  }),
  'M116',
  'M112',
];

export const SIMULTANEOUS_DOCUMENT_EVENT_CODES = [
  ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Simultaneous Brief'].map(entry => {
    return entry.eventCode;
  }),
];

export const SERIATIM_DOCUMENT_EVENT_CODES = [
  ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Seriatim Brief'].map(entry => {
    return entry.eventCode;
  }),
];

export const BRIEF_EVENTCODES = [
  ...SIMULTANEOUS_DOCUMENT_EVENT_CODES,
  ...SERIATIM_DOCUMENT_EVENT_CODES,
];

export const AMICUS_BRIEF_EVENT_CODE = 'AMBR';
export const SIGNED_DOCUMENT_TYPES = {
  signedStipulatedDecision: {
    documentType: 'Stipulated Decision',
    eventCode: 'SDEC',
  },
};

export const POLICY_DATE_IMPACTED_EVENTCODES = [
  ...BRIEF_EVENTCODES,
  AMICUS_BRIEF_EVENT_CODE,
  SIGNED_DOCUMENT_TYPES.signedStipulatedDecision.eventCode,
  ...AMENDMENT_EVENT_CODES,
  'REDC',
  'SPML',
  'SUPM',
];

export const SCENARIOS = [
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

export const TRANSCRIPT_EVENT_CODE = 'TRAN';
export const CORRECTED_TRANSCRIPT_EVENT_CODE = 'CTRA';
export const REVISED_TRANSCRIPT_EVENT_CODE = 'RTRA';

export const LODGED_EVENT_CODE = 'MISCL';

/* eslint-disable sort-keys-fix/sort-keys-fix */
export const OBJECTIONS_OPTIONS_MAP = {
  YES: 'Yes',
  NO: 'No',
  UNKNOWN: 'Unknown',
};
export const OBJECTIONS_OPTIONS = [...Object.values(OBJECTIONS_OPTIONS_MAP)];

export const CONTACT_CHANGE_DOCUMENT_TYPES = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
)
  .filter((d: Record<string, any>) => d.isContactChange)
  .map(d => d.documentType);

export const TRACKED_DOCUMENT_TYPES = {
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

export const SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES = flatten([
  ...Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
])
  .filter((internalEvent: Record<string, any>) => internalEvent.caseDecision)
  .map(x => x.eventCode);

export const NON_MULTI_DOCKETABLE_EVENT_CODES = [
  ...ENTERED_AND_SERVED_EVENT_CODES,
  ...SINGLE_DOCKET_RECORD_ONLY_EVENT_CODES,
];

export const MULTI_DOCKET_FILING_EVENT_CODES = flatten([
  ...Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
])
  .filter((internalEvent: Record<string, any>) => !internalEvent.caseDecision)
  .map(x => x.eventCode);

export const STAMPED_DOCUMENTS_ALLOWLIST = uniq(
  [...EXTERNAL_DOCUMENTS_ARRAY, ...INTERNAL_DOCUMENTS_ARRAY]
    .filter((doc: Record<string, any>) => doc.allowStamp)
    .map(x => x.eventCode),
);

export const EXTERNAL_TRACKED_DOCUMENT_EVENT_CODES =
  EXTERNAL_DOCUMENTS_ARRAY.filter(
    doc =>
      doc.category === TRACKED_DOCUMENT_TYPES.application.category ||
      doc.category === TRACKED_DOCUMENT_TYPES.motion.category,
  ).map(x => x.eventCode);
export const INTERNAL_TRACKED_DOCUMENT_EVENT_CODES =
  INTERNAL_DOCUMENTS_ARRAY.filter(
    doc =>
      doc.category === TRACKED_DOCUMENT_TYPES.application.category ||
      doc.category === TRACKED_DOCUMENT_TYPES.motion.category,
  ).map(x => x.eventCode);

export const TRACKED_DOCUMENT_TYPES_EVENT_CODES = union(
  EXTERNAL_TRACKED_DOCUMENT_EVENT_CODES,
  INTERNAL_TRACKED_DOCUMENT_EVENT_CODES,
  [
    TRACKED_DOCUMENT_TYPES.proposedStipulatedDecision.eventCode,
    TRACKED_DOCUMENT_TYPES.orderToShowCause.eventCode,
  ],
);

export const DOCKET_RECORD_FILTER_OPTIONS = {
  allDocuments: 'All documents',
  exhibits: 'Exhibits',
  motions: 'Motions',
  orders: 'Orders',
};

export const PUBLIC_DOCKET_RECORD_FILTER_OPTIONS = omit(
  DOCKET_RECORD_FILTER_OPTIONS,
  ['exhibits'],
);
export const FILTER_OPTIONS = Object.values(
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
);
export type PUBLIC_DOCKET_RECORD_FILTER = (typeof FILTER_OPTIONS)[number];

export const INITIAL_DOCUMENT_TYPES = {
  applicationForWaiverOfFilingFee: {
    documentTitle: 'Application for Waiver of Filing Fee',
    documentType: 'Application for Waiver of Filing Fee',
    eventCode: 'APW',
    tabTitle: 'APW',
    sort: 5,
    fileName: 'applicationForWaiverOfFilingFeeFile',
  },
  corporateDisclosure: {
    documentTitle: 'Corporate Disclosure Statement',
    documentType: 'Corporate Disclosure Statement',
    eventCode: 'DISC',
    tabTitle: 'CDS',
    sort: 4,
    fileName: 'corporateDisclosureFile',
  },
  petition: {
    documentTitle: 'Petition',
    documentType: 'Petition',
    eventCode: 'P',
    tabTitle: 'Petition',
    sort: 0,
    fileName: 'petitionFile',
  },
  requestForPlaceOfTrial: {
    documentTitle: 'Request for Place of Trial at [Place]',
    documentType: 'Request for Place of Trial',
    eventCode: 'RQT',
    tabTitle: 'RQT',
    sort: 3,
    fileName: 'requestForPlaceOfTrialFile',
  },
  stin: {
    documentType: 'Statement of Taxpayer Identification',
    eventCode: 'STIN',
    sort: 1,
    tabTitle: 'STIN',
    fileName: 'stinFile',
  },
  attachmentToPetition: {
    documentTitle: 'Attachment to Petition',
    documentType: 'Attachment to Petition',
    eventCode: 'ATP',
    tabTitle: 'ATP',
    sort: 2,
    fileName: 'attachmentToPetitionFile',
  },
} as const;

export const INITIAL_DOCUMENT_TYPES_FILE_MAP = {
  applicationForWaiverOfFilingFee: 'applicationForWaiverOfFilingFeeFile',
  corporateDisclosure: 'corporateDisclosureFile',
  petition: 'petitionFile',
  requestForPlaceOfTrial: 'requestForPlaceOfTrialFile',
  stin: 'stinFile',
  attachmentToPetition: 'attachmentToPetitionFile',
};

export const INITIAL_DOCUMENT_TYPES_MAP = {
  applicationForWaiverOfFilingFeeFile:
    INITIAL_DOCUMENT_TYPES.applicationForWaiverOfFilingFee.documentType,
  attachmentToPetitionFile:
    INITIAL_DOCUMENT_TYPES.attachmentToPetition.documentType,
  corporateDisclosureFile:
    INITIAL_DOCUMENT_TYPES.corporateDisclosure.documentType,
  petitionFile: INITIAL_DOCUMENT_TYPES.petition.documentType,
  requestForPlaceOfTrialFile:
    INITIAL_DOCUMENT_TYPES.requestForPlaceOfTrial.documentType,
  stinFile: INITIAL_DOCUMENT_TYPES.stin.documentType,
};

export const MINUTE_ENTRIES_MAP = {
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

export const SPTO_DOCUMENT = COURT_ISSUED_EVENT_CODES.find(
  doc => doc.eventCode === 'SPTO',
)!;

export const SPOS_DOCUMENT = COURT_ISSUED_EVENT_CODES.find(
  doc => doc.eventCode === 'SPOS',
)!;

export const EVENT_CODES_VISIBLE_TO_PUBLIC = [
  ...COURT_ISSUED_EVENT_CODES.filter(d => d.isOrder || d.isOpinion).map(
    d => d.eventCode,
  ),
  ...POLICY_DATE_IMPACTED_EVENTCODES,
  'DEC',
  'ODL',
  'SPTN',
  'OCS',
  'TCRP',
];

const AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES_WITH_NAMES = {
  orderForFilingFee: {
    content:
      '&nbsp;&nbsp;&nbsp;&nbsp;The Court’s $60.00 filing fee for this case has not been paid. Accordingly, it is <br/><br/> &nbsp;&nbsp;&nbsp;&nbsp;ORDERED that, on or before [TODAY_PLUS_30], petitioner(s) shall pay the Court’s filing fee of $60.00, or this case may be dismissed. Waiver of the filing fee requires an affidavit or declaration containing specific financial information regarding the inability to make such payment. An Application for Waiver of Filing Fee form is available under “Case Related Forms” on the Court’s website at www.ustaxcourt.gov/case_related_forms.html. The Court will consider whether to waive the filing fee upon receipt of such information from petitioner(s). Failure to pay the Court’s $60.00 filing fee or submit an Application for Waiver of Filing Fee on or before [TODAY_PLUS_30], may result in dismissal of this case.',
    documentType: ORDER_TYPES.find(order => order.eventCode === 'OF')!
      .documentType,
    eventCode: 'OF',
    documentTitle: 'Order',
    deadlineDescription: 'Filing Fee Due',
  },
  orderForAmendedPetition: {
    content:
      '&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on [FILED_DATE], a document as the petition of the above-named petitioner(s) at the docket number indicated. That docket number MUST appear on all documents and papers subsequently sent to the Court for filing or otherwise. The document did not comply with the Rules of the Court as to the form and content of a proper petition. <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;ORDERED that on or before [ORDER_PLUS_60], petitioner(s) shall file a proper amended petition. If, by [ORDER_PLUS_60], petitioner(s) do not file an Amended Petition, the case will be dismissed or other action taken as the Court deems appropriate.',
    documentType: ORDER_TYPES.find(order => order.eventCode === 'OAP')!
      .documentType,
    eventCode: 'OAP',
    documentTitle: 'Order',
    deadlineDescription: 'Amended Petition Due',
  },
  orderForAmendedPetitionAndFilingFee: {
    content: `&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on [FILED_DATE], a document as the petition of the above-named
      petitioner(s) at the docket number indicated. That docket number MUST appear on all documents
      and papers subsequently sent to the Court for filing or otherwise. The document did not comply with
      the Rules of the Court as to the form and content of a proper petition. The filing fee was not paid.<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is<br/>
      <br/>
      &nbsp;&nbsp;&nbsp;&nbsp;ORDERED that on or before [ORDER_PLUS_30], petitioner(s) shall file a proper
      amended petition and pay the $60.00 filing fee. Waiver of the filing fee requires an affidavit
      containing specific financial information regarding the inability to make such payment. An
      Application for Waiver of Filing Fee and Affidavit form is available under "Case Related Forms" on
      the Court's website at www.ustaxcourt.gov/case_related_forms.html.<br/>
      <br/>
      If, by [ORDER_PLUS_30], petitioner(s) do not file an Amended Petition and either pay the Court's
      $60.00 filing fee or submit an Application for Waiver of the Filing Fee, the case will be dismissed or
      other action taken as the Court deems appropriate.`,
    documentType: ORDER_TYPES.find(order => order.eventCode === 'OAPF')!
      .documentType,
    eventCode: 'OAPF',
    documentTitle: 'Order',
    deadlineDescription: 'AP & Fee Due',
  },
};

export const SYSTEM_GENERATED_DOCUMENT_TYPES = {
  noticeOfAttachmentsInNatureOfEvidence: {
    eventCode: 'NOT',
    content:
      '&nbsp;&nbsp;&nbsp;&nbsp;Certain documents attached to the Petition that you filed with this Court appear to be in the nature of evidence. Please be advised that these documents have not been received into evidence by the Court. You may offer evidentiary materials to the Court at the time of trial.',
    documentType: ORDER_TYPES.find(order => order.eventCode === 'NOT')!
      .documentType,
    documentTitle: 'Notice of Attachments in the Nature of Evidence',
  },
  orderDesignatingPlaceOfTrial: {
    content: `&nbsp;&nbsp;&nbsp;&nbsp;The Court filed on [FILED_DATE], a petition for petitioner(s) to commence the above referenced case.  Because the Request for Place of Trial was not submitted with the Petition, the Court will designate the place of trial for this case. If petitioner(s) wishes to designate a place of trial other than the place of trial designated by the Court below, petitioner(s) may file a Motion to Change Place of Trial and designate therein a place of trial at which this Court tries [PROCEDURE_TYPE] tax cases (any city on the Request for Place of Trial form which is available under “Case Related Forms” on the Court’s website at www.ustaxcourt.gov/case_related_forms.html).<br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;Accordingly, it is
    <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;ORDERED that <span style="color: red;">TRIAL_LOCATION</span> is designated as the place of trial in this case.`,
    documentType: ORDER_TYPES.find(order => order.eventCode === 'O')!
      .documentType,
    eventCode: 'O',
    documentTitle: 'Order',
  },
  orderPetitionersToShowCause: {
    content: `&nbsp;&nbsp;&nbsp;&nbsp;The petition commencing the above-docketed matter was filed on [FILED_DATE]. In that document,
      petitioners elected to have this deficiency case conducted under the small tax case procedures. However, a review
      of the record shows that the amount in dispute for one or more taxable years exceeds $50,000. The small tax case
      procedures are only applicable to deficiency cases in which the amount in dispute for each taxable year is
      $50,000 or less. <u>See</u> section 7463(a)(1), Internal Revenue Code; Rules 170 and 171, Tax Court Rules of Practice
      and Procedure.
      <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;Upon due consideration and for cause, it is
      <br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;ORDERED that, on or before [ORDER_DATE_PLUS_60] petitioners shall show cause in writing why
      the Court should not issue an Order directing that the small tax case designation be removed in this case and the
      proceedings not be conducted under the Small Tax Case Rules.`,
    documentType: ORDER_TYPES.find(order => order.eventCode === 'OSCP')!
      .documentType,
    eventCode: 'OSCP',
    // Title for PDF only
    documentTitle: 'Order to Show Cause',
  },
  noticeOfDocketChange: {
    documentTitle: 'Notice of Docket Change for Docket Entry No. [Index]',
    documentType: 'Notice of Docket Change',
    eventCode: 'NODC',
  },
  noticeOfChangeToRemoteProceeding: {
    documentTitle: 'Notice of Change to Remote Proceeding',
    documentType: 'Notice of Change to Remote Proceeding',
    eventCode: 'NORP',
  },
  noticeOfChangeToInPersonProceeding: {
    documentTitle: 'Notice of Change to In Person Proceeding',
    documentType: 'Notice of Change to In Person Proceeding',
    eventCode: 'NOIP',
  },
  noticeOfTrial: {
    documentTitle: 'Notice of Trial on [Date] at [Time]',
    documentType: 'Notice of Trial',
    eventCode: 'NTD',
  },
  noticeOfReceiptOfPetition: {
    documentTitle: 'Notice of Receipt of Petition',
    documentType: 'Notice of Receipt of Petition',
    eventCode: 'NOTR',
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
  noticeOfChangeOfTrialJudge: {
    documentTitle: 'Notice of Change of Trial Judge',
    documentType: 'Notice of Change of Trial Judge',
    eventCode: 'NOT',
  },
  ...AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES_WITH_NAMES,
};

export const AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES = flatten(
  Object.values(AUTO_GENERATED_DEADLINE_DOCUMENT_TYPES_WITH_NAMES),
);

export const PROPOSED_STIPULATED_DECISION_EVENT_CODE = flatten(
  Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
).find(d => d.documentType === 'Proposed Stipulated Decision')!.eventCode;
export const STIPULATED_DECISION_EVENT_CODE = COURT_ISSUED_EVENT_CODES.find(
  d => d.documentType === 'Stipulated Decision',
)!.eventCode;

export const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP = [
  {
    documentType: 'Entry of Appearance',
    documentTitle: 'Entry of Appearance',
    eventCode: 'EA',
    allowImmediateAssociation: true,
    filedByPractitioner: true,
  },
  {
    documentType: 'Limited Entry of Appearance',
    documentTitle: 'Limited Entry of Appearance',
    eventCode: 'LEA',
    allowImmediateAssociation: true,
    filedByPractitioner: true,
  },
  {
    documentType: 'Substitution of Counsel',
    documentTitle: 'Substitution of Counsel',
    eventCode: 'SOC',
    allowImmediateAssociation: true,
    filedByPractitioner: true,
  },
  {
    documentType: 'Notice of Intervention',
    documentTitle: 'Notice of Intervention',
    eventCode: 'NOI',
    allowImmediateAssociation: false,
    filedByPractitioner: true,
  },
  {
    documentType: 'Motion to Substitute Parties and Change Caption',
    documentTitle: 'Motion to Substitute Parties and Change Caption',
    eventCode: 'M107',
    allowImmediateAssociation: false,
  },
  {
    documentType: 'Notice of Election to Participate',
    documentTitle: 'Notice of Election to Participate',
    eventCode: 'NOEP',
    allowImmediateAssociation: false,
    filedByPractitioner: true,
  },
  {
    documentType: 'Notice of Election to Intervene',
    documentTitle: 'Notice of Election to Intervene',
    eventCode: 'NOEI',
    allowImmediateAssociation: false,
    filedByPractitioner: true,
  },
];

export const PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES =
  PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.map(d => d.documentType);

export const PAYMENT_STATUS = {
  PAID: 'Paid',
  UNPAID: 'Not paid',
  WAIVED: 'Waived',
};
const PAYMENT_TYPES = Object.values(PAYMENT_STATUS);
export type PaymentStatusTypes = (typeof PAYMENT_TYPES)[number];

export const PROCEDURE_TYPES_MAP = {
  regular: 'Regular',
  small: 'Small',
};

export const PROCEDURE_TYPES = [
  PROCEDURE_TYPES_MAP.regular,
  PROCEDURE_TYPES_MAP.small,
]; // This is the order that they appear in the UI

export const STATUS_TYPES_WITH_ASSOCIATED_JUDGE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
  CASE_STATUS_TYPES.submittedRule122,
];

export const STATUS_TYPES_MANUAL_UPDATE = [
  CASE_STATUS_TYPES.assignedCase,
  CASE_STATUS_TYPES.assignedMotion,
  CASE_STATUS_TYPES.cav,
  CASE_STATUS_TYPES.closed,
  CASE_STATUS_TYPES.closedDismissed,
  CASE_STATUS_TYPES.generalDocket,
  CASE_STATUS_TYPES.generalDocketReadyForTrial,
  CASE_STATUS_TYPES.jurisdictionRetained,
  CASE_STATUS_TYPES.onAppeal,
  CASE_STATUS_TYPES.rule155,
  CASE_STATUS_TYPES.submitted,
  CASE_STATUS_TYPES.submittedRule122,
];

export const ANSWER_DOCUMENT_CODES = [
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

export const CASE_CAPTION_POSTFIX =
  'v. Commissioner of Internal Revenue, Respondent';

export const AUTOMATIC_BLOCKED_REASONS = {
  dueDate: 'Due Date',
  pending: 'Pending Item',
  pendingAndDueDate: 'Pending Item and Due Date',
};

export const CUSTOM_CASE_REPORT_PAGE_SIZE = 100;

export const CASE_TYPES_MAP = {
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
} as const;

export const CASE_TYPES = Object.values(CASE_TYPES_MAP);
export type CaseType = (typeof CASE_TYPES)[number];

export const CASE_TYPE_DESCRIPTIONS_WITH_IRS_NOTICE = {
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

export const CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE = {
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

export const ROLES = {
  adc: 'adc',
  admin: 'admin',
  admissionsClerk: 'admissionsclerk',
  caseServicesSupervisor: 'caseServicesSupervisor',
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

// this isn't a real role someone can login with, which is why
// it's a separate constant.
export const SYSTEM_ROLE = 'System';

export const FILING_TYPES = {
  [ROLES.petitioner]: ['Myself', 'Myself and my spouse', 'A business', 'Other'],
  [ROLES.privatePractitioner]: [
    'Individual petitioner',
    'Petitioner and spouse',
    'A business',
    'Other',
  ],
};

export const ANSWER_CUTOFF_AMOUNT_IN_DAYS = 45;

export const ANSWER_CUTOFF_UNIT = 'day';

export const COUNTRY_TYPES = {
  DOMESTIC: 'domestic',
  INTERNATIONAL: 'international',
} as const;
const CountryTypesArray = Object.values(COUNTRY_TYPES);
export type CountryTypes = (typeof CountryTypesArray)[number];

export const US_STATES = {
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
} as const;

export const US_STATES_OTHER = {
  AA: 'Armed Forces Americas',
  AE: 'Armed Forces Europe',
  AP: 'Armed Forces Pacific',
  AS: 'American Samoa',
  FM: 'Federated States of Micronesia',
  GU: 'Guam',
  MH: 'Marshall Islands',
  MP: 'Northern Mariana Islands',
  PR: 'Puerto Rico',
  PW: 'Palau',
  VI: 'Virgin Islands',
} as const;

const statesArray = [
  ...Object.values(US_STATES),
  ...Object.values(US_STATES_OTHER),
];
export type States = (typeof statesArray)[number];

export type AbbrevatedStates =
  | keyof typeof US_STATES
  | keyof typeof US_STATES_OTHER;

export const STATE_NOT_AVAILABLE = 'N/A';

export const PARTY_TYPES = {
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
  partnershipBBA: 'Partnership (as a partnership representative under BBA)',
  partnershipOtherThanTaxMatters:
    'Partnership (as a partner other than Tax Matters Partner)',
  petitioner: 'Petitioner',
  petitionerDeceasedSpouse: 'Petitioner & deceased spouse',
  petitionerSpouse: 'Petitioner & spouse',
  survivingSpouse: 'Surviving spouse',
  transferee: 'Transferee',
  trust: 'Trust',
} as const;
const partyTypeArray = Object.values(PARTY_TYPES);
export type PartyType = (typeof partyTypeArray)[number];

export const BUSINESS_TYPES = {
  corporation: PARTY_TYPES.corporation,
  partnershipAsTaxMattersPartner: PARTY_TYPES.partnershipAsTaxMattersPartner,
  partnershipBBA: PARTY_TYPES.partnershipBBA,
  partnershipOtherThanTaxMatters: PARTY_TYPES.partnershipOtherThanTaxMatters,
};

export const ESTATE_TYPES = {
  estate: PARTY_TYPES.estate,
  estateWithoutExecutor: PARTY_TYPES.estateWithoutExecutor,
  trust: PARTY_TYPES.trust,
};

export const OTHER_TYPES = {
  conservator: PARTY_TYPES.conservator,
  custodian: PARTY_TYPES.custodian,
  guardian: PARTY_TYPES.guardian,
  nextFriendForIncompetentPerson: PARTY_TYPES.nextFriendForIncompetentPerson,
  nextFriendForMinor: PARTY_TYPES.nextFriendForMinor,
};

export const CONTACT_TYPES = {
  intervenor: 'intervenor',
  otherFiler: 'otherFilers', // TODO 8135: This can be deleted once 0033 migration script has run on all ENVs
  otherPetitioner: 'otherPetitioner',
  otherPetitioners: 'otherPetitioners', // TODO 8135: This can be deleted once 0033 migration script has run on all ENVs
  participant: 'participant',
  petitioner: 'petitioner',
  primary: 'primary',
  secondary: 'secondary',
};

export const CONTACT_TYPE_TITLES = {
  intervenor: 'Intervenor',
  petitioner: 'Petitioner',
  otherFilers: 'Petitioner',
  otherPetitioner: 'Petitioner',
  participant: 'Participant',
  primary: 'Petitioner',
  secondary: 'Petitioner',
};

export const PETITIONER_CONTACT_TYPES = [
  CONTACT_TYPES.primary,
  CONTACT_TYPES.secondary,
  CONTACT_TYPES.otherPetitioner,
];

export const COMMON_CITIES = [
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

export const SMALL_CITIES = [
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

export const TRIAL_CITIES = {
  ALL: SMALL_CITIES,
  REGULAR: COMMON_CITIES,
  SMALL: SMALL_CITIES,
};

export const LEGACY_TRIAL_CITIES = [
  { city: 'Biloxi', state: 'Mississippi' },
  { city: 'Huntington', state: 'West Virginia' },
  { city: 'Maui', state: 'Hawaii' },
  { city: 'Missoula', state: 'Montana' },
  { city: 'Newark', state: 'New Jersey' },
  { city: 'Pasadena', state: 'California' },
  { city: 'Tulsa', state: 'Oklahoma' },
  { city: 'Westbury', state: 'New York' },
];

export const TRIAL_CITY_STRINGS = SMALL_CITIES.map(
  trialLocation => `${trialLocation.city}, ${trialLocation.state}`,
);

export const LEGACY_TRIAL_CITY_STRINGS = LEGACY_TRIAL_CITIES.map(
  trialLocation => `${trialLocation.city}, ${trialLocation.state}`,
);

export const SESSION_TERMS = ['Winter', 'Fall', 'Spring', 'Summer'];

export const SESSION_TYPES = {
  regular: 'Regular',
  small: 'Small',
  hybrid: 'Hybrid',
  hybridSmall: 'Hybrid-S',
  special: 'Special',
  motionHearing: 'Motion/Hearing',
} as const;
const TRIAL_SESSION_TYPES = Object.values(SESSION_TYPES);
export type TrialSessionTypes = (typeof TRIAL_SESSION_TYPES)[number];

export const HYBRID_SESSION_TYPES = pick(SESSION_TYPES, [
  'hybrid',
  'hybridSmall',
]);

export const SESSION_STATUS_TYPES = {
  closed: 'Closed',
  new: 'New',
  open: 'Open',
};

export const SESSION_STATUS_GROUPS = {
  all: 'All',
  closed: SESSION_STATUS_TYPES.closed,
  new: SESSION_STATUS_TYPES.new,
  open: SESSION_STATUS_TYPES.open,
};

export const MAX_FILE_SIZE_MB = 250; // megabytes
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // bytes -> megabytes

export const ADC_SECTION = 'adc';
export const ADMISSIONS_SECTION = 'admissions';
export const CASE_SERVICES_SUPERVISOR_SECTION = 'caseServicesSupervisor';
export const CHAMBERS_SECTION = 'chambers';
export const CLERK_OF_COURT_SECTION = 'clerkofcourt';
export const DOCKET_SECTION = 'docket';
export const FLOATER_SECTION = 'floater';
export const IRS_SYSTEM_SECTION = 'irsSystem';
export const PETITIONS_SECTION = 'petitions';
export const REPORTERS_OFFICE_SECTION = 'reportersOffice';
export const TRIAL_CLERKS_SECTION = 'trialClerks';

export const SECTIONS = sortBy([
  ADC_SECTION,
  ADMISSIONS_SECTION,
  CASE_SERVICES_SUPERVISOR_SECTION,
  CHAMBERS_SECTION,
  CLERK_OF_COURT_SECTION,
  DOCKET_SECTION,
  FLOATER_SECTION,
  PETITIONS_SECTION,
  REPORTERS_OFFICE_SECTION,
  TRIAL_CLERKS_SECTION,
]);

export const TRIAL_STATUS_TYPES: TrialStatusOption = {
  basisReached: {
    deprecated: false,
    displayOrder: 1,
    label: 'Basis Reached',
  },
  probableSettlement: {
    deprecated: false,
    displayOrder: 3,
    label: 'Probable Settlement',
  },
  probableTrial: {
    deprecated: false,
    displayOrder: 5,
    label: 'Probable Trial',
  },
  definiteTrial: {
    deprecated: false,
    displayOrder: 7,
    label: 'Definite Trial',
  },
  motionToDismiss: {
    deprecated: false,
    displayOrder: 9,
    label: 'Motion',
  },
  recall: {
    deprecated: false,
    displayOrder: 2,
    label: 'Recall',
  },
  continued: {
    deprecated: false,
    displayOrder: 4,
    label: 'Continued',
  },
  rule122: {
    deprecated: false,
    displayOrder: 6,
    label: 'Rule 122',
  },
  submittedCAV: {
    deprecated: false,
    displayOrder: 8,
    label: 'Submitted/CAV',
  },
};
export const DEPRECATED_TRIAL_STATUS_TYPES: TrialStatusOption = {
  setForTrial: {
    deprecated: true,
    displayOrder: 999,
    label: 'Set for Trial',
  },
  dismissed: {
    deprecated: true,
    displayOrder: 999,
    label: 'Dismissed',
  },
  settled: {
    deprecated: true,
    displayOrder: 999,
    label: 'Settled',
  },
};
export const ALL_TRIAL_STATUS_TYPES: TrialStatusOption = {
  ...TRIAL_STATUS_TYPES,
  ...DEPRECATED_TRIAL_STATUS_TYPES,
};
export type TrialStatusOption = {
  [key: string]: {
    deprecated: boolean;
    displayOrder: number;
    label: string;
  };
};

export const SCAN_MODES = {
  DUPLEX: 'duplex',
  FEEDER: 'feeder',
  FLATBED: 'flatbed',
};

export const SCAN_MODE_LABELS = {
  DUPLEX: 'Double sided',
  FEEDER: 'Single sided',
  FLATBED: 'Flatbed',
};

export const EMPLOYER_OPTIONS = ['IRS', 'DOJ', 'Private'];

export const PRACTITIONER_TYPE_OPTIONS = ['Attorney', 'Non-Attorney'];

export const ADMISSIONS_STATUS_OPTIONS = [
  'Active',
  'Suspended',
  'Disbarred',
  'Resigned',
  'Deceased',
  'Inactive',
];

export const DEFAULT_PROCEDURE_TYPE = PROCEDURE_TYPES[0];

export const CASE_SEARCH_MIN_YEAR = 1986;
export const CASE_SEARCH_PAGE_SIZE = 25; // number of results returned for each page when searching for a case
export const CASE_INVENTORY_PAGE_SIZE = 25; // number of results returned for each page in the case inventory report
export const CASE_LIST_PAGE_SIZE = 20; // number of results returned for each page for the external user dashboard case list
export const DEADLINE_REPORT_PAGE_SIZE = 100; // number of results returned for each page for the case deadline report
export const TODAYS_ORDERS_PAGE_SIZE = 100; // number of results returned for each page for the today's orders page

// TODO: event codes need to be reorganized
export const ALL_EVENT_CODES = flatten([
  ...Object.values(DOCUMENT_EXTERNAL_CATEGORIES_MAP),
  ...Object.values(DOCUMENT_INTERNAL_CATEGORIES_MAP),
  ...Object.values(INITIAL_DOCUMENT_TYPES),
  ...Object.values(MINUTE_ENTRIES_MAP),
  ...Object.values(SYSTEM_GENERATED_DOCUMENT_TYPES),
])
  .map(item => item.eventCode)
  .concat(COURT_ISSUED_EVENT_CODES.map(item => item.eventCode))
  .sort();

export const ALL_DOCUMENT_TYPES_MAP = (() => {
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

export const ALL_DOCUMENT_TYPES = (() => {
  return ALL_DOCUMENT_TYPES_MAP.map(d => d.documentType)
    .filter(d => d)
    .sort();
})();

export const UNIQUE_OTHER_FILER_TYPE = 'Intervenor';
export const OTHER_FILER_TYPES = [
  UNIQUE_OTHER_FILER_TYPE,
  'Tax Matters Partner',
  'Partner Other Than Tax Matters Partner',
];

export const CASE_MESSAGE_DOCUMENT_ATTACHMENT_LIMIT = 5;

export const MESSAGE_QUEUE_TYPES = ['my', 'section'];

export const TRIAL_SESSION_ELIGIBLE_CASES_BUFFER = 50;

export const ADVANCED_SEARCH_TABS = {
  CASE: 'case',
  OPINION: 'opinion',
  ORDER: 'order',
  PRACTITIONER: 'practitioner',
};

export const DATE_RANGE_SEARCH_OPTIONS = {
  ALL_DATES: 'allDates',
  CUSTOM_DATES: 'customDates',
};

export const DOCKET_ENTRY_SEALED_TO_TYPES = {
  EXTERNAL: 'External', // Do not allow practitioners, petitioners, and irs practitioners to view the documents even when associated
  PUBLIC: 'Public', // associated privatePractitioners, irsPractitioner, petitioner can still view the docket entry if they are associated
};

export const ASCENDING: 'asc' = 'asc';
export const DESCENDING: 'desc' = 'desc';

export const CHRONOLOGICALLY_ASCENDING = 'Oldest to newest';
export const CHRONOLOGICALLY_DESCENDING = 'Newest to oldest';
export const ALPHABETICALLY_ASCENDING = 'In A-Z ascending order';
export const ALPHABETICALLY_DESCENDING = 'In Z-A descending order';

export const PRACTITIONER_DOCUMENT_TYPES_MAP = {
  APPLICATION_PACKAGE: 'Application Package',
  APPLICATION: 'Application',
  CERTIFICATE_OF_GOOD_STANDING: 'Certificate of Good Standing',
  FEE_RECEIPT: 'Fee Receipt',
  ADMISSIONS_CERTIFICATE: 'Admission Certificate',
  REFERENCE_INQUIRY: 'Reference Inquiry',
  RESPONSE_TO_REFERENCE_INQUIRY: 'Response to Reference Inquiry',
  DISCIPLINARY: 'Disciplinary',
  CHANGE_OF_NAME: 'Change of Name',
  EXAM_RELATED: 'Exam-Related',
  MISCELLANEOUS: 'Miscellaneous',
};

export const PRACTITIONER_DOCUMENT_TYPES = Object.values(
  PRACTITIONER_DOCUMENT_TYPES_MAP,
);

export const PENALTY_TYPES = {
  DETERMINATION_PENALTY_AMOUNT: 'determinationPenaltyAmount',
  IRS_PENALTY_AMOUNT: 'irsPenaltyAmount',
};

export const MAX_ELASTICSEARCH_PAGINATION = 10000;
export const MAX_SEARCH_CLIENT_RESULTS = 200;
export const MAX_SEARCH_RESULTS = 100;

export const isDocumentBriefType = (documentType: string) => {
  const documents = [
    ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Simultaneous Brief'],
    ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Seriatim Brief'],
  ];
  return !!documents.find(document => document.documentType === documentType)
    ?.eventCode;
};

export const JUDGE_TITLES = [
  'Judge',
  'Special Trial Judge',
  'Chief Special Trial Judge',
  'Chief Judge',
] as const;
export type JudgeTitle = (typeof JUDGE_TITLES)[number];

export type FileUploadProgressMapType = Record<string, FileUploadProgressType>;

export type FileUploadProgressType = {
  file: any;
  uploadProgress: (progressEvent: any) => void;
};

export type CreatedCaseType = {
  contactPrimary: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    countryType: string;
    name: string;
    paperPetitionEmail: string;
    phone: string;
    postalCode: string;
    state: string;
    email?: string;
  };
  caseType: string;
  caseCaption: string;
  attachmentToPetitionFileSize?: number;
  attachmentToPetitionFile: Blob;
  hasVerifiedIrsNotice: boolean;
  isPaper: boolean;
  mailingDate: string;
  orderDesignatingPlaceOfTrial?: boolean;
  orderForCds: boolean;
  stinFile?: Blob;
  stinFileSize?: number;
  orderForFilingFee: boolean;
  partyType: string;
  petitionFile: Blob;
  petitionFileSize: number;
  petitionPaymentStatus: string;
  procedureType: string;
  receivedAt: string;
  applicationForWaiverOfFilingFeeFile?: Blob;
  corporateDisclosureFile?: Blob;
  requestForPlaceOfTrialFile?: Blob;
  status: string;
  contactSecondary?: {
    name: string;
  };
};

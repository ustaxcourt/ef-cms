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

const DOCUMENT_NOTICE_EVENT_CODES = ['NOT'];
const DOCUMENT_CATEGORIES = Object.keys(documentMapExternal);
const DOCUMENT_CATEGORY_MAP = documentMapExternal;
const DOCUMENT_INTERNAL_CATEGORIES = Object.keys(documentMapInternal);
const DOCUMENT_INTERNAL_CATEGORY_MAP = documentMapInternal;
const COURT_ISSUED_EVENT_CODES = courtIssuedEventCodes;
const OPINION_DOCUMENT_TYPES = ['MOP', 'SOP', 'TCOP'];

module.exports = {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SUFFIXES,
  DOCUMENT_CATEGORIES,
  DOCUMENT_CATEGORY_MAP,
  DOCUMENT_INTERNAL_CATEGORIES,
  DOCUMENT_INTERNAL_CATEGORY_MAP,
  DOCUMENT_NOTICE_EVENT_CODES,
  DOCUMENT_RELATIONSHIPS,
  OPINION_DOCUMENT_TYPES,
  SERVICE_INDICATOR_TYPES,
  TRIAL_LOCATION_MATCHER,
};

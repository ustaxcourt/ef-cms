const SERVICE_INDICATOR_TYPES = {
  SI_ELECTRONIC: 'Electronic',
  SI_NONE: 'None',
  SI_PAPER: 'Paper',
};

exports.SERVICE_INDICATOR_TYPES = SERVICE_INDICATOR_TYPES;

exports.DOCKET_NUMBER_MATCHER = /^([1-9]\d{2,4}-\d{2})$/;

exports.TRIAL_LOCATION_MATCHER = /^[a-zA-Z ]+, [a-zA-Z ]+, [0-9]+$/;

exports.CHIEF_JUDGE = 'Chief Judge';

exports.DOCKET_NUMBER_SUFFIXES = ['W', 'P', 'X', 'R', 'SL', 'L', 'S'];

exports.CASE_STATUS_TYPES = {
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

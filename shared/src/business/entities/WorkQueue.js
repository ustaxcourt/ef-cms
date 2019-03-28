const { sortBy } = require('lodash');

exports.ADMISSIONS_SECTION = 'admissions';
exports.CALENDAR_SECTION = 'calendar';
exports.CHIEF_JUDGE_SECTION = 'chiefjudge';
exports.CLERK_OF_COURT_SECTION = 'clerkofcourt';
exports.DOCKET_SECTION = 'docket';
exports.IRS_BATCH_SYSTEM_SECTION = 'irsBatchSection';
exports.PETITIONS_SECTION = 'petitions';
exports.SENIOR_ATTORNEY_SECTION = 'seniorattorney';

exports.SECTIONS = sortBy([
  exports.ADMISSIONS_SECTION,
  exports.CALENDAR_SECTION,
  exports.CHIEF_JUDGE_SECTION,
  exports.CLERK_OF_COURT_SECTION,
  exports.DOCKET_SECTION,
  // intentially leavinvg out IRS_BATCH_SYSTEM_SECTION since that is an internal section
  exports.PETITIONS_SECTION,
  exports.SENIOR_ATTORNEY_SECTION,
]);

/**
 *
 * @param role
 * @returns {string}
 */
exports.getSectionForRole = role => {
  if (role === 'docketclerk') {
    return exports.DOCKET_SECTION;
  } else if (role === 'seniorattorney') {
    return exports.SENIOR_ATTORNEY_SECTION;
  } else if (role === 'petitionsclerk') {
    return exports.PETITIONS_SECTION;
  } else if (role === 'irsBatchSystem') {
    return exports.IRS_BATCH_SYSTEM_SECTION;
  }
};

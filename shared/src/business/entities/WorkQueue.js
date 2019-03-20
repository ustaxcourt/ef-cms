exports.DOCKET_SECTION = 'docket';
exports.PETITIONS_SECTION = 'petitions';
exports.CALENDAR_SECTION = 'calendar';
exports.ADMISSIONS_SECTION = 'admissions';
exports.SENIOR_ATTORNEY_SECTION = 'seniorattorney';
exports.CHIEF_JUDGE_SECTION = 'chiefjudge';
exports.CLERK_OF_COURT_SECTION = 'clerkofcourt';
exports.IRS_BATCH_SYSTEM_SECTION = 'irsBatchSection';

exports.SECTIONS = [
  exports.DOCKET_SECTION,
  exports.PETITIONS_SECTION,
  exports.CALENDAR_SECTION,
  exports.ADMISSIONS_SECTION,
  exports.SENIOR_ATTORNEY_SECTION,
  exports.CHIEF_JUDGE_SECTION,
  exports.CLERK_OF_COURT_SECTION,
  // intentially leavinvg out IRS_BATCH_SYSTEM_SECTION since that is an internal section
];

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

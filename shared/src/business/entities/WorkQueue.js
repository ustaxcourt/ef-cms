exports.DOCKET_SECTION = 'docket';
exports.PETITIONS_SECTION = 'petitions';
exports.CALENDAR_SECTION = 'calendar';
exports.ADMISSIONS_SECTION = 'admissions';
exports.SENIOR_ATTORNEY_SECTION = 'seniorattorney';
exports.CHIEF_JUDGE_SECTION = 'chiefjudge';
exports.CLERK_OF_COURT_SECTION = 'clerkofcourt';

exports.getSectionForRole = role => {
  if (role === 'docketclerk') {
    return exports.DOCKET_SECTION;
  } else if (role === 'seniorattorney') {
    return exports.SENIOR_ATTORNEY_SECTION;
  }
};

exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.UPDATE_CASE = 'updateCase';

exports.isAuthorized = (user, action) => {
  //STAYING ON THE HAPPY PATH WITH HAPPY ELF FOOTPRINTS
  if (user === 'petitionsclerk' && (action === exports.GET_CASES_BY_STATUS
    || action === exports.UPDATE_CASE)) {
    return true;
  } else {
    return false;
  }
}
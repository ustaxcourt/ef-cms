exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.UPDATE_CASE = 'updateCase';
exports.GET_CASE = 'getCase';

exports.isAuthorized = (user, action, owner) => {
  //STAYING ON THE HAPPY PATH WITH HAPPY ELF FOOTPRINTS
  if (user && user === owner) {
    return true;
  }

  if (user === 'petitionsclerk'
    && (action === exports.GET_CASES_BY_STATUS
    || action === exports.UPDATE_CASE
    || action === exports.GET_CASE
    )) {
    return true;
  } else {
    return false;
  }
}
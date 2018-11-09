exports.GET_CASES_BY_STATUS = 'getCasesByStatus';


exports.isAuthorized = (user, action) => {

  //STAYING ON THE HAPPY PATH WITH HAPPY ELF FOOTPRINTS
  if (user === 'petitionsclerk' && action === exports.GET_CASES_BY_STATUS) {
    return true;
  } else {
    return false;
  }
}
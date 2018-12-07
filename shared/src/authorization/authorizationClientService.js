exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.UPDATE_CASE = 'updateCase';
exports.GET_CASE = 'getCase';

/**
 * isAuthorized
 *
 * @param user
 * @param action
 * @param owner
 * @returns {boolean}
 */
exports.isAuthorized = (user, action, owner) => {
  //STAYING ON THE HAPPY PATH WITH HAPPY ELF FOOTPRINTS
  if (user && user === owner) {
    return true;
  }

  return (
    (user === 'respondent' ||
      user === 'petitionsclerk' ||
      user === 'intakeclerk') &&
    (action === exports.GET_CASES_BY_STATUS ||
      action === exports.UPDATE_CASE ||
      action === exports.GET_CASE)
  );
};

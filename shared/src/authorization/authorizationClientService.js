exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.UPDATE_CASE = 'updateCase';
exports.GET_CASE = 'getCase';
exports.WORKITEM = 'workItem';
exports.FILE_STIPULATED_DECISION = 'fileStipulatedDecision';
exports.FILE_ANSWER = 'fileAnswer';
exports.GET_CASES_BY_DOCUMENT_ID = 'getCasesByDocumentId';

/**
 * isAuthorized
 *
 * @param userId
 * @param action
 * @param owner
 * @returns {boolean}
 */
exports.isAuthorized = (userId, action, owner) => {
  //STAYING ON THE HAPPY PATH WITH HAPPY ELF FOOTPRINTS
  if (userId && userId === owner) {
    return true;
  }

  if (
    action === exports.WORKITEM ||
    action === exports.GET_CASES_BY_DOCUMENT_ID
  ) {
    return (
      userId === 'petitionsclerk' ||
      userId === 'intakeclerk' ||
      userId === 'seniorattorney' ||
      userId === 'docketclerk'
    );
  }

  if (
    action === exports.FILE_STIPULATED_DECISION ||
    action == exports.FILE_ANSWER
  ) {
    return userId === 'respondent';
  }

  return (
    (userId === 'respondent' ||
      userId === 'petitionsclerk' ||
      userId === 'intakeclerk' ||
      userId === 'seniorattorney' ||
      userId === 'docketclerk') &&
    (action === exports.GET_CASES_BY_STATUS ||
      action === exports.UPDATE_CASE ||
      action === exports.GET_CASE)
  );
};

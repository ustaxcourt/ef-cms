exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.UPDATE_CASE = 'updateCase';
exports.GET_CASE = 'getCase';
exports.WORKITEM = 'workItem';
exports.FILE_STIPULATED_DECISION = 'fileStipulatedDecision';
exports.FILE_ANSWER = 'fileAnswer';
exports.GET_CASES_BY_DOCUMENT_ID = 'getCasesByDocumentId';
exports.FILE_RESPONDENT_DOCUMENT = 'fileRespondentDocument';
exports.PETITION = 'getPetitionOptions';
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

  if (action === exports.PETITION) {
    return userId === 'taxpayer';
  }

  if (
    action === exports.WORKITEM ||
    action === exports.GET_CASES_BY_DOCUMENT_ID
  ) {
    return (
      userId.indexOf('petitionsclerk') > -1 ||
      userId.indexOf('intakeclerk') > -1 ||
      userId.indexOf('seniorattorney') > -1 ||
      userId.indexOf('docketclerk') > -1
    );
  }

  if (
    action === exports.FILE_STIPULATED_DECISION ||
    action == exports.FILE_ANSWER ||
    action == exports.FILE_RESPONDENT_DOCUMENT
  ) {
    return userId === 'respondent';
  }

  return (
    (userId === 'respondent' ||
      userId.indexOf('petitionsclerk') > -1 ||
      userId.indexOf('intakeclerk') > -1 ||
      userId.indexOf('seniorattorney') > -1 ||
      userId.indexOf('docketclerk') > -1) &&
    (action === exports.GET_CASES_BY_STATUS ||
      action === exports.UPDATE_CASE ||
      action === exports.GET_CASE ||
      action === exports.FILE_GENERIC_DOCUMENT)
  );
};

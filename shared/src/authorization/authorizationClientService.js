exports.CASE_METADATA = 'caseMetadata';
exports.FILE_ANSWER = 'fileAnswer';
exports.FILE_RESPONDENT_DOCUMENT = 'fileRespondentDocument';
exports.FILE_STIPULATED_DECISION = 'fileStipulatedDecision';
exports.GET_CASE = 'getCase';
exports.GET_CASES_BY_STATUS = 'getCasesByStatus';
exports.PETITION = 'getPetitionOptions';
exports.UPDATE_CASE = 'updateCase';
exports.WORKITEM = 'workItem';
exports.CREATE_USER = 'createUser';
exports.GET_USERS_IN_SECTIION = 'getUsersInSection';
exports.START_PAPER_CASE = 'startPaperCase';

const AUTHORIZATION_MAP = {
  admin: [exports.CREATE_USER],
  docketclerk: [
    exports.CASE_METADATA,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_CASES_BY_STATUS,
    exports.WORKITEM,
    exports.UPDATE_CASE,
    exports.GET_USERS_IN_SECTION,
    exports.START_PAPER_CASE,
  ],
  intakeclerk: [
    exports.CASE_METADATA,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_CASES_BY_STATUS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.GET_USERS_IN_SECTION,
  ],
  petitioner: [exports.PETITION],
  petitionsclerk: [
    exports.CASE_METADATA,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_CASES_BY_STATUS,
    exports.PETITION,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.GET_USERS_IN_SECTION,
    exports.START_PAPER_CASE,
  ],
  practitioner: [exports.PETITION],
  respondent: [
    exports.GET_CASE,
    exports.GET_CASES_BY_STATUS,
    exports.FILE_ANSWER,
    exports.FILE_RESPONDENT_DOCUMENT,
    exports.FILE_STIPULATED_DECISION,
    exports.UPDATE_CASE,
  ],
  seniorattorney: [
    exports.CASE_METADATA,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_CASES_BY_STATUS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.GET_USERS_IN_SECTION,
  ],
  taxpayer: [exports.PETITION],
};

/**
 *
 * @param userId
 * @param action
 * @param owner
 * @returns {boolean}
 */
exports.isAuthorized = (user, action, owner) => {
  if (user.userId && user.userId === owner) {
    return true;
  }

  const userRole = user.role;
  if (!AUTHORIZATION_MAP[userRole]) {
    return false;
  }

  const actionInRoleAuthorization =
    AUTHORIZATION_MAP[userRole].indexOf(action) > -1;
  return actionInRoleAuthorization;
};

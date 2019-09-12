exports.CASE_METADATA = 'caseMetadata';
exports.FILE_EXTERNAL_DOCUMENT = 'fileExternalDocument';
exports.GET_CASE = 'getCase';
exports.PETITION = 'getPetitionOptions';
exports.UPDATE_CASE = 'updateCase';
exports.WORKITEM = 'workItem';
exports.CREATE_USER = 'createUser';
exports.GET_USERS_IN_SECTIION = 'getUsersInSection';
exports.START_PAPER_CASE = 'startPaperCase';
exports.GET_READ_MESSAGES = 'getReadMessages';
exports.EDIT_COURT_ISSUED_ORDER = 'editCourtIssuedOrder';
exports.TRIAL_SESSIONS = 'trialSessions';
exports.TRIAL_SESSION_WORKING_COPY = 'trialSessionWorkingCopy';
exports.CREATE_COURT_ISSUED_ORDER = 'createCourtIssuedOrder';
exports.CASE_DEADLINE = 'CASE_DEADLINE';
exports.SERVE_DOCUMENT = 'SERVE_DOCUMENT';
exports.ASSOCIATE_USER_WITH_CASE = 'ASSOCIATE_USER_WITH_CASE';
exports.BATCH_DOWNLOAD_TRIAL_SESSION = 'BATCH_DOWNLOAD_TRIAL_SESSION';
exports.UPDATE_CONTACT_INFO = 'UPDATE_CONTACT_INFO';
exports.ARCHIVE_DOCUMENT = 'ARCHIVE_DOCUMENT';

const AUTHORIZATION_MAP = {
  admin: [exports.CREATE_USER],
  docketclerk: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.CREATE_COURT_ISSUED_ORDER,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
    exports.TRIAL_SESSIONS,
    exports.EDIT_COURT_ISSUED_ORDER,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.ARCHIVE_DOCUMENT,
  ],
  judge: [
    // TODO: review this list for accuracy!
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.CREATE_COURT_ISSUED_ORDER,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.EDIT_COURT_ISSUED_ORDER,
    exports.PETITION,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
    exports.TRIAL_SESSION_WORKING_COPY,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.BATCH_DOWNLOAD_TRIAL_SESSION,
    exports.ARCHIVE_DOCUMENT,
  ],
  petitioner: [exports.FILE_EXTERNAL_DOCUMENT, exports.PETITION],
  petitionsclerk: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_DEADLINE,
    exports.CASE_METADATA,
    exports.ARCHIVE_DOCUMENT,
    exports.CREATE_COURT_ISSUED_ORDER,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.GET_USERS_IN_SECTION,
    exports.PETITION,
    exports.START_PAPER_CASE,
    exports.EDIT_COURT_ISSUED_ORDER,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
  ],
  practitioner: [
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.PETITION,
    exports.UPDATE_CONTACT_INFO,
  ],
  respondent: [
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.UPDATE_CASE,
    exports.UPDATE_CONTACT_INFO,
  ],
  seniorattorney: [
    exports.ASSOCIATE_USER_WITH_CASE,
    exports.CASE_METADATA,
    exports.CREATE_COURT_ISSUED_ORDER,
    exports.GET_CASE,
    exports.GET_CASES_BY_DOCUMENT_ID,
    exports.GET_READ_MESSAGES,
    exports.EDIT_COURT_ISSUED_ORDER,
    exports.GET_USERS_IN_SECTION,
    exports.TRIAL_SESSIONS,
    exports.UPDATE_CASE,
    exports.WORKITEM,
    exports.ARCHIVE_DOCUMENT,
  ],
  taxpayer: [exports.PETITION],
};

/**
 * Checks user permissions for an action
 *
 * @param {object} user the user to check for authorization
 * @param {string} action the action to verify if the user is authorized for
 * @param {string} owner the user id of the owner of the item to verify
 * @returns {boolean} true if user is authorized, false otherwise
 */
exports.isAuthorized = (user, action, owner) => {
  if (user.userId && user.userId === owner) {
    return true;
  }

  const userRole = user.role;
  if (!AUTHORIZATION_MAP[userRole]) {
    return false;
  }

  const actionInRoleAuthorization = AUTHORIZATION_MAP[userRole].includes(
    action,
  );
  return actionInRoleAuthorization;
};

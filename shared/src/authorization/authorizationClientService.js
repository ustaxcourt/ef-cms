exports.ADD_CASE_TO_TRIAL_SESSION = 'ADD_CASE_TO_TRIAL_SESSION';
exports.ARCHIVE_DOCUMENT = 'ARCHIVE_DOCUMENT';
exports.ASSOCIATE_SELF_WITH_CASE = 'ASSOCIATE_SELF_WITH_CASE';
exports.ASSOCIATE_USER_WITH_CASE = 'ASSOCIATE_USER_WITH_CASE';
exports.BATCH_DOWNLOAD_TRIAL_SESSION = 'BATCH_DOWNLOAD_TRIAL_SESSION';
exports.BLOCK_CASE = 'BLOCK_CASE';
exports.CASE_DEADLINE = 'CASE_DEADLINE';
exports.CREATE_COURT_ISSUED_ORDER = 'CREATE_COURT_ISSUED_ORDER';
exports.CREATE_USER = 'CREATE_USER';
exports.DOCKET_ENTRY = 'DOCKET_ENTRY';
exports.EDIT_COURT_ISSUED_ORDER = 'EDIT_COURT_ISSUED_ORDER';
exports.FILE_EXTERNAL_DOCUMENT = 'FILE_EXTERNAL_DOCUMENT';
exports.GET_CASE = 'GET_CASE';
exports.GET_READ_MESSAGES = 'GET_READ_MESSAGES';
exports.GET_USERS_IN_SECTION = 'GET_USERS_IN_SECTION';
exports.PETITION = 'PETITION';
exports.PRIORITIZE_CASE = 'PRIORITIZE_CASE';
exports.SERVE_DOCUMENT = 'SERVE_DOCUMENT';
exports.START_PAPER_CASE = 'START_PAPER_CASE';
exports.TRIAL_SESSION_WORKING_COPY = 'TRIAL_SESSION_WORKING_COPY';
exports.TRIAL_SESSIONS = 'TRIAL_SESSIONS';
exports.UPDATE_CASE = 'UPDATE_CASE';
exports.UPDATE_CONTACT_INFO = 'UPDATE_CONTACT_INFO';
exports.UPLOAD_DOCUMENT = 'UPLOAD_DOCUMENT';
exports.VIEW_DOCUMENTS = 'VIEW_DOCUMENTS';
exports.WORKITEM = 'WORKITEM';

const allInternalUserPermissions = [
  exports.ADD_CASE_TO_TRIAL_SESSION,
  exports.ARCHIVE_DOCUMENT,
  exports.ASSOCIATE_USER_WITH_CASE,
  exports.BLOCK_CASE,
  exports.CASE_DEADLINE,
  exports.CREATE_COURT_ISSUED_ORDER,
  exports.EDIT_COURT_ISSUED_ORDER,
  exports.GET_CASE,
  exports.GET_CASES_BY_DOCUMENT_ID,
  exports.GET_READ_MESSAGES,
  exports.GET_USERS_IN_SECTION,
  exports.PRIORITIZE_CASE,
  exports.TRIAL_SESSIONS,
  exports.UPDATE_CASE,
  exports.UPLOAD_DOCUMENT,
  exports.VIEW_DOCUMENTS,
  exports.WORKITEM,
];

const AUTHORIZATION_MAP = {
  adc: allInternalUserPermissions,
  admin: [exports.CREATE_USER],
  admissionsclerk: allInternalUserPermissions,
  calendarclerk: allInternalUserPermissions,
  chambers: [
    ...allInternalUserPermissions,
    exports.BATCH_DOWNLOAD_TRIAL_SESSION,
    exports.TRIAL_SESSION_WORKING_COPY,
  ],
  clerkofcourt: [
    ...allInternalUserPermissions,
    exports.DOCKET_ENTRY,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
  ],
  docketclerk: [
    ...allInternalUserPermissions,
    exports.DOCKET_ENTRY,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
  ],
  judge: [
    ...allInternalUserPermissions,
    exports.BATCH_DOWNLOAD_TRIAL_SESSION,
    exports.TRIAL_SESSION_WORKING_COPY,
  ],
  petitioner: [
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.PETITION,
    exports.UPDATE_CONTACT_INFO,
    exports.UPLOAD_DOCUMENT,
    exports.VIEW_DOCUMENTS,
  ],
  petitionsclerk: [
    ...allInternalUserPermissions,
    exports.SERVE_DOCUMENT,
    exports.START_PAPER_CASE,
  ],
  practitioner: [
    exports.ASSOCIATE_SELF_WITH_CASE,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.PETITION,
    exports.UPDATE_CONTACT_INFO,
    exports.UPLOAD_DOCUMENT,
    exports.VIEW_DOCUMENTS,
  ],
  respondent: [
    exports.ASSOCIATE_SELF_WITH_CASE,
    exports.FILE_EXTERNAL_DOCUMENT,
    exports.GET_CASE,
    exports.UPDATE_CASE,
    exports.UPDATE_CONTACT_INFO,
    exports.UPLOAD_DOCUMENT,
    exports.VIEW_DOCUMENTS,
  ],
  trialclerk: allInternalUserPermissions,
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

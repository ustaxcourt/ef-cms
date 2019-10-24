import { state } from 'cerebral';

/**
 * sets the state.user to the users passed in.
 * This will also store the user into local storage.
 *
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.user
 * @param {object} providers.applicationContext the application context needed for getting the setCurrentUser method
 * @returns {Promise} async action
 *
 */
export const setUserPermissionsAction = async ({
  applicationContext,
  get,
  store,
}) => {
  console.log('in set permissions action');
  const user = get(state.user);
  const ROLE_PERMISSIONS = get(state.constants.ROLE_PERMISSIONS);
  const permissions = {
    ADD_CASE_TO_TRIAL_SESSION: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.ADD_CASE_TO_TRIAL_SESSION,
    ),
    ARCHIVE_DOCUMENT: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.ARCHIVE_DOCUMENT,
    ),
    ASSOCIATE_SELF_WITH_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.ASSOCIATE_SELF_WITH_CASE,
    ),
    ASSOCIATE_USER_WITH_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.ASSOCIATE_USER_WITH_CASE,
    ),
    BATCH_DOWNLOAD_TRIAL_SESSION: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.BATCH_DOWNLOAD_TRIAL_SESSION,
    ),
    BLOCK_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.BLOCK_CASE,
    ),
    CASE_DEADLINE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.CASE_DEADLINE,
    ),
    CREATE_COURT_ISSUED_ORDER: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.CREATE_COURT_ISSUED_ORDER,
    ),
    CREATE_USER: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.CREATE_USER,
    ),
    DOCKET_ENTRY: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.DOCKET_ENTRY,
    ),
    EDIT_COURT_ISSUED_ORDER: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.EDIT_COURT_ISSUED_ORDER,
    ),
    FILE_EXTERNAL_DOCUMENT: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT,
    ),
    GET_CASE: applicationContext.isAuthorized(user, ROLE_PERMISSIONS.GET_CASE),
    GET_READ_MESSAGES: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.GET_READ_MESSAGES,
    ),
    GET_USERS_IN_SECTION: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.GET_USERS_IN_SECTION,
    ),
    PETITION: applicationContext.isAuthorized(user, ROLE_PERMISSIONS.PETITION),
    PRIORITIZE_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.PRIORITIZE_CASE,
    ),
    SERVE_DOCUMENT: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.SERVE_DOCUMENT,
    ),
    START_PAPER_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.START_PAPER_CASE,
    ),
    TRIAL_SESSION_WORKING_COPY: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.TRIAL_SESSION_WORKING_COPY,
    ),
    TRIAL_SESSIONS: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.TRIAL_SESSIONS,
    ),
    UPDATE_CASE: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.UPDATE_CASE,
    ),
    UPDATE_CONTACT_INFO: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.UPDATE_CONTACT_INFO,
    ),
    UPLOAD_DOCUMENT: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.UPLOAD_DOCUMENT,
    ),
    VIEW_DOCUMENTS: applicationContext.isAuthorized(
      user,
      ROLE_PERMISSIONS.VIEW_DOCUMENTS,
    ),
    WORKITEM: applicationContext.isAuthorized(user, ROLE_PERMISSIONS.WORKITEM),
  };
  store.set(state.permissions, permissions);
};

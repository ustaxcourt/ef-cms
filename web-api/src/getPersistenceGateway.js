/* eslint-disable max-lines */
const {
  addCaseToHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/addCaseToHearing');
const {
  advancedDocumentSearch,
} = require('../../shared/src/persistence/elasticsearch/advancedDocumentSearch');
const {
  associateUserWithCase,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCase');
const {
  associateUserWithCasePending,
} = require('../../shared/src/persistence/dynamo/cases/associateUserWithCasePending');
const {
  bulkDeleteRecords,
} = require('../../shared/src/persistence/elasticsearch/bulkDeleteRecords');
const {
  bulkIndexRecords,
} = require('../../shared/src/persistence/elasticsearch/bulkIndexRecords');
const {
  caseAdvancedSearch,
} = require('../../shared/src/persistence/elasticsearch/caseAdvancedSearch');
const {
  casePublicSearch: casePublicSearchPersistence,
} = require('../../shared/src/persistence/elasticsearch/casePublicSearch');
const {
  confirmAuthCode,
} = require('../../shared/src/persistence/cognito/confirmAuthCode');
const {
  createCase,
} = require('../../shared/src/persistence/dynamo/cases/createCase');
const {
  createCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/createCaseDeadline');
const {
  createCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/createCaseTrialSortMappingRecords');
const {
  createJobStatus,
} = require('../../shared/src/persistence/dynamo/trialSessions/createJobStatus');
const {
  createMessage,
} = require('../../shared/src/persistence/dynamo/messages/createMessage');
const {
  createNewPetitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createNewPetitionerUser');
const {
  createNewPractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createNewPractitionerUser');
const {
  createOrUpdatePractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/createOrUpdatePractitionerUser');
const {
  createOrUpdateUser,
} = require('../../shared/src/persistence/dynamo/users/createOrUpdateUser');
const {
  createTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSession');
const {
  createTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/createTrialSessionWorkingCopy');
const {
  decrementJobCounter,
} = require('../../shared/src/persistence/dynamo/trialSessions/decrementJobCounter');
const {
  deleteCaseDeadline,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/deleteCaseDeadline');
const {
  deleteCaseTrialSortMappingRecords,
} = require('../../shared/src/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords');
const {
  deleteDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/deleteDocketEntry');
const {
  deleteDocumentFromS3,
} = require('../../shared/src/persistence/s3/deleteDocumentFromS3');
const {
  deleteKeyCount,
  getLimiterByKey,
  incrementKeyCount,
  setExpiresAt,
} = require('../../shared/src/persistence/dynamo/helpers/store');
const {
  deleteMessage,
} = require('../../shared/src/persistence/sqs/deleteMessage');
const {
  deleteRecord,
} = require('../../shared/src/persistence/elasticsearch/deleteRecord');
const {
  deleteTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/deleteTrialSession');
const {
  deleteTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy');
const {
  deleteUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/deleteUserCaseNote');
const {
  deleteUserConnection,
} = require('../../shared/src/persistence/dynamo/notifications/deleteUserConnection');
const {
  deleteUserFromCase,
} = require('../../shared/src/persistence/dynamo/cases/deleteUserFromCase');
const {
  deleteWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/deleteWorkItem');
const {
  fetchPendingItems,
} = require('../../shared/src/persistence/elasticsearch/fetchPendingItems');
const {
  getAllWebSocketConnections,
} = require('../../shared/src/persistence/dynamo/notifications/getAllWebSocketConnections');
const {
  getBlockedCases,
} = require('../../shared/src/persistence/elasticsearch/getBlockedCases');
const {
  getCalendaredCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession');
const {
  getCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCaseDeadlinesByDateRange,
} = require('../../shared/src/persistence/elasticsearch/caseDeadlines/getCaseDeadlinesByDateRange');
const {
  getCaseDeadlinesByDocketNumber,
} = require('../../shared/src/persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber');
const {
  getCaseInventoryReport,
} = require('../../shared/src/persistence/elasticsearch/getCaseInventoryReport');
const {
  getCaseMetadataWithCounsel,
} = require('../../shared/src/persistence/dynamo/cases/getCaseMetadataWithCounsel');
const {
  getCasesAssociatedWithUser,
  getDocketNumbersByUser,
} = require('../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser');
const {
  getCasesByDocketNumbers,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByDocketNumbers');
const {
  getCasesByLeadDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCasesByLeadDocketNumber');
const {
  getCasesByUserId,
} = require('../../shared/src/persistence/elasticsearch/getCasesByUserId');
const {
  getCasesForUser,
} = require('../../shared/src/persistence/dynamo/users/getCasesForUser');
const {
  getClientId,
} = require('../../shared/src/persistence/cognito/getClientId');
const {
  getCognitoUserIdByEmail,
} = require('../../shared/src/persistence/cognito/getCognitoUserIdByEmail');
const {
  getCompletedSectionInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getCompletedSectionInboxMessages');
const {
  getCompletedUserInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getCompletedUserInboxMessages');
const {
  getConfigurationItemValue,
} = require('../../shared/src/persistence/dynamo/deployTable/getConfigurationItemValue');
const {
  getDeployTableStatus,
} = require('../../shared/src/persistence/dynamo/getDeployTableStatus');
const {
  getDispatchNotification,
} = require('../../shared/src/persistence/dynamo/notifications/getDispatchNotification');
const {
  getDocketEntriesServedWithinTimeframe,
} = require('../../shared/src/persistence/elasticsearch/getDocketEntriesServedWithinTimeframe');
const {
  getDocumentIdFromSQSMessage,
} = require('../../shared/src/persistence/sqs/getDocumentIdFromSQSMessage');
const {
  getDocumentQCInboxForSection,
} = require('../../shared/src/persistence/elasticsearch/workitems/getDocumentQCInboxForSection');
const {
  getDocumentQCInboxForUser,
} = require('../../shared/src/persistence/elasticsearch/workitems/getDocumentQCInboxForUser');
const {
  getDocumentQCServedForSection,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForSection');
const {
  getDocumentQCServedForUser,
} = require('../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForUser');
const {
  getDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getDownloadPolicyUrl');
const {
  getEligibleCasesForTrialCity,
} = require('../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialCity');
const {
  getEligibleCasesForTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialSession');
const {
  getFeatureFlagValue,
} = require('../../shared/src/persistence/dynamo/deployTable/getFeatureFlagValue');
const {
  getFirstSingleCaseRecord,
} = require('../../shared/src/persistence/elasticsearch/getFirstSingleCaseRecord');
const {
  getInternalUsers,
} = require('../../shared/src/persistence/dynamo/users/getInternalUsers');
const {
  getMaintenanceMode,
} = require('../../shared/src/persistence/dynamo/deployTable/getMaintenanceMode');
const {
  getMessageById,
} = require('../../shared/src/persistence/dynamo/messages/getMessageById');
const {
  getMessagesByDocketNumber,
} = require('../../shared/src/persistence/dynamo/messages/getMessagesByDocketNumber');
const {
  getMessageThreadByParentId,
} = require('../../shared/src/persistence/dynamo/messages/getMessageThreadByParentId');
const {
  getPractitionerByBarNumber,
} = require('../../shared/src/persistence/dynamo/users/getPractitionerByBarNumber');
const {
  getPractitionersByName,
} = require('../../shared/src/persistence/elasticsearch/getPractitionersByName');
const {
  getPublicDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getPublicDownloadPolicyUrl');
const {
  getReadyForTrialCases,
} = require('../../shared/src/persistence/elasticsearch/getReadyForTrialCases');
const {
  getReconciliationReport,
} = require('../../shared/src/persistence/elasticsearch/getReconciliationReport');
const {
  getSectionInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getSectionInboxMessages');
const {
  getSectionOutboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getSectionOutboxMessages');
const {
  getSesStatus,
} = require('../../shared/src/persistence/ses/getSesStatus');
const {
  getTableStatus,
} = require('../../shared/src/persistence/dynamo/getTableStatus');
const {
  getTrialSessionById,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionById');
const {
  getTrialSessionJobStatusForCase,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionJobStatusForCase');
const {
  getTrialSessionProcessingStatus,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionProcessingStatus');
const {
  getTrialSessions,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessions');
const {
  getTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/getTrialSessionWorkingCopy');
const {
  getUploadPolicy,
} = require('../../shared/src/persistence/s3/getUploadPolicy');
const {
  getUserByEmail,
} = require('../../shared/src/persistence/dynamo/users/getUserByEmail');
const {
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUserCaseMappingsByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getUserCaseMappingsByDocketNumber');
const {
  getUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNote');
const {
  getUserCaseNoteForCases,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNoteForCases');
const {
  getUserInboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getUserInboxMessages');
const {
  getUserOutboxMessages,
} = require('../../shared/src/persistence/elasticsearch/messages/getUserOutboxMessages');
const {
  getUsersById,
} = require('../../shared/src/persistence/dynamo/users/getUsersById');
const {
  getUsersBySearchKey,
} = require('../../shared/src/persistence/dynamo/users/getUsersBySearchKey');
const {
  getUsersInSection,
} = require('../../shared/src/persistence/dynamo/users/getUsersInSection');
const {
  getWebSocketConnectionsByUserId,
} = require('../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionsByUserId');
const {
  getWorkItemById,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemById');
const {
  getWorkItemsByDocketNumber,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemsByDocketNumber');
const {
  getWorkItemsByWorkItemId,
} = require('../../shared/src/persistence/dynamo/workitems/getWorkItemsByWorkItemId');
const {
  incrementCounter,
} = require('../../shared/src/persistence/dynamo/helpers/incrementCounter');
const {
  isEmailAvailable,
} = require('../../shared/src/persistence/cognito/isEmailAvailable');
const {
  isFileExists,
} = require('../../shared/src/persistence/s3/isFileExists');
const {
  markMessageThreadRepliedTo,
} = require('../../shared/src/persistence/dynamo/messages/markMessageThreadRepliedTo');
const {
  persistUser,
} = require('../../shared/src/persistence/dynamo/users/persistUser');
const {
  putWorkItemInOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInOutbox');
const {
  putWorkItemInUsersOutbox,
} = require('../../shared/src/persistence/dynamo/workitems/putWorkItemInUsersOutbox');
const {
  refreshToken,
} = require('../../shared/src/persistence/cognito/refreshToken');
const {
  removeCaseFromHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/removeCaseFromHearing');
const {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} = require('../../shared/src/persistence/dynamo/cases/removePractitionerOnCase');
const {
  saveDispatchNotification,
} = require('../../shared/src/persistence/dynamo/notifications/saveDispatchNotification');
const {
  saveDocumentFromLambda,
} = require('../../shared/src/persistence/s3/saveDocumentFromLambda');
const {
  saveUserConnection,
} = require('../../shared/src/persistence/dynamo/notifications/saveUserConnection');
const {
  saveWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItem');
const {
  saveWorkItemForDocketClerkFilingExternalDocument,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument');
const {
  setMessageAsRead,
} = require('../../shared/src/persistence/dynamo/messages/setMessageAsRead');
const {
  setPriorityOnAllWorkItems,
} = require('../../shared/src/persistence/dynamo/workitems/setPriorityOnAllWorkItems');
const {
  setTrialSessionJobStatusForCase,
} = require('../../shared/src/persistence/dynamo/trialSessions/setTrialSessionJobStatusForCase');
const {
  setTrialSessionProcessingStatus,
} = require('../../shared/src/persistence/dynamo/trialSessions/setTrialSessionProcessingStatus');
const {
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseCorrespondence,
} = require('../../shared/src/persistence/dynamo/correspondence/updateCaseCorrespondence');
const {
  updateCaseHearing,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateCaseHearing');
const {
  updateDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntry');
const {
  updateDocketEntryPendingServiceStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntryPendingServiceStatus');
const {
  updateDocketEntryProcessingStatus,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntryProcessingStatus');
const {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} = require('../../shared/src/persistence/dynamo/cases/updatePractitionerOnCase');
const {
  updateMaintenanceMode,
} = require('../../shared/src/persistence/dynamo/deployTable/updateMaintenanceMode');
const {
  updateMessage,
} = require('../../shared/src/persistence/dynamo/messages/updateMessage');
const {
  updatePractitionerUser,
} = require('../../shared/src/persistence/dynamo/users/updatePractitionerUser');
const {
  updateTrialSession,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSession');
const {
  updateTrialSessionWorkingCopy,
} = require('../../shared/src/persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy');
const {
  updateUser,
} = require('../../shared/src/persistence/dynamo/users/updateUser');
const {
  updateUserCaseMapping,
} = require('../../shared/src/persistence/dynamo/cases/updateUserCaseMapping');
const {
  updateUserCaseNote,
} = require('../../shared/src/persistence/dynamo/userCaseNotes/updateUserCaseNote');
const {
  updateUserEmail,
} = require('../../shared/src/persistence/dynamo/users/updateUserEmail');
const {
  updateWorkItemAssociatedJudge,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemAssociatedJudge');
const {
  updateWorkItemCaseStatus,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemCaseStatus');
const {
  updateWorkItemCaseTitle,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemCaseTitle');
const {
  updateWorkItemDocketNumberSuffix,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemDocketNumberSuffix');
const {
  updateWorkItemTrialDate,
} = require('../../shared/src/persistence/dynamo/workitems/updateWorkItemTrialDate');
const {
  verifyCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyCaseForUser');
const {
  verifyPendingCaseForUser,
} = require('../../shared/src/persistence/dynamo/cases/verifyPendingCaseForUser');
const {
  zipDocuments,
} = require('../../shared/src/persistence/s3/zipDocuments');
const { getDocument } = require('../../shared/src/persistence/s3/getDocument');
const { getMessages } = require('../../shared/src/persistence/sqs/getMessages');

const isValidatedDecorator = persistenceGatewayMethods => {
  /**
   * Decorates the function to verify any entities passed have the isValid flag.
   * Should be used whenever a persistence method might be called by an interactor via lambda
   * when an entity's complete record is being created or updated.
   *
   * @returns {Function} the original methods decorated
   */
  function decorate(method) {
    return function () {
      const argumentsAsArray = Array.prototype.slice.call(arguments);

      argumentsAsArray.forEach(argument => {
        Object.keys(argument).forEach(key => {
          if (
            argument[key] &&
            argument[key].entityName &&
            !argument[key].isValidated
          ) {
            console.trace();
            throw new Error(
              `a entity of type ${argument[key].entityName} was not validated before passed to a persistence gateway method`,
            );
          }
        });
      });
      return method.apply(null, argumentsAsArray);
    };
  }

  Object.keys(persistenceGatewayMethods).forEach(key => {
    persistenceGatewayMethods[key] = decorate(persistenceGatewayMethods[key]);
  });
  return persistenceGatewayMethods;
};

const gatewayMethods = {
  ...isValidatedDecorator({
    addCaseToHearing,
    associateUserWithCase,
    associateUserWithCasePending,
    bulkDeleteRecords,
    bulkIndexRecords,
    createCase,
    createCaseDeadline,
    createCaseTrialSortMappingRecords,
    createJobStatus,
    createMessage,
    createNewPetitionerUser,
    createNewPractitionerUser,
    createOrUpdatePractitionerUser,
    createOrUpdateUser,
    createTrialSession,
    createTrialSessionWorkingCopy,
    deleteKeyCount,
    fetchPendingItems,
    getConfigurationItemValue,
    getFeatureFlagValue,
    getMaintenanceMode,
    getSesStatus,
    getTrialSessionJobStatusForCase,
    getTrialSessionProcessingStatus,
    incrementCounter,
    incrementKeyCount,
    markMessageThreadRepliedTo,
    persistUser,
    putWorkItemInOutbox,
    putWorkItemInUsersOutbox,
    removeCaseFromHearing,
    saveDispatchNotification,
    saveDocumentFromLambda,
    saveUserConnection,
    saveWorkItem,
    saveWorkItemForDocketClerkFilingExternalDocument,
    setExpiresAt,
    setMessageAsRead,
    setPriorityOnAllWorkItems,
    setTrialSessionJobStatusForCase,
    setTrialSessionProcessingStatus,
    updateCase,
    updateCaseCorrespondence,
    updateCaseHearing,
    updateDocketEntry,
    updateDocketEntryPendingServiceStatus,
    updateDocketEntryProcessingStatus,
    updateIrsPractitionerOnCase,
    updateMaintenanceMode,
    updateMessage,
    updatePractitionerUser,
    updatePrivatePractitionerOnCase,
    updateTrialSession,
    updateTrialSessionWorkingCopy,
    updateUser,
    updateUserCaseNote,
    updateUserEmail,
    updateWorkItemAssociatedJudge,
    updateWorkItemCaseStatus,
    updateWorkItemCaseTitle,
    updateWorkItemDocketNumberSuffix,
    updateWorkItemTrialDate,
  }),
  // methods below are not known to create or update "entity" records
  advancedDocumentSearch,
  caseAdvancedSearch,
  casePublicSearch: casePublicSearchPersistence,
  confirmAuthCode: process.env.IS_LOCAL
    ? (applicationContext, { code }) => {
        const jwt = require('jsonwebtoken');
        const { userMap } = require('../../shared/src/test/mockUserTokenMap');
        const user = {
          ...userMap[code],
          sub: userMap[code].userId,
        };
        const token = jwt.sign(user, 'secret');
        return {
          refreshToken: token,
          token,
        };
      }
    : confirmAuthCode,
  decrementJobCounter,
  deleteCaseDeadline,
  deleteCaseTrialSortMappingRecords,
  deleteDocketEntry,
  deleteDocumentFromS3,
  deleteMessage,
  deleteRecord,
  deleteTrialSession,
  deleteTrialSessionWorkingCopy,
  deleteUserCaseNote,
  deleteUserConnection,
  deleteUserFromCase,
  deleteWorkItem,
  getAllWebSocketConnections,
  getBlockedCases,
  getCalendaredCasesForTrialSession,
  getCaseByDocketNumber,
  getCaseDeadlinesByDateRange,
  getCaseDeadlinesByDocketNumber,
  getCaseInventoryReport,
  getCaseMetadataWithCounsel,
  getCasesAssociatedWithUser,
  getCasesByDocketNumbers,
  getCasesByLeadDocketNumber,
  getCasesByUserId,
  getCasesForUser,
  getClientId,
  getCognitoUserIdByEmail,
  getCompletedSectionInboxMessages,
  getCompletedUserInboxMessages,
  getDeployTableStatus,
  getDispatchNotification,
  getDocketEntriesServedWithinTimeframe,
  getDocketNumbersByUser,
  getDocument,
  getDocumentIdFromSQSMessage,
  getDocumentQCInboxForSection,
  getDocumentQCInboxForUser,
  getDocumentQCServedForSection,
  getDocumentQCServedForUser,
  getDownloadPolicyUrl,
  getEligibleCasesForTrialCity,
  getEligibleCasesForTrialSession,
  getFirstSingleCaseRecord,
  getInternalUsers,
  getLimiterByKey,
  getMessageById,
  getMessageThreadByParentId,
  getMessages,
  getMessagesByDocketNumber,
  getPractitionerByBarNumber,
  getPractitionersByName,
  getPublicDownloadPolicyUrl,
  getReadyForTrialCases,
  getReconciliationReport,
  getSectionInboxMessages,
  getSectionOutboxMessages,
  getTableStatus,
  getTrialSessionById,
  getTrialSessionWorkingCopy,
  getTrialSessions,
  getUploadPolicy,
  getUserByEmail,
  getUserById,
  getUserCaseMappingsByDocketNumber,
  getUserCaseNote,
  getUserCaseNoteForCases,
  getUserInboxMessages,
  getUserOutboxMessages,
  getUsersById,
  getUsersBySearchKey,
  getUsersInSection,
  getWebSocketConnectionsByUserId,
  getWorkItemById,
  getWorkItemsByDocketNumber,
  getWorkItemsByWorkItemId,
  isEmailAvailable,
  isFileExists,
  refreshToken: process.env.IS_LOCAL
    ? (applicationContext, { refreshToken: aRefreshToken }) => ({
        token: aRefreshToken,
      })
    : refreshToken,
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
  updateUserCaseMapping,
  verifyCaseForUser,
  verifyPendingCaseForUser,
  zipDocuments,
};

exports.getPersistenceGateway = () => gatewayMethods;

/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import {
  acquireLock,
  deleteLock,
} from '../../shared/src/persistence/dynamo/locks/acquireLock';
import { addCaseToHearing } from '../../shared/src/persistence/dynamo/trialSessions/addCaseToHearing';
import { advancedDocumentSearch } from '../../shared/src/persistence/elasticsearch/advancedDocumentSearch';
import { associateUserWithCase } from '../../shared/src/persistence/dynamo/cases/associateUserWithCase';
import { associateUserWithCasePending } from '../../shared/src/persistence/dynamo/cases/associateUserWithCasePending';
import { bulkDeleteRecords } from '../../shared/src/persistence/elasticsearch/bulkDeleteRecords';
import { bulkIndexRecords } from '../../shared/src/persistence/elasticsearch/bulkIndexRecords';
import { caseAdvancedSearch } from '../../shared/src/persistence/elasticsearch/caseAdvancedSearch';
import { casePublicSearch as casePublicSearchPersistence } from '../../shared/src/persistence/elasticsearch/casePublicSearch';
import { confirmAuthCode } from '../../shared/src/persistence/cognito/confirmAuthCode';
import { confirmAuthCodeLocal } from '../../shared/src/persistence/cognito/confirmAuthCodeLocal';
import { createCase } from '../../shared/src/persistence/dynamo/cases/createCase';
import { createCaseDeadline } from '../../shared/src/persistence/dynamo/caseDeadlines/createCaseDeadline';
import { createCaseTrialSortMappingRecords } from '../../shared/src/persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { createJobStatus } from '../../shared/src/persistence/dynamo/trialSessions/createJobStatus';
import { createMessage } from '../../shared/src/persistence/dynamo/messages/createMessage';
import { createNewPetitionerUser } from '../../shared/src/persistence/dynamo/users/createNewPetitionerUser';
import { createNewPractitionerUser } from '../../shared/src/persistence/dynamo/users/createNewPractitionerUser';
import { createOrUpdatePractitionerUser } from '../../shared/src/persistence/dynamo/users/createOrUpdatePractitionerUser';
import { createOrUpdateUser } from '../../shared/src/persistence/dynamo/users/createOrUpdateUser';
import { createPractitionerDocument } from '../../shared/src/persistence/dynamo/practitioners/createPractitionerDocument';
import { createTrialSession } from '../../shared/src/persistence/dynamo/trialSessions/createTrialSession';
import { createTrialSessionWorkingCopy } from '../../shared/src/persistence/dynamo/trialSessions/createTrialSessionWorkingCopy';
import { decrementJobCounter } from '../../shared/src/persistence/dynamo/trialSessions/decrementJobCounter';
import { deleteCaseDeadline } from '../../shared/src/persistence/dynamo/caseDeadlines/deleteCaseDeadline';
import { deleteCaseTrialSortMappingRecords } from '../../shared/src/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { deleteDocketEntry } from '../../shared/src/persistence/dynamo/documents/deleteDocketEntry';
import { deleteDocumentFile } from '../../shared/src/persistence/s3/deleteDocumentFile';
import {
  deleteKeyCount,
  getLimiterByKey,
  incrementKeyCount,
  setExpiresAt,
} from '../../shared/src/persistence/dynamo/helpers/store';
import { deleteMessage } from '../../shared/src/persistence/sqs/deleteMessage';
import { deletePractitionerDocument } from '../../shared/src/persistence/dynamo/practitioners/deletePractitionerDocument';
import { deleteRecord } from '../../shared/src/persistence/elasticsearch/deleteRecord';
import { deleteTrialSession } from '../../shared/src/persistence/dynamo/trialSessions/deleteTrialSession';
import { deleteTrialSessionWorkingCopy } from '../../shared/src/persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy';
import { deleteUserCaseNote } from '../../shared/src/persistence/dynamo/userCaseNotes/deleteUserCaseNote';
import { deleteUserConnection } from '../../shared/src/persistence/dynamo/notifications/deleteUserConnection';
import { deleteUserFromCase } from '../../shared/src/persistence/dynamo/cases/deleteUserFromCase';
import { deleteWorkItem } from '../../shared/src/persistence/dynamo/workitems/deleteWorkItem';
import { editPractitionerDocument } from '../../shared/src/persistence/dynamo/practitioners/editPractitionerDocument';
import { fetchPendingItems } from '../../shared/src/persistence/elasticsearch/fetchPendingItems';
import { getAllWebSocketConnections } from '../../shared/src/persistence/dynamo/notifications/getAllWebSocketConnections';
import { getBlockedCases } from '../../shared/src/persistence/elasticsearch/getBlockedCases';
import { getCalendaredCasesForTrialSession } from '../../shared/src/persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession';
import { getCaseByDocketNumber } from '../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber';
import { getCaseDeadlinesByDateRange } from '../../shared/src/persistence/elasticsearch/caseDeadlines/getCaseDeadlinesByDateRange';
import { getCaseDeadlinesByDocketNumber } from '../../shared/src/persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseInventoryReport } from '../../shared/src/persistence/elasticsearch/getCaseInventoryReport';
import { getCaseMetadataWithCounsel } from '../../shared/src/persistence/dynamo/cases/getCaseMetadataWithCounsel';
import {
  getCasesAssociatedWithUser,
  getDocketNumbersByUser,
} from '../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser';
import { getCasesByDocketNumbers } from '../../shared/src/persistence/dynamo/cases/getCasesByDocketNumbers';
import { getCasesByFilters } from '../../shared/src/persistence/elasticsearch/getCasesByFilters';
import { getCasesByLeadDocketNumber } from '../../shared/src/persistence/dynamo/cases/getCasesByLeadDocketNumber';
import { getCasesByUserId } from '../../shared/src/persistence/elasticsearch/getCasesByUserId';
import { getCasesClosedByJudge } from '../../shared/src/persistence/elasticsearch/getCasesClosedByJudge';
import { getCasesForUser } from '../../shared/src/persistence/dynamo/users/getCasesForUser';
import { getClientId } from '../../shared/src/persistence/cognito/getClientId';
import { getCognitoUserIdByEmail } from '../../shared/src/persistence/cognito/getCognitoUserIdByEmail';
import { getCompletedSectionInboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getCompletedSectionInboxMessages';
import { getCompletedUserInboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getCompletedUserInboxMessages';
import { getConfigurationItemValue } from '../../shared/src/persistence/dynamo/deployTable/getConfigurationItemValue';
import { getDeployTableStatus } from '../../shared/src/persistence/dynamo/getDeployTableStatus';
import { getDispatchNotification } from '../../shared/src/persistence/dynamo/notifications/getDispatchNotification';
import { getDocketEntriesServedWithinTimeframe } from '../../shared/src/persistence/elasticsearch/getDocketEntriesServedWithinTimeframe';
import { getDocument } from '../../shared/src/persistence/s3/getDocument';
import { getDocumentIdFromSQSMessage } from '../../shared/src/persistence/sqs/getDocumentIdFromSQSMessage';
import { getDocumentQCInboxForSection } from '../../shared/src/persistence/elasticsearch/workitems/getDocumentQCInboxForSection';
import { getDocumentQCInboxForUser } from '../../shared/src/persistence/dynamo/workitems/getDocumentQCInboxForUser';
import { getDocumentQCServedForSection } from '../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForSection';
import { getDocumentQCServedForUser } from '../../shared/src/persistence/dynamo/workitems/getDocumentQCServedForUser';
import { getDownloadPolicyUrl } from '../../shared/src/persistence/s3/getDownloadPolicyUrl';
import { getEligibleCasesForTrialCity } from '../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialCity';
import { getEligibleCasesForTrialSession } from '../../shared/src/persistence/dynamo/trialSessions/getEligibleCasesForTrialSession';
import { getFeatureFlagValue } from '../../shared/src/persistence/dynamo/deployTable/getFeatureFlagValue';
import { getFirstSingleCaseRecord } from '../../shared/src/persistence/elasticsearch/getFirstSingleCaseRecord';
import { getInternalUsers } from '../../shared/src/persistence/dynamo/users/getInternalUsers';
import { getMaintenanceMode } from '../../shared/src/persistence/dynamo/deployTable/getMaintenanceMode';
import { getMessageById } from '../../shared/src/persistence/dynamo/messages/getMessageById';
import { getMessageThreadByParentId } from '../../shared/src/persistence/dynamo/messages/getMessageThreadByParentId';
import { getMessages } from '../../shared/src/persistence/sqs/getMessages';
import { getMessagesByDocketNumber } from '../../shared/src/persistence/dynamo/messages/getMessagesByDocketNumber';
import { getPractitionerByBarNumber } from '../../shared/src/persistence/dynamo/users/getPractitionerByBarNumber';
import { getPractitionerDocumentByFileId } from '../../shared/src/persistence/dynamo/practitioners/getPractitionerDocumentByFileId';
import { getPractitionerDocuments } from '../../shared/src/persistence/dynamo/practitioners/getPractitionerDocuments';
import { getPractitionersByName } from '../../shared/src/persistence/elasticsearch/getPractitionersByName';
import { getPublicDownloadPolicyUrl } from '../../shared/src/persistence/s3/getPublicDownloadPolicyUrl';
import { getReadyForTrialCases } from '../../shared/src/persistence/elasticsearch/getReadyForTrialCases';
import { getReconciliationReport } from '../../shared/src/persistence/elasticsearch/getReconciliationReport';
import { getSectionInboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getSectionInboxMessages';
import { getSectionOutboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getSectionOutboxMessages';
import { getSesStatus } from '../../shared/src/persistence/ses/getSesStatus';
import { getTableStatus } from '../../shared/src/persistence/dynamo/getTableStatus';
import { getTrialSessionById } from '../../shared/src/persistence/dynamo/trialSessions/getTrialSessionById';
import { getTrialSessionJobStatusForCase } from '../../shared/src/persistence/dynamo/trialSessions/getTrialSessionJobStatusForCase';
import { getTrialSessionProcessingStatus } from '../../shared/src/persistence/dynamo/trialSessions/getTrialSessionProcessingStatus';
import { getTrialSessionWorkingCopy } from '../../shared/src/persistence/dynamo/trialSessions/getTrialSessionWorkingCopy';
import { getTrialSessions } from '../../shared/src/persistence/dynamo/trialSessions/getTrialSessions';
import { getUploadPolicy } from '../../shared/src/persistence/s3/getUploadPolicy';
import { getUserByEmail } from '../../shared/src/persistence/dynamo/users/getUserByEmail';
import { getUserById } from '../../shared/src/persistence/dynamo/users/getUserById';
import { getUserCaseMappingsByDocketNumber } from '../../shared/src/persistence/dynamo/cases/getUserCaseMappingsByDocketNumber';
import { getUserCaseNote } from '../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNote';
import { getUserCaseNoteForCases } from '../../shared/src/persistence/dynamo/userCaseNotes/getUserCaseNoteForCases';
import { getUserInboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getUserInboxMessages';
import { getUserOutboxMessages } from '../../shared/src/persistence/elasticsearch/messages/getUserOutboxMessages';
import { getUsersById } from '../../shared/src/persistence/dynamo/users/getUsersById';
import { getUsersBySearchKey } from '../../shared/src/persistence/dynamo/users/getUsersBySearchKey';
import { getUsersInSection } from '../../shared/src/persistence/dynamo/users/getUsersInSection';
import { getWebSocketConnectionsByUserId } from '../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionsByUserId';
import { getWorkItemById } from '../../shared/src/persistence/dynamo/workitems/getWorkItemById';
import { getWorkItemsByDocketNumber } from '../../shared/src/persistence/dynamo/workitems/getWorkItemsByDocketNumber';
import { getWorkItemsByWorkItemId } from '../../shared/src/persistence/dynamo/workitems/getWorkItemsByWorkItemId';
import { incrementCounter } from '../../shared/src/persistence/dynamo/helpers/incrementCounter';
import { isEmailAvailable } from '../../shared/src/persistence/cognito/isEmailAvailable';
import { isFileExists } from '../../shared/src/persistence/s3/isFileExists';
import { markMessageThreadRepliedTo } from '../../shared/src/persistence/dynamo/messages/markMessageThreadRepliedTo';
import { persistUser } from '../../shared/src/persistence/dynamo/users/persistUser';
import { putWorkItemInOutbox } from '../../shared/src/persistence/dynamo/workitems/putWorkItemInOutbox';
import { putWorkItemInUsersOutbox } from '../../shared/src/persistence/dynamo/workitems/putWorkItemInUsersOutbox';
import { refreshToken } from '../../shared/src/persistence/cognito/refreshToken';
import { removeCaseFromHearing } from '../../shared/src/persistence/dynamo/trialSessions/removeCaseFromHearing';
import {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} from '../../shared/src/persistence/dynamo/cases/removePractitionerOnCase';
import { saveDispatchNotification } from '../../shared/src/persistence/dynamo/notifications/saveDispatchNotification';
import { saveDocumentFromLambda } from '../../shared/src/persistence/s3/saveDocumentFromLambda';
import { saveUserConnection } from '../../shared/src/persistence/dynamo/notifications/saveUserConnection';
import { saveWorkItem } from '../../shared/src/persistence/dynamo/workitems/saveWorkItem';
import { saveWorkItemForDocketClerkFilingExternalDocument } from '../../shared/src/persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument';
import { setMessageAsRead } from '../../shared/src/persistence/dynamo/messages/setMessageAsRead';
import { setPriorityOnAllWorkItems } from '../../shared/src/persistence/dynamo/workitems/setPriorityOnAllWorkItems';
import { setTrialSessionJobStatusForCase } from '../../shared/src/persistence/dynamo/trialSessions/setTrialSessionJobStatusForCase';
import { setTrialSessionProcessingStatus } from '../../shared/src/persistence/dynamo/trialSessions/setTrialSessionProcessingStatus';
import { updateAttributeOnDynamoRecord } from '../../shared/src/persistence/dynamo/workitems/updateAttributeOnDynamoRecord';
import { updateCase } from '../../shared/src/persistence/dynamo/cases/updateCase';
import { updateCaseCorrespondence } from '../../shared/src/persistence/dynamo/correspondence/updateCaseCorrespondence';
import { updateCaseHearing } from '../../shared/src/persistence/dynamo/trialSessions/updateCaseHearing';
import { updateDocketEntry } from '../../shared/src/persistence/dynamo/documents/updateDocketEntry';
import { updateDocketEntryPendingServiceStatus } from '../../shared/src/persistence/dynamo/documents/updateDocketEntryPendingServiceStatus';
import { updateDocketEntryProcessingStatus } from '../../shared/src/persistence/dynamo/documents/updateDocketEntryProcessingStatus';
import {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} from '../../shared/src/persistence/dynamo/cases/updatePractitionerOnCase';
import { updateMaintenanceMode } from '../../shared/src/persistence/dynamo/deployTable/updateMaintenanceMode';
import { updateMessage } from '../../shared/src/persistence/dynamo/messages/updateMessage';
import { updatePractitionerUser } from '../../shared/src/persistence/dynamo/users/updatePractitionerUser';
import { updateTrialSession } from '../../shared/src/persistence/dynamo/trialSessions/updateTrialSession';
import { updateTrialSessionWorkingCopy } from '../../shared/src/persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy';
import { updateUser } from '../../shared/src/persistence/dynamo/users/updateUser';
import { updateUserCaseMapping } from '../../shared/src/persistence/dynamo/cases/updateUserCaseMapping';
import { updateUserCaseNote } from '../../shared/src/persistence/dynamo/userCaseNotes/updateUserCaseNote';
import { updateUserEmail } from '../../shared/src/persistence/dynamo/users/updateUserEmail';
import { updateUserRecords } from '../../shared/src/persistence/dynamo/users/updateUserRecords';
import { verifyCaseForUser } from '../../shared/src/persistence/dynamo/cases/verifyCaseForUser';
import { verifyPendingCaseForUser } from '../../shared/src/persistence/dynamo/cases/verifyPendingCaseForUser';
import { zipDocuments } from '../../shared/src/persistence/s3/zipDocuments';

const isValidatedDecorator = <T>(persistenceGatewayMethods: T): T => {
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
    createPractitionerDocument,
    createTrialSession,
    createTrialSessionWorkingCopy,
    deleteKeyCount,
    editPractitionerDocument,
    fetchPendingItems,
    getCasesClosedByJudge,
    getConfigurationItemValue,
    getFeatureFlagValue,
    getMaintenanceMode,
    getPractitionerDocumentByFileId,
    getPractitionerDocuments,
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
    updateAttributeOnDynamoRecord,
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
    updateUserRecords,
  }),
  // methods below are not known to create or update "entity" records
  acquireLock,
  advancedDocumentSearch,
  caseAdvancedSearch,
  casePublicSearch: casePublicSearchPersistence,
  confirmAuthCode: process.env.IS_LOCAL
    ? confirmAuthCodeLocal
    : confirmAuthCode,
  decrementJobCounter,
  deleteCaseDeadline,
  deleteCaseTrialSortMappingRecords,
  deleteDocketEntry,
  deleteDocumentFile,
  deleteLock,
  deleteMessage,
  deletePractitionerDocument,
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
  getCasesByFilters,
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

export const getPersistenceGateway = () => gatewayMethods;

type _IGetPersistenceGateway = typeof getPersistenceGateway;

declare global {
  interface IGetPersistenceGateway extends _IGetPersistenceGateway {}
}

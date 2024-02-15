/* eslint-disable no-unused-vars */
/* eslint-disable max-lines */
import { addCaseToHearing } from './persistence/dynamo/trialSessions/addCaseToHearing';
import { advancedDocumentSearch } from './persistence/elasticsearch/advancedDocumentSearch';
import { associateUserWithCase } from './persistence/dynamo/cases/associateUserWithCase';
import { associateUserWithCasePending } from './persistence/dynamo/cases/associateUserWithCasePending';
import { bulkDeleteRecords } from './persistence/elasticsearch/bulkDeleteRecords';
import { bulkIndexRecords } from './persistence/elasticsearch/bulkIndexRecords';
import { caseAdvancedSearch } from './persistence/elasticsearch/caseAdvancedSearch';
import { casePublicSearch as casePublicSearchPersistence } from './persistence/elasticsearch/casePublicSearch';
import { confirmAuthCode } from './persistence/cognito/confirmAuthCode';
import { confirmAuthCodeCognitoLocal } from '@web-api/persistence/cognito/confirmAuthCodeCognitoLocal';
import { confirmAuthCodeLocal } from './persistence/cognito/confirmAuthCodeLocal';
import { createCase } from './persistence/dynamo/cases/createCase';
import { createCaseDeadline } from './persistence/dynamo/caseDeadlines/createCaseDeadline';
import { createCaseTrialSortMappingRecords } from './persistence/dynamo/cases/createCaseTrialSortMappingRecords';
import { createChangeOfAddressJob } from './persistence/dynamo/jobs/ChangeOfAddress/createChangeOfAddressJob';
import { createJobStatus } from './persistence/dynamo/trialSessions/createJobStatus';
import {
  createLock,
  getLock,
  removeLock,
} from './persistence/dynamo/locks/acquireLock';
import { createNewPetitionerUser } from './persistence/dynamo/users/createNewPetitionerUser';
import { createNewPractitionerUser } from './persistence/dynamo/users/createNewPractitionerUser';
import { createOrUpdatePractitionerUser } from './persistence/dynamo/users/createOrUpdatePractitionerUser';
import { createOrUpdateUser } from './persistence/dynamo/users/createOrUpdateUser';
import { createPractitionerDocument } from './persistence/dynamo/practitioners/createPractitionerDocument';
import { createTrialSession } from './persistence/dynamo/trialSessions/createTrialSession';
import { createTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/createTrialSessionWorkingCopy';
import { decrementJobCounter } from './persistence/dynamo/trialSessions/decrementJobCounter';
import { deleteCaseDeadline } from './persistence/dynamo/caseDeadlines/deleteCaseDeadline';
import { deleteCaseTrialSortMappingRecords } from './persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { deleteDocketEntry } from './persistence/dynamo/documents/deleteDocketEntry';
import { deleteDocketEntryWorksheetRecord } from '@web-api/persistence/dynamo/pendingMotion/deleteDocketEntryWorksheetRecord';
import { deleteDocumentFile } from './persistence/s3/deleteDocumentFile';
import {
  deleteKeyCount,
  getLimiterByKey,
  incrementKeyCount,
  setExpiresAt,
} from './persistence/dynamo/helpers/store';
import { deleteMessage } from './persistence/sqs/deleteMessage';
import { deletePractitionerDocument } from './persistence/dynamo/practitioners/deletePractitionerDocument';
import { deleteRecord } from './persistence/elasticsearch/deleteRecord';
import { deleteTrialSession } from './persistence/dynamo/trialSessions/deleteTrialSession';
import { deleteTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy';
import { deleteUserCaseNote } from './persistence/dynamo/userCaseNotes/deleteUserCaseNote';
import { deleteUserConnection } from './persistence/dynamo/notifications/deleteUserConnection';
import { deleteUserFromCase } from './persistence/dynamo/cases/deleteUserFromCase';
import { deleteWorkItem } from './persistence/dynamo/workitems/deleteWorkItem';
import { editPractitionerDocument } from './persistence/dynamo/practitioners/editPractitionerDocument';
import { fetchEventCodesCountForJudges } from './persistence/elasticsearch/fetchEventCodesCountForJudges';
import { fetchPendingItems } from './persistence/elasticsearch/fetchPendingItems';
import { getAllPendingMotionDocketEntriesForJudge } from '@web-api/persistence/elasticsearch/docketEntry/getAllPendingMotionDocketEntriesForJudge';
import { getAllUsersByRole } from '@web-api/persistence/elasticsearch/users/getAllUsersByRole';
import { getAllWebSocketConnections } from './persistence/dynamo/notifications/getAllWebSocketConnections';
import { getBlockedCases } from './persistence/elasticsearch/getBlockedCases';
import { getCalendaredCasesForTrialSession } from './persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession';
import { getCaseByDocketNumber } from './persistence/dynamo/cases/getCaseByDocketNumber';
import { getCaseDeadlinesByDateRange } from './persistence/elasticsearch/caseDeadlines/getCaseDeadlinesByDateRange';
import { getCaseDeadlinesByDocketNumber } from './persistence/dynamo/caseDeadlines/getCaseDeadlinesByDocketNumber';
import { getCaseInventoryReport } from './persistence/elasticsearch/getCaseInventoryReport';
import { getCaseMetadataByDocketNumber } from './persistence/dynamo/cases/getCaseMetadataByDocketNumber';
import { getCaseMetadataWithCounsel } from './persistence/dynamo/cases/getCaseMetadataWithCounsel';
import { getCaseWorksheetsByDocketNumber } from '@web-api/persistence/dynamo/caseWorksheet/getCaseWorksheetsByDocketNumber';
import { getCasesByDocketNumbers } from './persistence/dynamo/cases/getCasesByDocketNumbers';
import { getCasesByFilters } from './persistence/elasticsearch/getCasesByFilters';
import { getCasesByLeadDocketNumber } from './persistence/dynamo/cases/getCasesByLeadDocketNumber';
import { getCasesByUserId } from './persistence/elasticsearch/getCasesByUserId';
import { getCasesClosedCountByJudge } from './persistence/elasticsearch/getCasesClosedCountByJudge';
import {
  getCasesForUser,
  getDocketNumbersByUser,
} from './persistence/dynamo/users/getCasesForUser';
import { getCasesMetadataByLeadDocketNumber } from './persistence/dynamo/cases/getCasesMetadataByLeadDocketNumber';
import { getClientId } from './persistence/cognito/getClientId';
import { getCognitoUserIdByEmail } from './persistence/cognito/getCognitoUserIdByEmail';
import { getCompletedSectionInboxMessages } from './persistence/elasticsearch/messages/getCompletedSectionInboxMessages';
import { getConfigurationItemValue } from './persistence/dynamo/deployTable/getConfigurationItemValue';
import { getConsolidatedCasesCount } from '@web-api/persistence/dynamo/cases/getConsolidatedCasesCount';
import { getCountOfConsolidatedCases } from '@web-api/persistence/elasticsearch/getCountOfConsolidatedCases';
import { getDeployTableStatus } from './persistence/dynamo/getDeployTableStatus';
import { getDispatchNotification } from './persistence/dynamo/notifications/getDispatchNotification';
import { getDocketEntriesServedWithinTimeframe } from './persistence/elasticsearch/getDocketEntriesServedWithinTimeframe';
import { getDocketEntryOnCase } from './persistence/dynamo/cases/getDocketEntryOnCase';
import { getDocketEntryWorksheetsByDocketEntryIds } from '@web-api/persistence/dynamo/docketEntryWorksheet/getDocketEntryWorksheetsByDocketEntryIds';
import { getDocketNumbersByStatusAndByJudge } from './persistence/elasticsearch/getDocketNumbersByStatusAndByJudge';
import { getDocument } from './persistence/s3/getDocument';
import { getDocumentIdFromSQSMessage } from './persistence/sqs/getDocumentIdFromSQSMessage';
import { getDocumentQCInboxForSection } from './persistence/elasticsearch/workitems/getDocumentQCInboxForSection';
import { getDocumentQCInboxForUser } from './persistence/dynamo/workitems/getDocumentQCInboxForUser';
import { getDocumentQCServedForSection } from './persistence/dynamo/workitems/getDocumentQCServedForSection';
import { getDocumentQCServedForUser } from './persistence/dynamo/workitems/getDocumentQCServedForUser';
import { getDownloadPolicyUrl } from './persistence/s3/getDownloadPolicyUrl';
import { getEligibleCasesForTrialCity } from './persistence/dynamo/trialSessions/getEligibleCasesForTrialCity';
import { getEligibleCasesForTrialSession } from './persistence/dynamo/trialSessions/getEligibleCasesForTrialSession';
import { getFeatureFlagValue } from './persistence/dynamo/deployTable/getFeatureFlagValue';
import { getFirstSingleCaseRecord } from './persistence/elasticsearch/getFirstSingleCaseRecord';
import { getInternalUsers } from './persistence/dynamo/users/getInternalUsers';
import { getMaintenanceMode } from './persistence/dynamo/deployTable/getMaintenanceMode';
import { getMessageById } from './persistence/dynamo/messages/getMessageById';
import { getMessageThreadByParentId } from './persistence/dynamo/messages/getMessageThreadByParentId';
import { getMessages } from './persistence/sqs/getMessages';
import { getMessagesByDocketNumber } from './persistence/dynamo/messages/getMessagesByDocketNumber';
import { getPractitionerByBarNumber } from './persistence/dynamo/users/getPractitionerByBarNumber';
import { getPractitionerDocumentByFileId } from './persistence/dynamo/practitioners/getPractitionerDocumentByFileId';
import { getPractitionerDocuments } from './persistence/dynamo/practitioners/getPractitionerDocuments';
import { getPractitionersByName } from './persistence/elasticsearch/getPractitionersByName';
import { getPublicDownloadPolicyUrl } from './persistence/s3/getPublicDownloadPolicyUrl';
import { getReadyForTrialCases } from './persistence/elasticsearch/getReadyForTrialCases';
import { getReconciliationReport } from './persistence/elasticsearch/getReconciliationReport';
import { getSectionInboxMessages } from './persistence/elasticsearch/messages/getSectionInboxMessages';
import { getSectionOutboxMessages } from './persistence/elasticsearch/messages/getSectionOutboxMessages';
import { getSesStatus } from './persistence/ses/getSesStatus';
import { getStoredApplicationHealth } from '@web-api/persistence/dynamo/deployTable/getStoredApplicationHealth';
import { getTableStatus } from './persistence/dynamo/getTableStatus';
import { getTrialSessionById } from './persistence/dynamo/trialSessions/getTrialSessionById';
import { getTrialSessionJobStatusForCase } from './persistence/dynamo/trialSessions/getTrialSessionJobStatusForCase';
import { getTrialSessionProcessingStatus } from './persistence/dynamo/trialSessions/getTrialSessionProcessingStatus';
import { getTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/getTrialSessionWorkingCopy';
import { getTrialSessions } from './persistence/dynamo/trialSessions/getTrialSessions';
import { getUploadPolicy } from './persistence/s3/getUploadPolicy';
import { getUserByEmail } from './persistence/dynamo/users/getUserByEmail';
import { getUserById } from './persistence/dynamo/users/getUserById';
import { getUserCaseNote } from './persistence/dynamo/userCaseNotes/getUserCaseNote';
import { getUserCaseNoteForCases } from './persistence/dynamo/userCaseNotes/getUserCaseNoteForCases';
import { getUserCompletedMessages } from './persistence/elasticsearch/messages/getUserCompletedMessages';
import {
  getUserInboxMessageCount,
  getUserInboxMessages,
} from './persistence/elasticsearch/messages/getUserInboxMessages';
import { getUserOutboxMessages } from './persistence/elasticsearch/messages/getUserOutboxMessages';
import { getUsersById } from './persistence/dynamo/users/getUsersById';
import { getUsersBySearchKey } from './persistence/dynamo/users/getUsersBySearchKey';
import { getUsersInSection } from './persistence/dynamo/users/getUsersInSection';
import { getWebSocketConnectionsByUserId } from './persistence/dynamo/notifications/getWebSocketConnectionsByUserId';
import { getWorkItemById } from './persistence/dynamo/workitems/getWorkItemById';
import { getWorkItemsByDocketNumber } from './persistence/dynamo/workitems/getWorkItemsByDocketNumber';
import { getWorkItemsByWorkItemId } from './persistence/dynamo/workitems/getWorkItemsByWorkItemId';
import { incrementCounter } from './persistence/dynamo/helpers/incrementCounter';
import { isEmailAvailable } from './persistence/cognito/isEmailAvailable';
import { isFileExists } from './persistence/s3/isFileExists';
import { markMessageThreadRepliedTo } from './persistence/dynamo/messages/markMessageThreadRepliedTo';
import { persistUser } from './persistence/dynamo/users/persistUser';
import { putWorkItemInOutbox } from './persistence/dynamo/workitems/putWorkItemInOutbox';
import { putWorkItemInUsersOutbox } from './persistence/dynamo/workitems/putWorkItemInUsersOutbox';
import { refreshToken } from './persistence/cognito/refreshToken';
import { removeCaseFromHearing } from './persistence/dynamo/trialSessions/removeCaseFromHearing';
import {
  removeIrsPractitionerOnCase,
  removePrivatePractitionerOnCase,
} from './persistence/dynamo/cases/removePractitionerOnCase';
import { saveDispatchNotification } from './persistence/dynamo/notifications/saveDispatchNotification';
import { saveDocumentFromLambda } from './persistence/s3/saveDocumentFromLambda';
import { saveUserConnection } from './persistence/dynamo/notifications/saveUserConnection';
import { saveWorkItem } from './persistence/dynamo/workitems/saveWorkItem';
import { saveWorkItemForDocketClerkFilingExternalDocument } from './persistence/dynamo/workitems/saveWorkItemForDocketClerkFilingExternalDocument';
import { setChangeOfAddressCaseAsDone } from './persistence/dynamo/jobs/ChangeOfAddress/setChangeOfAddressCaseAsDone';
import { setMessageAsRead } from './persistence/dynamo/messages/setMessageAsRead';
import { setPriorityOnAllWorkItems } from './persistence/dynamo/workitems/setPriorityOnAllWorkItems';
import { setStoredApplicationHealth } from '@web-api/persistence/dynamo/deployTable/setStoredApplicationHealth';
import { setTrialSessionJobStatusForCase } from './persistence/dynamo/trialSessions/setTrialSessionJobStatusForCase';
import { setTrialSessionProcessingStatus } from './persistence/dynamo/trialSessions/setTrialSessionProcessingStatus';
import { updateCase } from './persistence/dynamo/cases/updateCase';
import { updateCaseCorrespondence } from './persistence/dynamo/correspondence/updateCaseCorrespondence';
import { updateCaseHearing } from './persistence/dynamo/trialSessions/updateCaseHearing';
import { updateCaseWorksheet } from '@web-api/persistence/dynamo/caseWorksheet/updateCaseWorksheet';
import { updateDocketEntry } from './persistence/dynamo/documents/updateDocketEntry';
import { updateDocketEntryPendingServiceStatus } from './persistence/dynamo/documents/updateDocketEntryPendingServiceStatus';
import { updateDocketEntryProcessingStatus } from './persistence/dynamo/documents/updateDocketEntryProcessingStatus';
import { updateDocketEntryWorksheet } from '@web-api/persistence/dynamo/pendingMotion/updateDocketEntryWorksheet';
import {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} from './persistence/dynamo/cases/updatePractitionerOnCase';
import { updateMaintenanceMode } from './persistence/dynamo/deployTable/updateMaintenanceMode';
import { updatePractitionerUser } from './persistence/dynamo/users/updatePractitionerUser';
import { updateTrialSession } from './persistence/dynamo/trialSessions/updateTrialSession';
import { updateTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy';
import { updateUser } from './persistence/dynamo/users/updateUser';
import { updateUserCaseNote } from './persistence/dynamo/userCaseNotes/updateUserCaseNote';
import { updateUserEmail } from './persistence/dynamo/users/updateUserEmail';
import { updateUserRecords } from './persistence/dynamo/users/updateUserRecords';
import { upsertMessage } from './persistence/dynamo/messages/upsertMessage';
import { verifyCaseForUser } from './persistence/dynamo/cases/verifyCaseForUser';
import { verifyPendingCaseForUser } from './persistence/dynamo/cases/verifyPendingCaseForUser';
import { zipDocuments } from './persistence/s3/zipDocuments';

const isValidatedDecorator = <T>(persistenceGatewayMethods: T): T => {
  /**
   * Decorates the function to verify any entities passed have the isValid flag.
   * Should be used whenever a persistence method might be called by an interactor via lambda
   * when an entity's complete record is being created or updated.
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

  Object.keys(persistenceGatewayMethods as object).forEach(key => {
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
    updateCaseWorksheet,
    updateDocketEntry,
    updateDocketEntryPendingServiceStatus,
    updateDocketEntryProcessingStatus,
    updateDocketEntryWorksheet,
    updateIrsPractitionerOnCase,
    updateMaintenanceMode,
    updatePractitionerUser,
    updatePrivatePractitionerOnCase,
    updateTrialSession,
    updateTrialSessionWorkingCopy,
    updateUser,
    updateUserCaseNote,
    updateUserEmail,
    updateUserRecords,
    upsertMessage,
  }),
  // methods below are not known to create or update "entity" records
  advancedDocumentSearch,
  caseAdvancedSearch,
  casePublicSearch: casePublicSearchPersistence,
  confirmAuthCode: process.env.IS_LOCAL
    ? process.env.USE_COGNITO_LOCAL
      ? confirmAuthCodeCognitoLocal
      : confirmAuthCodeLocal
    : confirmAuthCode,
  createChangeOfAddressJob,
  createLock,
  decrementJobCounter,
  deleteCaseDeadline,
  deleteCaseTrialSortMappingRecords,
  deleteDocketEntry,
  deleteDocketEntryWorksheetRecord,
  deleteDocumentFile,
  deleteMessage,
  deletePractitionerDocument,
  deleteRecord,
  deleteTrialSession,
  deleteTrialSessionWorkingCopy,
  deleteUserCaseNote,
  deleteUserConnection,
  deleteUserFromCase,
  deleteWorkItem,
  fetchEventCodesCountForJudges,
  getAllPendingMotionDocketEntriesForJudge,
  getAllUsersByRole,
  getAllWebSocketConnections,
  getBlockedCases,
  getCalendaredCasesForTrialSession,
  getCaseByDocketNumber,
  getCaseDeadlinesByDateRange,
  getCaseDeadlinesByDocketNumber,
  getCaseInventoryReport,
  getCaseMetadataByDocketNumber,
  getCaseMetadataWithCounsel,
  getCaseWorksheetsByDocketNumber,
  getCasesByDocketNumbers,
  getCasesByFilters,
  getCasesByLeadDocketNumber,
  getCasesByUserId,
  getCasesClosedCountByJudge,
  getCasesForUser,
  getCasesMetadataByLeadDocketNumber,
  getClientId,
  getCognitoUserIdByEmail,
  getCompletedSectionInboxMessages,
  getConfigurationItemValue,
  getConsolidatedCasesCount,
  getCountOfConsolidatedCases,
  getDeployTableStatus,
  getDispatchNotification,
  getDocketEntriesServedWithinTimeframe,
  getDocketEntryOnCase,
  getDocketEntryWorksheetsByDocketEntryIds,
  getDocketNumbersByStatusAndByJudge,
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
  getFeatureFlagValue,
  getFirstSingleCaseRecord,
  getInternalUsers,
  getLimiterByKey,
  getLock,
  getMaintenanceMode,
  getMessageById,
  getMessageThreadByParentId,
  getMessages,
  getMessagesByDocketNumber,
  getPractitionerByBarNumber,
  getPractitionerDocumentByFileId,
  getPractitionerDocuments,
  getPractitionersByName,
  getPublicDownloadPolicyUrl,
  getReadyForTrialCases,
  getReconciliationReport,
  getSectionInboxMessages,
  getSectionOutboxMessages,
  getSesStatus,
  getStoredApplicationHealth,
  getTableStatus,
  getTrialSessionById,
  getTrialSessionJobStatusForCase,
  getTrialSessionProcessingStatus,
  getTrialSessionWorkingCopy,
  getTrialSessions,
  getUploadPolicy,
  getUserByEmail,
  getUserById,
  getUserCaseNote,
  getUserCaseNoteForCases,
  getUserCompletedMessages,
  getUserInboxMessageCount,
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
  removeLock,
  removePrivatePractitionerOnCase,
  setChangeOfAddressCaseAsDone,
  setStoredApplicationHealth,
  verifyCaseForUser,
  verifyPendingCaseForUser,
  zipDocuments,
};

export const getPersistenceGateway = () => gatewayMethods;

type _IGetPersistenceGateway = typeof getPersistenceGateway;

declare global {
  interface IGetPersistenceGateway extends _IGetPersistenceGateway {}
}

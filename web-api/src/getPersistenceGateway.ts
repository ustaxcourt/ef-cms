import { addCaseToHearing } from './persistence/dynamo/trialSessions/addCaseToHearing';
import { advancedDocumentSearch } from './persistence/elasticsearch/advancedDocumentSearch';
import { bulkDeleteRecords } from './persistence/elasticsearch/bulkDeleteRecords';
import { bulkIndexRecords } from './persistence/elasticsearch/bulkIndexRecords';
import { createChangeOfAddressJob } from './persistence/postgres/jobs/changeOfAddress/createChangeOfAddressJob';
import { createJobStatus } from './persistence/dynamo/trialSessions/createJobStatus';
import { createNewPetitionerUser } from './persistence/dynamo/users/createNewPetitionerUser';
import { createPractitionerDocument } from './persistence/dynamo/practitioners/createPractitionerDocument';
import { createTrialSession } from './persistence/dynamo/trialSessions/createTrialSession';
import { createTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/createTrialSessionWorkingCopy';
import { decrementJobCounter } from './persistence/dynamo/trialSessions/decrementJobCounter';
import { deleteDocumentFile } from './persistence/s3/deleteDocumentFile';
import { deleteMessage } from './persistence/sqs/deleteMessage';
import { deletePractitionerDocument } from './persistence/dynamo/practitioners/deletePractitionerDocument';
import { deleteRecord } from './persistence/elasticsearch/deleteRecord';
import { deleteTrialSession } from './persistence/dynamo/trialSessions/deleteTrialSession';
import { deleteTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy';
import { deleteUserConnection } from '@web-api/persistence/postgres/connections/deleteUserConnection';
import { editPractitionerDocument } from './persistence/dynamo/practitioners/editPractitionerDocument';
import { fetchEventCodesCountForJudges } from './persistence/elasticsearch/fetchEventCodesCountForJudges';
import { getAllUsersByRole } from '@web-api/persistence/elasticsearch/users/getAllUsersByRole';
import { getAllWebSocketConnections } from '@web-api/persistence/postgres/connections/getAllWebSocketConnections';
import { getBulkTrialSessionWorkingCopies } from './persistence/dynamo/trialSessions/getBulkTrialSessionWorkingCopies';
import { getCalendaredCasesForTrialSession } from './persistence/dynamo/trialSessions/getCalendaredCasesForTrialSession';
import { getCasesByEmailTotal } from '@web-api/persistence/elasticsearch/getCasesByEmailTotal';
import { getClientId } from './persistence/cognito/getClientId';
import { getConfigurationItemValue } from './persistence/dynamo/deployTable/getConfigurationItemValue';
import { getDeployTableStatus } from './persistence/dynamo/getDeployTableStatus';
import { getDispatchNotification } from './persistence/postgres/notifications/getDispatchNotification';
import { getDocketEntriesServedWithinTimeframe } from './persistence/elasticsearch/getDocketEntriesServedWithinTimeframe';
import { getDocument } from './persistence/s3/getDocument';
import { getDocumentIdFromSQSMessage } from './persistence/sqs/getDocumentIdFromSQSMessage';
import { getDownloadPolicyUrl } from './persistence/s3/getDownloadPolicyUrl';
import { getEligibleCasesForTrialCity } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
import { getFeatureFlagValue } from './persistence/dynamo/deployTable/getFeatureFlagValue';
import { getMaintenanceMode } from './persistence/dynamo/deployTable/getMaintenanceMode';
import { getPractitionerDocumentByFileId } from './persistence/dynamo/practitioners/getPractitionerDocumentByFileId';
import { getPractitionerDocuments } from './persistence/dynamo/practitioners/getPractitionerDocuments';
import { getPractitionersByName } from './persistence/elasticsearch/getPractitionersByName';
import { getReconciliationReport } from './persistence/elasticsearch/getReconciliationReport';
import { getRequestResults } from '@web-api/persistence/dynamo/polling/getRequestResults';
import { getSesStatus } from './persistence/ses/getSesStatus';
import { getColdCases } from './persistence/elasticsearch/getColdCases';
import { getTableStatus } from './persistence/dynamo/getTableStatus';
import { getTrialSessionById } from './persistence/dynamo/trialSessions/getTrialSessionById';
import { getTrialSessionJobStatusForCase } from './persistence/dynamo/trialSessions/getTrialSessionJobStatusForCase';
import { getTrialSessionProcessingStatus } from './persistence/dynamo/trialSessions/getTrialSessionProcessingStatus';
import { getTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/getTrialSessionWorkingCopy';
import { getTrialSessions } from './persistence/dynamo/trialSessions/getTrialSessions';
import { getUploadPolicy } from './persistence/s3/getUploadPolicy';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getWebSocketConnectionsByUserId } from '@web-api/persistence/postgres/connections/getWebSocketConnectionsByUserId';
import { incrementCounter } from './persistence/dynamo/helpers/incrementCounter';
import { isEmailAvailable } from './persistence/cognito/isEmailAvailable';
import { isFileExists } from './persistence/s3/isFileExists';
import { removeCaseFromHearing } from './persistence/dynamo/trialSessions/removeCaseFromHearing';
import { saveDispatchNotification } from '@web-api/persistence/postgres/notifications/saveDispatchNotification';
import { saveDocumentFromLambda } from './persistence/s3/saveDocumentFromLambda';
import { saveUserConnection } from '@web-api/persistence/postgres/connections/saveUserConnection';
import { setChangeOfAddressCaseAsDone } from './persistence/postgres/jobs/changeOfAddress/setChangeOfAddressCaseAsDone';
import { setTrialSessionJobStatusForCase } from './persistence/dynamo/trialSessions/setTrialSessionJobStatusForCase';
import { setTrialSessionProcessingStatus } from './persistence/dynamo/trialSessions/setTrialSessionProcessingStatus';
import { updateCaseHearing } from './persistence/dynamo/trialSessions/updateCaseHearing';
import { updateMaintenanceMode } from './persistence/dynamo/deployTable/updateMaintenanceMode';
import { updatePractitionerUser } from './business/useCaseHelper/users/updatePractitionerUser';
import { updateTrialSession } from './persistence/dynamo/trialSessions/updateTrialSession';
import { updateTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy';
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';
import { zipDocuments } from './persistence/s3/zipDocuments';
import { getEligibleCasesForTrialSession } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialSession';

const isValidatedDecorator = <T>(persistenceGatewayMethods: T): T => {
  /**
   * Decorates the function to verify any entities passed have the isValid flag.
   * Should be used whenever a persistence method might be called by an interactor via lambda
   * when an entity's complete record is being created or updated.
   * @returns {Function} the original methods decorated
   */
  function decorate(method) {
    return function () {
      // eslint-disable-next-line prefer-rest-params
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
      // eslint-disable-next-line prefer-spread
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
    bulkDeleteRecords,
    bulkIndexRecords,
    createJobStatus,
    createNewPetitionerUser,
    createPractitionerDocument,
    createTrialSession,
    createTrialSessionWorkingCopy,
    editPractitionerDocument,
    incrementCounter,
    removeCaseFromHearing,
    saveDispatchNotification,
    saveDocumentFromLambda,
    saveUserConnection,
    setTrialSessionJobStatusForCase,
    setTrialSessionProcessingStatus,
    updateCaseHearing,
    updateMaintenanceMode,
    updatePractitionerUser,
    updateTrialSession,
    updateTrialSessionWorkingCopy,
  }),
  // methods below are not known to create or update "entity" records
  advancedDocumentSearch,
  createChangeOfAddressJob,
  decrementJobCounter,
  deleteDocumentFile,
  deleteMessage,
  deletePractitionerDocument,
  deleteRecord,
  deleteTrialSession,
  deleteTrialSessionWorkingCopy,
  deleteUserConnection,
  fetchEventCodesCountForJudges,
  getAllUsersByRole,
  getAllWebSocketConnections,
  getBulkTrialSessionWorkingCopyNotes: getBulkTrialSessionWorkingCopies,
  getCalendaredCasesForTrialSession,
  getCasesByEmailTotal,
  getClientId,
  getConfigurationItemValue,
  getDeployTableStatus,
  getDispatchNotification,
  getDocketEntriesServedWithinTimeframe,
  getDocument,
  getDocumentIdFromSQSMessage,
  getDownloadPolicyUrl,
  getEligibleCasesForTrialCity,
  getEligibleCasesForTrialSession,
  getFeatureFlagValue,
  getMaintenanceMode,
  getPractitionerDocumentByFileId,
  getPractitionerDocuments,
  getPractitionersByName,
  getReconciliationReport,
  getRequestResults,
  getSesStatus,
  getColdCases,
  getTableStatus,
  getTrialSessionById,
  getTrialSessionJobStatusForCase,
  getTrialSessionProcessingStatus,
  getTrialSessionWorkingCopy,
  getTrialSessions,
  getUploadPolicy,
  getUserByIdOnceAllUpdatesComplete,
  getWebSocketConnectionsByUserId,
  isEmailAvailable,
  isFileExists,
  setChangeOfAddressCaseAsDone,
  uploadDocument,
  zipDocuments,
};

export const getPersistenceGateway = () => gatewayMethods;

type _IGetPersistenceGateway = typeof getPersistenceGateway;

declare global {
  interface IGetPersistenceGateway extends _IGetPersistenceGateway {}
}

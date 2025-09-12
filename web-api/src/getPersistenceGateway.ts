import { advancedDocumentSearch } from './persistence/elasticsearch/advancedDocumentSearch';
import { createChangeOfAddressJob } from './persistence/postgres/jobs/changeOfAddress/createChangeOfAddressJob';
<<<<<<< HEAD
import { createPractitionerDocument } from './persistence/dynamo/practitioners/createPractitionerDocument';
import { deleteDocumentFile } from './persistence/s3/deleteDocumentFile';
import { deleteMessage } from './persistence/sqs/deleteMessage';
import { deletePractitionerDocument } from './persistence/dynamo/practitioners/deletePractitionerDocument';
=======
import { createJobStatus } from './persistence/dynamo/trialSessions/createJobStatus';
import { createTrialSession } from './persistence/dynamo/trialSessions/createTrialSession';
import { createTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/createTrialSessionWorkingCopy';
import { decrementJobCounter } from './persistence/dynamo/trialSessions/decrementJobCounter';
import { deleteDocumentFile } from './persistence/s3/deleteDocumentFile';
import { deleteMessage } from './persistence/sqs/deleteMessage';
import { deletePractitionerDocument } from './persistence/postgres/practitionerDocuments/deletePractitionerDocument';
import { deleteTrialSession } from './persistence/dynamo/trialSessions/deleteTrialSession';
import { deleteTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/deleteTrialSessionWorkingCopy';
>>>>>>> staging
import { deleteUserConnection } from '@web-api/persistence/postgres/connections/deleteUserConnection';
import { fetchEventCodesCountForJudges } from './persistence/elasticsearch/fetchEventCodesCountForJudges';
import { getAllWebSocketConnections } from '@web-api/persistence/postgres/connections/getAllWebSocketConnections';
import { getCasesByEmailTotal } from '@web-api/persistence/elasticsearch/getCasesByEmailTotal';
import { getClientId } from './persistence/cognito/getClientId';
import { getDispatchNotification } from './persistence/postgres/notifications/getDispatchNotification';
import { getDocketEntriesServedWithinTimeframe } from './persistence/elasticsearch/getDocketEntriesServedWithinTimeframe';
import { getDocument } from './persistence/s3/getDocument';
import { getDocumentIdFromSQSMessage } from './persistence/sqs/getDocumentIdFromSQSMessage';
import { getDownloadPolicyUrl } from './persistence/s3/getDownloadPolicyUrl';
import { getEligibleCasesForTrialCity } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialCity';
<<<<<<< HEAD
import { getFeatureFlagValue } from './persistence/dynamo/deployTable/getFeatureFlagValue';
import { getMaintenanceMode } from './persistence/postgres/featureFlag/getMaintenanceMode';
import { getPractitionerDocumentByFileId } from './persistence/dynamo/practitioners/getPractitionerDocumentByFileId';
import { getPractitionerDocuments } from './persistence/dynamo/practitioners/getPractitionerDocuments';
=======
import { getMaintenanceMode } from './persistence/postgres/featureFlag/getMaintenanceMode';
>>>>>>> staging
import { getPractitionersByName } from './persistence/elasticsearch/getPractitionersByName';
import { getReconciliationReport } from './persistence/elasticsearch/getReconciliationReport';
import { getSesStatus } from './persistence/ses/getSesStatus';
import { getColdCases } from './persistence/elasticsearch/getColdCases';
import { getTableStatus } from './persistence/dynamo/getTableStatus';
import { getUploadPolicy } from './persistence/s3/getUploadPolicy';
import { getUserByIdOnceAllUpdatesComplete } from '@web-api/persistence/postgres/users/getUserByIdOnceAllUpdatesComplete';
import { getWebSocketConnectionsByUserId } from '@web-api/persistence/postgres/connections/getWebSocketConnectionsByUserId';
import { incrementCounter } from './persistence/dynamo/helpers/incrementCounter';
import { isEmailAvailable } from './persistence/cognito/isEmailAvailable';
import { isFileExists } from './persistence/s3/isFileExists';
import { updatePractitionerUser } from './business/useCaseHelper/users/updatePractitionerUser';
import { saveDispatchNotification } from '@web-api/persistence/postgres/notifications/saveDispatchNotification';
import { saveDocumentFromLambda } from './persistence/s3/saveDocumentFromLambda';
import { saveUserConnection } from '@web-api/persistence/postgres/connections/saveUserConnection';
import { setChangeOfAddressCaseAsDone } from './persistence/postgres/jobs/changeOfAddress/setChangeOfAddressCaseAsDone';
<<<<<<< HEAD
import { updateMaintenanceMode } from '@web-api/persistence/postgres/featureFlag/updateMaintenanceMode';
=======
import { setTrialSessionJobStatusForCase } from './persistence/dynamo/trialSessions/setTrialSessionJobStatusForCase';
import { setTrialSessionProcessingStatus } from './persistence/dynamo/trialSessions/setTrialSessionProcessingStatus';
import { updateCaseHearing } from './persistence/dynamo/trialSessions/updateCaseHearing';
import { updateMaintenanceMode } from '@web-api/persistence/postgres/featureFlag/updateMaintenanceMode';
import { updatePractitionerUser } from './business/useCaseHelper/users/updatePractitionerUser';
import { updateTrialSession } from './persistence/dynamo/trialSessions/updateTrialSession';
import { updateTrialSessionWorkingCopy } from './persistence/dynamo/trialSessions/updateTrialSessionWorkingCopy';
>>>>>>> staging
import { uploadDocument } from '@web-api/persistence/s3/uploadDocument';
import { zipDocuments } from './persistence/s3/zipDocuments';
import { getEligibleCasesForTrialSession } from '@web-api/persistence/postgres/cases/getEligibleCasesForTrialSession';
import { getRequestResults } from '@web-api/persistence/postgres/polling/getRequestResults';

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
<<<<<<< HEAD
    createPractitionerDocument,
    editPractitionerDocument,
=======
    addCaseToHearing,
    createJobStatus,
    createTrialSession,
    createTrialSessionWorkingCopy,
>>>>>>> staging
    incrementCounter,
    saveDispatchNotification,
    saveDocumentFromLambda,
    saveUserConnection,
    updatePractitionerUser,
    updateMaintenanceMode,
  }),
  // methods below are not known to create or update "entity" records
  advancedDocumentSearch,
  createChangeOfAddressJob,
  deleteDocumentFile,
  deleteMessage,
  deletePractitionerDocument,
  deleteUserConnection,
  fetchEventCodesCountForJudges,
  getAllWebSocketConnections,
  getCasesByEmailTotal,
  getClientId,
  getDispatchNotification,
  getDocketEntriesServedWithinTimeframe,
  getDocument,
  getDocumentIdFromSQSMessage,
  getDownloadPolicyUrl,
  getEligibleCasesForTrialCity,
  getEligibleCasesForTrialSession,
  getMaintenanceMode,
  getPractitionersByName,
  getReconciliationReport,
  getRequestResults,
  getSesStatus,
  getColdCases,
  getTableStatus,
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
  interface IGetPersistenceGateway extends _IGetPersistenceGateway { }
}

import { advancedDocumentSearch } from './persistence/elasticsearch/advancedDocumentSearch';
import { createChangeOfAddressJob } from './persistence/postgres/jobs/changeOfAddress/createChangeOfAddressJob';
import { deleteDocumentFile } from './persistence/s3/deleteDocumentFile';
import { deleteMessage } from './persistence/sqs/deleteMessage';
import { deleteUserConnection } from '@web-api/persistence/postgres/connections/deleteUserConnection';
import { fetchEventCodesCountForJudges } from './persistence/elasticsearch/fetchEventCodesCountForJudges';
import { getAllWebSocketConnections } from '@web-api/persistence/postgres/connections/getAllWebSocketConnections';
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
import { getMaintenanceMode } from './persistence/postgres/featureFlag/getMaintenanceMode';
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
import { saveDispatchNotification } from '@web-api/persistence/postgres/notifications/saveDispatchNotification';
import { saveDocumentFromLambda } from './persistence/s3/saveDocumentFromLambda';
import { saveUserConnection } from '@web-api/persistence/postgres/connections/saveUserConnection';
import { setChangeOfAddressCaseAsDone } from './persistence/postgres/jobs/changeOfAddress/setChangeOfAddressCaseAsDone';
import { updateMaintenanceMode } from '@web-api/persistence/postgres/featureFlag/updateMaintenanceMode';
import { updatePractitionerUser } from './business/useCaseHelper/users/updatePractitionerUser';
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
    incrementCounter,
    saveDispatchNotification,
    saveDocumentFromLambda,
    saveUserConnection,
    updateMaintenanceMode,
    updatePractitionerUser,
  }),
  // methods below are not known to create or update "entity" records
  advancedDocumentSearch,
  createChangeOfAddressJob,
  deleteDocumentFile,
  deleteMessage,
  deleteUserConnection,
  fetchEventCodesCountForJudges,
  getAllWebSocketConnections,
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
  interface IGetPersistenceGateway extends _IGetPersistenceGateway {}
}

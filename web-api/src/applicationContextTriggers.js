const AWS = require('aws-sdk');
const pdfLib = require('pdf-lib');
const pug = require('pug');
const sass = require('sass');
const {
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');
const {
  changeOfAddress,
} = require('../../shared/src/business/utilities/documentGenerators/changeOfAddress');
const {
  countPagesInDocument,
} = require('../../shared/src/business/useCaseHelper/countPagesInDocument');
const {
  coverSheet,
} = require('../../shared/src/business/utilities/documentGenerators/coverSheet');
const {
  createPetitionerAccountInteractor,
} = require('../../shared/src/business/useCases/users/createPetitionerAccountInteractor');
const {
  documentUrlTranslator,
} = require('../../shared/src/business/utilities/documentUrlTranslator');
const {
  generateAndServeDocketEntry,
} = require('../../shared/src/business/useCaseHelper/service/createChangeItems');
const {
  generatePdfFromHtmlInteractor,
} = require('../../shared/src/business/useCases/generatePdfFromHtmlInteractor');
const {
  getCaseByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber');
const {
  getCasesForUser,
} = require('../../shared/src/persistence/dynamo/users/getCasesForUser');
const {
  getChromiumBrowser,
} = require('../../shared/src/business/utilities/getChromiumBrowser');
const {
  getDocketNumbersByUser,
} = require('../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser');
const {
  getDocumentTypeForAddressChange,
} = require('../../shared/src/business/utilities/generateChangeOfAddressTemplate');
const {
  getDownloadPolicyUrl,
} = require('../../shared/src/persistence/s3/getDownloadPolicyUrl');
const {
  getUserById,
} = require('../../shared/src/persistence/dynamo/users/getUserById');
const {
  getUserCaseMappingsByDocketNumber,
} = require('../../shared/src/persistence/dynamo/cases/getUserCaseMappingsByDocketNumber');
const {
  getWebSocketConnectionsByUserId,
} = require('../../shared/src/persistence/dynamo/notifications/getWebSocketConnectionsByUserId');
const {
  persistUser,
} = require('../../shared/src/persistence/dynamo/users/persistUser');
const {
  retrySendNotificationToConnections,
} = require('../../shared/src/notifications/retrySendNotificationToConnections');
const {
  saveDocumentFromLambda,
} = require('../../shared/src/persistence/s3/saveDocumentFromLambda');
const {
  saveWorkItem,
} = require('../../shared/src/persistence/dynamo/workitems/saveWorkItem');
const {
  sendBulkTemplatedEmail,
} = require('../../shared/src/dispatchers/ses/sendBulkTemplatedEmail');
const {
  sendNotificationToConnection,
} = require('../../shared/src/notifications/sendNotificationToConnection');
const {
  sendNotificationToUser,
} = require('../../shared/src/notifications/sendNotificationToUser');
const {
  sendServedPartiesEmails,
} = require('../../shared/src/business/useCaseHelper/service/sendServedPartiesEmails');
const {
  sendUpdatePetitionerCasesMessage,
} = require('../../shared/src/persistence/messages/sendUpdatePetitionerCasesMessage');
const {
  setUserEmailFromPendingEmailInteractor,
} = require('../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor');
const {
  updateCase,
} = require('../../shared/src/persistence/dynamo/cases/updateCase');
const {
  updateCaseAndAssociations,
} = require('../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations');
const {
  updateDocketEntry,
} = require('../../shared/src/persistence/dynamo/documents/updateDocketEntry');
const {
  updateIrsPractitionerOnCase,
  updatePrivatePractitionerOnCase,
} = require('../../shared/src/persistence/dynamo/cases/updatePractitionerOnCase');
const {
  updatePetitionerCasesInteractor,
} = require('../../shared/src/business/useCases/users/updatePetitionerCasesInteractor');
const {
  updateUser,
} = require('../../shared/src/persistence/dynamo/users/updateUser');
const { Case } = require('../../shared/src/business/entities/cases/Case');
const { createLogger } = require('../../shared/src/utilities/createLogger');
const { getUniqueId } = require('../../shared/src/sharedAppContext.js');
const { DynamoDB, S3, SES, SQS } = AWS;

const environment = {
  appEndpoint: process.env.EFCMS_DOMAIN
    ? `app.${process.env.EFCMS_DOMAIN}`
    : 'localhost:1234',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  stage: process.env.STAGE,
  tempDocumentsBucketName: process.env.TEMP_DOCUMENTS_BUCKET_NAME || '',
};

const logger = createLogger({
  defaultMeta: {
    environment: {
      stage: process.env.STAGE || 'local',
    },
  },
});

let s3Cache;
let sesCache;
let sqsCache;

const applicationContext = {
  documentUrlTranslator,
  environment,
  getAppEndpoint: () => {
    return environment.appEndpoint;
  },
  getCaseTitle: Case.getCaseTitle,
  getChromiumBrowser,
  getConstants: () => ({ MAX_SES_RETRIES: 6 }),
  getCurrentUser: () => ({}),
  getDispatchers: () => ({
    sendBulkTemplatedEmail,
  }),
  getDocumentClient: () => {
    return new DynamoDB.DocumentClient({
      endpoint: process.env.DYNAMODB_ENDPOINT,
      region: process.env.AWS_REGION,
    });
  },
  getDocumentGenerators: () => ({ changeOfAddress, coverSheet }),
  getDocumentsBucketName: () => {
    return process.env.DOCUMENTS_BUCKET_NAME || '';
  },
  getEmailClient: () => {
    if (process.env.CI || process.env.DISABLE_EMAILS === 'true') {
      return {
        getSendStatistics: () => {
          // mock this out so the health checks pass on smoke tests
          return {
            promise: () => ({
              SendDataPoints: [
                {
                  Rejects: 0,
                },
              ],
            }),
          };
        },
        sendBulkTemplatedEmail: () => {
          return {
            promise: () => {
              return { Status: [] };
            },
          };
        },
      };
    } else {
      if (!sesCache) {
        sesCache = new SES({
          region: 'us-east-1',
        });
      }
      return sesCache;
    }
  },
  getEnvironment: () => ({
    dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
    stage: process.env.STAGE,
  }),
  getIrsSuperuserEmail: () => process.env.IRS_SUPERUSER_EMAIL,
  getMessageGateway: () => ({
    sendUpdatePetitionerCasesMessage: ({
      applicationContext: appContext,
      user,
    }) => {
      if (environment.stage === 'local') {
        updatePetitionerCasesInteractor({
          applicationContext: appContext,
          user,
        });
      } else {
        sendUpdatePetitionerCasesMessage({
          applicationContext: appContext,
          user,
        });
      }
    },
  }),
  getMessagingClient: () => {
    if (!sqsCache) {
      sqsCache = new SQS({
        apiVersion: '2012-11-05',
      });
    }
    return sqsCache;
  },
  getNodeSass: () => {
    return sass;
  },
  getNotificationClient: ({ endpoint }) => {
    return new AWS.ApiGatewayManagementApi({
      endpoint,
      httpOptions: {
        timeout: 900000, // 15 minutes
      },
    });
  },
  getNotificationGateway: () => ({
    retrySendNotificationToConnections,
    sendNotificationToConnection,
    sendNotificationToUser,
  }),
  getPdfLib: () => {
    return pdfLib;
  },
  getPersistenceGateway: () => ({
    getCaseByDocketNumber,
    getCasesForUser,
    getDocketNumbersByUser,
    getDownloadPolicyUrl,
    getUserById,
    getUserCaseMappingsByDocketNumber,
    getWebSocketConnectionsByUserId,
    persistUser,
    saveDocumentFromLambda,
    saveWorkItem,
    updateCase,
    updateDocketEntry,
    updateIrsPractitionerOnCase,
    updatePrivatePractitionerOnCase,
    updateUser,
  }),
  getPug: () => {
    return pug;
  },
  getStorageClient: () => {
    if (!s3Cache) {
      s3Cache = new S3({
        endpoint: environment.s3Endpoint,
        region: 'us-east-1',
        s3ForcePathStyle: true,
      });
    }
    return s3Cache;
  },
  getTempDocumentsBucketName: () => {
    return environment.tempDocumentsBucketName;
  },
  getUniqueId,
  getUseCaseHelpers: () => ({
    countPagesInDocument,
    generateAndServeDocketEntry,
    sendServedPartiesEmails,
    updateCaseAndAssociations,
  }),
  getUseCases: () => ({
    createPetitionerAccountInteractor,
    generatePdfFromHtmlInteractor,
    setUserEmailFromPendingEmailInteractor,
    updatePetitionerCasesInteractor,
  }),
  getUtilities: () => ({
    calculateDifferenceInDays,
    calculateISODate,
    createISODateString,
    formatDateString,
    formatNow,
    getDocumentTypeForAddressChange,
    prepareDateFromString,
  }),
  logger: {
    debug: logger.debug.bind(logger),
    error: logger.error.bind(logger),
    info: logger.info.bind(logger),
    warn: logger.warn.bind(logger),
  },
};

exports.applicationContext = applicationContext;

/* eslint-disable max-lines */
const AWS = require('aws-sdk');
const axios = require('axios');
const barNumberGenerator = require('../../shared/src/persistence/dynamo/users/barNumberGenerator');
const connectionClass = require('http-aws-es');
const docketNumberGenerator = require('../../shared/src/persistence/dynamo/cases/docketNumberGenerator');
const elasticsearch = require('elasticsearch');
const pdfLib = require('pdf-lib');
const pug = require('pug');
const sass = require('sass');
const util = require('util');
const {
  addressLabelCoverSheet,
} = require('../../shared/src/business/utilities/documentGenerators/addressLabelCoverSheet');
const {
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} = require('../../shared/src/business/utilities/DateHandler');
const {
  CASE_STATUS_TYPES,
  CONFIGURATION_ITEM_KEYS,
  MAX_SEARCH_CLIENT_RESULTS,
  MAX_SEARCH_RESULTS,
  SESSION_STATUS_GROUPS,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  CaseDeadline,
} = require('../../shared/src/business/entities/CaseDeadline');
const {
  caseInventoryReport,
} = require('../../shared/src/business/utilities/documentGenerators/caseInventoryReport');
const {
  changeOfAddress,
} = require('../../shared/src/business/utilities/documentGenerators/changeOfAddress');
const {
  clerkOfCourtNameForSigning,
  getEnvironment,
  getUniqueId,
} = require('../../shared/src/sharedAppContext');
const {
  combineTwoPdfs,
} = require('../../shared/src/business/utilities/documentGenerators/combineTwoPdfs');
const {
  compareCasesByDocketNumber,
  formatCase: formatCaseForTrialSession,
  formattedTrialSessionDetails,
} = require('../../shared/src/business/utilities/getFormattedTrialSessionDetails');
const {
  compareISODateStrings,
  compareStrings,
} = require('../../shared/src/business/utilities/sortFunctions');
const {
  copyPagesAndAppendToTargetPdf,
} = require('../../shared/src/business/utilities/copyPagesAndAppendToTargetPdf');
const {
  Correspondence,
} = require('../../shared/src/business/entities/Correspondence');
const {
  coverSheet,
} = require('../../shared/src/business/utilities/documentGenerators/coverSheet');
const {
  DocketEntry,
} = require('../../shared/src/business/entities/DocketEntry');
const {
  docketRecord,
} = require('../../shared/src/business/utilities/documentGenerators/docketRecord');
const {
  documentUrlTranslator,
} = require('../../shared/src/business/utilities/documentUrlTranslator');
const {
  filterWorkItemsForUser,
} = require('../../shared/src/business/utilities/filterWorkItemsForUser');
const {
  formatJudgeName,
} = require('../../shared/src/business/utilities/getFormattedJudgeName');
const {
  getAddressPhoneDiff,
  getDocumentTypeForAddressChange,
} = require('../../shared/src/business/utilities/generateChangeOfAddressTemplate');
const {
  getChromiumBrowser,
} = require('../../shared/src/business/utilities/getChromiumBrowser');
const {
  getCropBox,
} = require('../../shared/src/business/utilities/getCropBox');
const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('../../shared/src/business/utilities/getWorkQueueFilters');
const {
  getFormattedCaseDetail,
} = require('../../shared/src/business/utilities/getFormattedCaseDetail');
const {
  getStampBoxCoordinates,
} = require('../../shared/src/business/utilities/getStampBoxCoordinates');
const {
  IrsPractitioner,
} = require('../../shared/src/business/entities/IrsPractitioner');
const {
  isAuthorized,
} = require('../../shared/src/authorization/authorizationClientService');
const {
  isCurrentColorActive,
} = require('../../shared/src/persistence/dynamo/helpers/isCurrentColorActive');
const {
  noticeOfChangeOfTrialJudge,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfChangeOfTrialJudge');
const {
  noticeOfChangeToInPersonProceeding,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfChangeToInPersonProceeding');
const {
  noticeOfChangeToRemoteProceeding,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfChangeToRemoteProceeding');
const {
  noticeOfDocketChange,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfDocketChange');
const {
  noticeOfReceiptOfPetition,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfReceiptOfPetition');
const {
  noticeOfTrialIssued,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfTrialIssued');
const {
  noticeOfTrialIssuedInPerson,
} = require('../../shared/src/business/utilities/documentGenerators/noticeOfTrialIssuedInPerson');
const {
  order,
} = require('../../shared/src/business/utilities/documentGenerators/order');
const {
  ORDER_TYPES,
} = require('../../shared/src/business/entities/EntityConstants');
const {
  pendingReport,
} = require('../../shared/src/business/utilities/documentGenerators/pendingReport');
const {
  Practitioner,
} = require('../../shared/src/business/entities/Practitioner');
const {
  practitionerCaseList,
} = require('../../shared/src/business/utilities/documentGenerators/practitionerCaseList');
const {
  printableWorkingCopySessionList,
} = require('../../shared/src/business/utilities/documentGenerators/printableWorkingCopySessionList');
const {
  PrivatePractitioner,
} = require('../../shared/src/business/entities/PrivatePractitioner');
const {
  receiptOfFiling,
} = require('../../shared/src/business/utilities/documentGenerators/receiptOfFiling');
const {
  retrySendNotificationToConnections,
} = require('../../shared/src/notifications/retrySendNotificationToConnections');
const {
  scrapePdfContents,
} = require('../../shared/src/business/utilities/scrapePdfContents');
const {
  sendBulkTemplatedEmail,
} = require('../../shared/src/dispatchers/ses/sendBulkTemplatedEmail');
const {
  sendEmailEventToQueue,
} = require('../../shared/src/persistence/messages/sendEmailEventToQueue');
const {
  sendNotificationOfSealing,
} = require('../../shared/src/dispatchers/sns/sendNotificationOfSealing');
const {
  sendNotificationToConnection,
} = require('../../shared/src/notifications/sendNotificationToConnection');
const {
  sendNotificationToUser,
} = require('../../shared/src/notifications/sendNotificationToUser');
const {
  sendSetTrialSessionCalendarEvent,
} = require('../../shared/src/persistence/messages/sendSetTrialSessionCalendarEvent');
const {
  sendSlackNotification,
} = require('../../shared/src/dispatchers/slack/sendSlackNotification');
const {
  sendUpdatePetitionerCasesMessage,
} = require('../../shared/src/persistence/messages/sendUpdatePetitionerCasesMessage');
const {
  serveCaseDocument,
} = require('../../shared/src/business/utilities/serveCaseDocument');
const {
  setConsolidationFlagsForDisplay,
} = require('../../shared/src/business/utilities/setConsolidationFlagsForDisplay');
const {
  setServiceIndicatorsForCase,
} = require('../../shared/src/business/utilities/setServiceIndicatorsForCase');
const {
  setupPdfDocument,
} = require('../../shared/src/business/utilities/setupPdfDocument');
const {
  standingPretrialOrder,
} = require('../../shared/src/business/utilities/documentGenerators/standingPretrialOrder');
const {
  standingPretrialOrderForSmallCase,
} = require('../../shared/src/business/utilities/documentGenerators/standingPretrialOrderForSmallCase');
const {
  trialCalendar,
} = require('../../shared/src/business/utilities/documentGenerators/trialCalendar');
const {
  TrialSession,
} = require('../../shared/src/business/entities/trialSessions/TrialSession');
const {
  trialSessionPlanningReport,
} = require('../../shared/src/business/utilities/documentGenerators/trialSessionPlanningReport');
const {
  TrialSessionWorkingCopy,
} = require('../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy');
const {
  updatePetitionerCasesInteractor,
} = require('../../shared/src/business/useCases/users/updatePetitionerCasesInteractor');
const {
  uploadToS3,
} = require('../../shared/src/business/utilities/uploadToS3');
const {
  UserCaseNote,
} = require('../../shared/src/business/entities/notes/UserCaseNote');

const {
  Case,
  isLeadCase,
} = require('../../shared/src/business/entities/cases/Case');
const { createLogger } = require('./createLogger');
const { exec } = require('child_process');
const { fallbackHandler } = require('./fallbackHandler');
const { getPersistenceGateway } = require('./getPersistenceGateway');
const { getUseCaseHelpers } = require('./getUseCaseHelpers');
const { getUseCases } = require('./getUseCases');
const { Message } = require('../../shared/src/business/entities/Message');
const { scan } = require('../../shared/src/persistence/dynamodbClientService');
const { User } = require('../../shared/src/business/entities/User');
const { UserCase } = require('../../shared/src/business/entities/UserCase');
const { v4: uuidv4 } = require('uuid');
const { WorkItem } = require('../../shared/src/business/entities/WorkItem');

// increase the timeout for zip uploads to S3
AWS.config.httpOptions.timeout = 300000;

const {
  CognitoIdentityServiceProvider,
  DynamoDB,
  EnvironmentCredentials,
  S3,
  SES,
  SQS,
} = AWS;
const execPromise = util.promisify(exec);

const environment = {
  appEndpoint: process.env.EFCMS_DOMAIN
    ? `app.${process.env.EFCMS_DOMAIN}`
    : 'localhost:1234',
  currentColor: process.env.CURRENT_COLOR || 'green',
  documentsBucketName: process.env.DOCUMENTS_BUCKET_NAME || '',
  dynamoDbEndpoint: process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000',
  dynamoDbTableName: process.env.DYNAMODB_TABLE_NAME,
  elasticsearchEndpoint:
    process.env.ELASTICSEARCH_ENDPOINT || 'http://localhost:9200',
  masterDynamoDbEndpoint:
    process.env.MASTER_DYNAMODB_ENDPOINT || 'http://localhost:8000',
  masterRegion: process.env.MASTER_REGION || 'us-east-1',
  quarantineBucketName: process.env.QUARANTINE_BUCKET_NAME || '',
  region: process.env.AWS_REGION || 'us-east-1',
  s3Endpoint: process.env.S3_ENDPOINT || 'localhost',
  stage: process.env.STAGE || 'local',
  tempDocumentsBucketName: process.env.TEMP_DOCUMENTS_BUCKET_NAME || '',
  virusScanQueueUrl: process.env.VIRUS_SCAN_QUEUE_URL || '',
  wsEndpoint: process.env.WS_ENDPOINT || 'http://localhost:3011',
};

const getDocumentClient = ({ useMasterRegion = false } = {}) => {
  const type = useMasterRegion ? 'master' : 'region';
  const mainRegion = environment.region;
  const fallbackRegion =
    environment.region === 'us-west-1' ? 'us-east-1' : 'us-west-1';
  const mainRegionEndpoint = environment.dynamoDbEndpoint.includes('local')
    ? environment.dynamoDbEndpoint.includes('localhost')
      ? 'http://localhost:8000'
      : environment.dynamoDbEndpoint
    : `dynamodb.${mainRegion}.amazonaws.com`;
  const fallbackRegionEndpoint = environment.dynamoDbEndpoint.includes(
    'localhost',
  )
    ? 'http://localhost:8000'
    : `dynamodb.${fallbackRegion}.amazonaws.com`;
  const { masterDynamoDbEndpoint, masterRegion } = environment;

  const config = {
    fallbackRegion,
    fallbackRegionEndpoint,
    mainRegion,
    mainRegionEndpoint,
    masterDynamoDbEndpoint,
    masterRegion,
    useMasterRegion,
  };

  if (!dynamoClientCache[type]) {
    dynamoClientCache[type] = {
      batchGet: fallbackHandler({ key: 'batchGet', ...config }),
      batchWrite: fallbackHandler({ key: 'batchWrite', ...config }),
      delete: fallbackHandler({ key: 'delete', ...config }),
      get: fallbackHandler({ key: 'get', ...config }),
      put: fallbackHandler({ key: 'put', ...config }),
      query: fallbackHandler({ key: 'query', ...config }),
      scan: fallbackHandler({ key: 'scan', ...config }),
      update: fallbackHandler({ key: 'update', ...config }),
    };
  }
  return dynamoClientCache[type];
};

const getDynamoClient = ({ useMasterRegion = false } = {}) => {
  // we don't need fallback logic here because the only method we use is describeTable
  // which is used for actually checking if the table in the same region exists.
  const type = useMasterRegion ? 'master' : 'region';
  if (!dynamoCache[type]) {
    dynamoCache[type] = new DynamoDB({
      endpoint: useMasterRegion
        ? environment.masterDynamoDbEndpoint
        : environment.dynamoDbEndpoint,
      region: useMasterRegion ? environment.masterRegion : environment.region,
    });
  }
  return dynamoCache[type];
};

let dynamoClientCache = {};
let dynamoCache = {};
let s3Cache;
let sesCache;
let sqsCache;
let searchClientCache;
let notificationServiceCache;

const entitiesByName = {
  Case,
  CaseDeadline,
  Correspondence,
  DocketEntry,
  IrsPractitioner,
  Message,
  Practitioner,
  PrivatePractitioner,
  TrialSession,
  TrialSessionWorkingCopy,
  User,
  UserCase,
  UserCaseNote,
  WorkItem,
};

module.exports = (appContextUser, logger = createLogger()) => {
  let user;

  if (appContextUser) {
    user = new User(appContextUser);
  }

  const getCurrentUser = () => {
    return user;
  };

  if (process.env.NODE_ENV === 'production') {
    const authenticated = user && Object.keys(user).length;
    logger.defaultMeta = logger.defaultMeta || {};
    logger.defaultMeta.user = authenticated
      ? user
      : { role: 'unauthenticated' };
  }

  return {
    barNumberGenerator,
    docketNumberGenerator,
    documentUrlTranslator,
    environment,
    getAppEndpoint: () => {
      return environment.appEndpoint;
    },
    getBounceAlertRecipients: () =>
      process.env.BOUNCE_ALERT_RECIPIENTS?.split(',') || [],
    getCaseTitle: Case.getCaseTitle,
    getChromiumBrowser,
    getClerkOfCourtNameForSigning: () => {
      return clerkOfCourtNameForSigning;
    },
    getCognito: () => {
      if (environment.stage === 'local') {
        return {
          adminCreateUser: () => ({
            promise: () => ({
              User: {
                Username: uuidv4(),
              },
            }),
          }),
          adminDisableUser: () => ({
            promise: () => {},
          }),
          adminGetUser: ({ Username }) => ({
            promise: async () => {
              // TODO: this scan might become REALLY slow while doing a full integration
              // test run.
              const items = await scan({
                applicationContext: {
                  environment,
                  getDocumentClient,
                },
              });
              const users = items.filter(
                ({ pk, sk }) =>
                  pk.startsWith('user|') && sk.startsWith('user|'),
              );

              const foundUser = users.find(({ email }) => email === Username);

              if (foundUser) {
                return {
                  UserAttributes: [],
                  Username: foundUser.userId,
                };
              } else {
                const error = new Error();
                error.code = 'UserNotFoundException';
                throw error;
              }
            },
          }),
          adminUpdateUserAttributes: () => ({
            promise: () => {},
          }),
        };
      } else {
        return new CognitoIdentityServiceProvider({
          region: 'us-east-1',
        });
      }
    },
    getConstants: () => ({
      ADVANCED_DOCUMENT_IP_LIMITER_KEY: 'document-search-ip-limiter',
      ADVANCED_DOCUMENT_LIMITER_KEY: 'document-search-limiter',
      CASE_INVENTORY_MAX_PAGE_SIZE: 20000,
      // the Chief Judge will have ~15k records, so setting to 20k to be safe
      CASE_STATUSES: Object.values(CASE_STATUS_TYPES),
      CONFIGURATION_ITEM_KEYS,
      MAX_SEARCH_CLIENT_RESULTS,
      MAX_SEARCH_RESULTS,
      MAX_SES_RETRIES: 6,
      OPEN_CASE_STATUSES: Object.values(CASE_STATUS_TYPES).filter(
        status => status !== CASE_STATUS_TYPES.closed,
      ),
      ORDER_TYPES_MAP: ORDER_TYPES,
      PENDING_ITEMS_PAGE_SIZE: 100,
      SES_CONCURRENCY_LIMIT: process.env.SES_CONCURRENCY_LIMIT || 6,
      SESSION_STATUS_GROUPS,
    }),
    getCurrentUser,
    getDispatchers: () => ({
      sendBulkTemplatedEmail,
      sendNotificationOfSealing:
        process.env.PROD_ENV_ACCOUNT_ID === process.env.AWS_ACCOUNT_ID
          ? sendNotificationOfSealing
          : () => {},
      sendSlackNotification,
    }),
    getDocumentClient,
    getDocumentGenerators: () => ({
      addressLabelCoverSheet,
      caseInventoryReport,
      changeOfAddress,
      coverSheet,
      docketRecord,
      noticeOfChangeOfTrialJudge,
      noticeOfChangeToInPersonProceeding,
      noticeOfChangeToRemoteProceeding,
      noticeOfDocketChange,
      noticeOfReceiptOfPetition,
      noticeOfTrialIssued,
      noticeOfTrialIssuedInPerson,
      order,
      pendingReport,
      practitionerCaseList,
      printableWorkingCopySessionList,
      receiptOfFiling,
      standingPretrialOrder,
      standingPretrialOrderForSmallCase,
      trialCalendar,
      trialSessionPlanningReport,
    }),
    getDocumentsBucketName: () => {
      return environment.documentsBucketName;
    },
    getDynamoClient,
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
    getEntityByName: name => {
      return entitiesByName[name];
    },
    getEnvironment,
    getHttpClient: () => axios,
    getIrsSuperuserEmail: () => process.env.IRS_SUPERUSER_EMAIL,
    getMessageGateway: () => ({
      sendEmailEventToQueue: async ({ applicationContext, emailParams }) => {
        if (environment.stage !== 'local') {
          await sendEmailEventToQueue({
            applicationContext,
            emailParams,
          });
        }
      },
      sendSetTrialSessionCalendarEvent: ({ applicationContext, payload }) => {
        if (environment.stage === 'local') {
          applicationContext
            .getUseCases()
            .generateNoticesForCaseTrialSessionCalendarInteractor(
              applicationContext,
              payload,
            );
        } else {
          sendSetTrialSessionCalendarEvent({
            applicationContext,
            payload,
          });
        }
      },
      sendUpdatePetitionerCasesMessage: ({
        applicationContext: appContext,
        user: userToSendTo,
      }) => {
        if (environment.stage === 'local') {
          updatePetitionerCasesInteractor({
            applicationContext: appContext,
            user: userToSendTo,
          });
        } else {
          sendUpdatePetitionerCasesMessage({
            applicationContext: appContext,
            user: userToSendTo,
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
      if (endpoint.includes('localhost')) {
        endpoint = 'http://localhost:3011';
      }
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
    getNotificationService: () => {
      if (notificationServiceCache) {
        return notificationServiceCache;
      }

      if (environment.stage === 'local') {
        notificationServiceCache = {
          publish: () => ({
            promise: () => {},
          }),
        };
      } else {
        notificationServiceCache = new AWS.SNS({});
      }
      return notificationServiceCache;
    },
    getPdfJs: () => {
      const pdfjsLib = require('pdfjs-dist/legacy/build/pdf');
      pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.js';
      return pdfjsLib;
    },
    getPdfLib: () => {
      return pdfLib;
    },
    getPersistenceGateway,
    getPersistencePrivateKeys: () => ['pk', 'sk', 'gsi1pk'],
    getPug: () => {
      return pug;
    },
    getQuarantineBucketName: () => {
      return environment.quarantineBucketName;
    },
    getScannerResourceUri: () => {
      return (
        process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
      );
    },
    getSearchClient: () => {
      if (!searchClientCache) {
        if (environment.stage === 'local') {
          searchClientCache = new elasticsearch.Client({
            host: environment.elasticsearchEndpoint,
          });
        } else {
          searchClientCache = new elasticsearch.Client({
            amazonES: {
              credentials: new EnvironmentCredentials('AWS'),
              region: environment.region,
            },
            apiVersion: '7.7',
            awsConfig: new AWS.Config({ region: 'us-east-1' }),
            connectionClass,
            host: environment.elasticsearchEndpoint,
            log: 'warning',
            port: 443,
            protocol: 'https',
          });
        }
      }
      return searchClientCache;
    },
    getSlackWebhookUrl: () => process.env.SLACK_WEBHOOK_URL,
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
    getUseCaseHelpers,
    getUseCases,
    getUtilities: () => {
      return {
        calculateDifferenceInDays,
        calculateISODate,
        combineTwoPdfs,
        compareCasesByDocketNumber,
        compareISODateStrings,
        compareStrings,
        copyPagesAndAppendToTargetPdf,
        createISODateString,
        filterWorkItemsForUser,
        formatCaseForTrialSession,
        formatDateString,
        formatJudgeName,
        formatNow,
        formattedTrialSessionDetails,
        getAddressPhoneDiff,
        getCropBox,
        getDocQcSectionForUser,
        getDocumentTypeForAddressChange,
        getFormattedCaseDetail,
        getStampBoxCoordinates,
        getWorkQueueFilters,
        isLeadCase,
        isPending: DocketEntry.isPending,
        prepareDateFromString,
        scrapePdfContents,
        serveCaseDocument,
        setConsolidationFlagsForDisplay,
        setServiceIndicatorsForCase,
        setupPdfDocument,
        uploadToS3,
      };
    },
    isAuthorized,
    isCurrentColorActive,
    logger: {
      debug: (message, context) => logger.debug(message, { context }),
      error: (message, context) => logger.error(message, { context }),
      info: (message, context) => logger.info(message, { context }),
      warn: (message, context) => logger.warn(message, { context }),
    },
    runVirusScan: async ({ filePath }) => {
      return await execPromise(`clamdscan ${filePath}`);
    },
  };
};

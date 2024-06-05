/* eslint-disable max-lines */
import * as barNumberGenerator from './persistence/dynamo/users/barNumberGenerator';
import * as docketNumberGenerator from './persistence/dynamo/cases/docketNumberGenerator';
import * as pdfLib from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { AwsSigv4Signer } from '@opensearch-project/opensearch/aws';
import {
  CASE_STATUS_TYPES,
  CLERK_OF_THE_COURT_CONFIGURATION,
  CLOSED_CASE_STATUSES,
  CONFIGURATION_ITEM_KEYS,
  MAX_SEARCH_CLIENT_RESULTS,
  MAX_SEARCH_RESULTS,
  ORDER_TYPES,
  SESSION_STATUS_GROUPS,
  TRIAL_SESSION_SCOPE_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { Case } from '../../shared/src/business/entities/cases/Case';
import { CaseDeadline } from '../../shared/src/business/entities/CaseDeadline';
import { Client } from '@opensearch-project/opensearch';
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Correspondence } from '../../shared/src/business/entities/Correspondence';
import { DocketEntry } from '../../shared/src/business/entities/DocketEntry';
import { IrsPractitioner } from '../../shared/src/business/entities/IrsPractitioner';
import { Message } from '../../shared/src/business/entities/Message';
import { Practitioner } from '../../shared/src/business/entities/Practitioner';
import { PrivatePractitioner } from '../../shared/src/business/entities/PrivatePractitioner';
import { TrialSession } from '../../shared/src/business/entities/trialSessions/TrialSession';
import { TrialSessionWorkingCopy } from '../../shared/src/business/entities/trialSessions/TrialSessionWorkingCopy';
import { User } from '../../shared/src/business/entities/User';
import { UserCase } from '../../shared/src/business/entities/UserCase';
import { UserCaseNote } from '../../shared/src/business/entities/notes/UserCaseNote';
import { WorkItem } from '../../shared/src/business/entities/WorkItem';
import { WorkerMessage } from '@web-api/gateways/worker/workerRouter';
import { createLogger } from './createLogger';
import { environment } from '@web-api/environment';
import {
  getChromiumBrowser,
  getChromiumBrowserAWS,
} from '../../shared/src/business/utilities/getChromiumBrowser';
import {
  getCognito,
  getLocalCognito,
} from '@web-api/persistence/cognito/getCognito';
import { getDocumentClient } from '@web-api/persistence/dynamo/getDocumentClient';
import { getDocumentGenerators } from './getDocumentGenerators';
import { getDynamoClient } from '@web-api/persistence/dynamo/getDynamoClient';
import { getEnvironment, getUniqueId } from '../../shared/src/sharedAppContext';
import { getPersistenceGateway } from './getPersistenceGateway';
import { getUseCaseHelpers } from './getUseCaseHelpers';
import { getUseCases } from './getUseCases';
import { getUserGateway } from '@web-api/getUserGateway';
import { getUtilities } from './getUtilities';
import { isAuthorized } from '../../shared/src/authorization/authorizationClientService';
import { isCurrentColorActive } from './persistence/dynamo/helpers/isCurrentColorActive';
import { retrySendNotificationToConnections } from './notifications/retrySendNotificationToConnections';
import { saveRequestResponse } from '@web-api/persistence/dynamo/polling/saveRequestResponse';
import { sendBulkTemplatedEmail } from './dispatchers/ses/sendBulkTemplatedEmail';
import { sendEmailEventToQueue } from './persistence/messages/sendEmailEventToQueue';
import { sendEmailToUser } from '@web-api/persistence/messages/sendEmailToUser';
import { sendNotificationOfSealing } from './dispatchers/sns/sendNotificationOfSealing';
import { sendNotificationToConnection } from './notifications/sendNotificationToConnection';
import { sendNotificationToUser } from './notifications/sendNotificationToUser';
import { sendSetTrialSessionCalendarEvent } from './persistence/messages/sendSetTrialSessionCalendarEvent';
import { sendSlackNotification } from './dispatchers/slack/sendSlackNotification';
import { worker } from '@web-api/gateways/worker/worker';
import { workerLocal } from '@web-api/gateways/worker/workerLocal';
import AWS, { S3, SES, SQS } from 'aws-sdk';
import axios from 'axios';
import pug from 'pug';
import sass from 'sass';

let s3Cache: AWS.S3 | undefined;
let sesCache;
let sqsCache;
let searchClientCache: Client;
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

export const createApplicationContext = (
  appContextUser,
  logger = createLogger(),
) => {
  let user;

  if (appContextUser) {
    user = new User(appContextUser);
  }

  const getCurrentUser = (): {
    role: string;
    userId: string;
    email: string;
    name: string;
  } => {
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
    environment,
    getBounceAlertRecipients: () =>
      process.env.BOUNCE_ALERT_RECIPIENTS?.split(',') || [],
    getCaseTitle: Case.getCaseTitle,
    getChromiumBrowser: async () => {
      if (environment.stage === 'local') {
        return await getChromiumBrowser();
      } else {
        return await getChromiumBrowserAWS();
      }
    },
    getCognito: (): CognitoIdentityProvider => {
      if (environment.stage === 'local') {
        return getLocalCognito();
      } else {
        return getCognito();
      }
    },
    getConstants: () => ({
      ADVANCED_DOCUMENT_IP_LIMITER_KEY: 'document-search-ip-limiter',
      ADVANCED_DOCUMENT_LIMITER_KEY: 'document-search-limiter',
      CASE_INVENTORY_MAX_PAGE_SIZE: 20000,
      // the Chief Judge will have ~15k records, so setting to 20k to be safe
      CASE_STATUSES: Object.values(CASE_STATUS_TYPES),
      CHANGE_OF_ADDRESS_CONCURRENCY: process.env.CHANGE_OF_ADDRESS_CONCURRENCY
        ? parseInt(process.env.CHANGE_OF_ADDRESS_CONCURRENCY)
        : undefined,
      CLERK_OF_THE_COURT_CONFIGURATION,
      CONFIGURATION_ITEM_KEYS,
      MAX_SEARCH_CLIENT_RESULTS,
      MAX_SEARCH_RESULTS,
      MAX_SES_RETRIES: 6,
      OPEN_CASE_STATUSES: Object.values(CASE_STATUS_TYPES).filter(
        status => !CLOSED_CASE_STATUSES.includes(status as any),
      ),
      ORDER_TYPES_MAP: ORDER_TYPES,
      PENDING_ITEMS_PAGE_SIZE: 100,
      SES_CONCURRENCY_LIMIT: process.env.SES_CONCURRENCY_LIMIT || 6,
      SESSION_STATUS_GROUPS,
      STATUS_TYPES: CASE_STATUS_TYPES,
      TRIAL_SESSION_SCOPE_TYPES,
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
    getDocumentGenerators,
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
          sendEmail: () => {
            return {
              promise: (): SES.SendEmailResponse => {
                return { MessageId: '' };
              },
            };
          },
        };
      } else {
        if (!sesCache) {
          sesCache = new SES({
            httpOptions: {
              connectTimeout: 3000,
              timeout: 5000,
            },
            maxRetries: 3,
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
      sendEmailToUser,
      sendSetTrialSessionCalendarEvent: ({ applicationContext, payload }) => {
        if (environment.stage === 'local') {
          return applicationContext
            .getUseCases()
            .generateNoticesForCaseTrialSessionCalendarInteractor(
              applicationContext,
              payload,
            );
        } else {
          return sendSetTrialSessionCalendarEvent({
            applicationContext,
            payload,
          });
        }
      },
    }),
    getMessagingClient: () => {
      if (!sqsCache) {
        sqsCache = new SQS({
          apiVersion: '2012-11-05',
          httpOptions: {
            connectTimeout: 3000,
            timeout: 5000,
          },
          maxRetries: 3,
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
      saveRequestResponse,
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
        notificationServiceCache = new AWS.SNS({
          httpOptions: {
            connectTimeout: 3000,
            timeout: 5000,
          },
          maxRetries: 3,
        });
      }
      return notificationServiceCache;
    },
    getPdfJs: () => {
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
    getScannerResourceUri: () => {
      return (
        process.env.SCANNER_RESOURCE_URI || 'http://localhost:10000/Resources'
      );
    },
    getSearchClient: () => {
      if (!searchClientCache) {
        if (environment.stage === 'local') {
          searchClientCache = new Client({
            node: environment.elasticsearchEndpoint,
          });
        } else {
          searchClientCache = new Client({
            ...AwsSigv4Signer({
              getCredentials: () =>
                new Promise((resolve, reject) => {
                  AWS.config.getCredentials((err, credentials) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(credentials as any);
                    }
                  });
                }),
              region: 'us-east-1',
            }),
            node: `https://${environment.elasticsearchEndpoint}:443`,
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
          httpOptions: {
            connectTimeout: 3000,
            timeout: 5000,
          },
          maxRetries: 3,
          region: 'us-east-1',
          s3ForcePathStyle: true,
        });
      }
      return s3Cache;
    },
    getUniqueId,
    getUseCaseHelpers,
    getUseCases,
    getUserGateway,
    getUtilities,
    getWorkerGateway: () => ({
      queueWork: (
        applicationContext: ServerApplicationContext,
        { message }: { message: WorkerMessage },
      ) => {
        if (applicationContext.environment.stage === 'local') {
          return workerLocal(applicationContext, { message });
        }
        return worker(applicationContext, { message });
      },
    }),
    isAuthorized,
    isCurrentColorActive,
    logger: {
      debug: (message, context?) => logger.debug(message, { context }),
      error: (message, context?) => logger.error(message, { context }),
      info: (message, context?) => logger.info(message, { context }),
      warn: (message, context?) => logger.warn(message, { context }),
    },
    setTimeout: (callback, timeout) => setTimeout(callback, timeout),
  };
};

export type ServerApplicationContext = ReturnType<
  typeof createApplicationContext
>;

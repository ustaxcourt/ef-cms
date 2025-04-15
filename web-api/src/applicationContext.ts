import * as barNumberGenerator from './persistence/dynamo/users/barNumberGenerator';
import * as pdfLib from 'pdf-lib';
import {
  CASE_INVENTORY_PAGE_SIZE,
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
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { WorkerMessage } from '@web-api/gateways/worker/workerRouter';
import { environment } from '@web-api/environment';
import { getBatchClient } from '@web-api/persistence/batch/getBatchClient';
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
import { getEmailClient } from './persistence/messages/getEmailClient';
import { getEnvironment, getUniqueId } from '../../shared/src/sharedAppContext';
import { getLogger } from '@web-api/utilities/logger/getLogger';
import { getNotificationClient } from '@web-api/notifications/notificationClient/getNotificationClient';
import { getNotificationGateway } from '@web-api/notifications/notificationClient/getNotificationGateway';
import { getNotificationService } from '@web-api/notifications/getNotificationService';
import { getPersistenceGateway } from './getPersistenceGateway';
import { getSearchClient } from '@web-api/persistence/elasticsearch/searchClient/getSearchClient';
import { getStorageClient } from '@web-api/persistence/s3/getStorageClient';
import { getUseCaseHelpers } from './getUseCaseHelpers';
import { getUseCases } from './getUseCases';
import { getUserGateway } from '@web-api/getUserGateway';
import { getUtilities } from './getUtilities';
import { isAuthorized } from '../../shared/src/authorization/authorizationClientService';
import { isCurrentColorActive } from './persistence/dynamo/helpers/isCurrentColorActive';
import { sendBulkTemplatedEmail } from './dispatchers/ses/sendBulkTemplatedEmail';
import { sendEmailEventToQueue } from './persistence/messages/sendEmailEventToQueue';
import { sendEmailToUser } from '@web-api/persistence/messages/sendEmailToUser';
import { sendNotificationOfSealing } from './dispatchers/sns/sendNotificationOfSealing';
import { sendSetTrialSessionCalendarEvent } from './persistence/messages/sendSetTrialSessionCalendarEvent';
import { sendSlackNotification } from './dispatchers/slack/sendSlackNotification';
import { sendZipperBatchJob } from '@web-api/dispatchers/batch/sendZipperBatchJob';
import { worker } from '@web-api/gateways/worker/worker';
import { workerLocal } from '@web-api/gateways/worker/workerLocal';
import axios from 'axios';
import pug from 'pug';
import sass from 'sass';
import { getEntityByName } from '@web-api/business/getEntityByName';
import { type SendBulkTemplatedEmailCommandInput } from '@aws-sdk/client-ses';
import { getMessagingClient } from '@web-api/gateways/message/getMessagingClient';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const createApplicationContext = (appContextUser = {}) => {
  return {
    barNumberGenerator,
    environment,
    getBatchClient,
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
      CASE_INVENTORY_PAGE_SIZE,
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
    getDispatchers: () => ({
      sendBulkTemplatedEmail,
      sendNotificationOfSealing:
        process.env.PROD_ENV_ACCOUNT_ID === process.env.AWS_ACCOUNT_ID
          ? sendNotificationOfSealing
          : () => {},
      sendSlackNotification,
      sendZipperBatchJob,
    }),
    getDocumentClient,
    getDocumentGenerators,
    getDynamoClient,
    getEmailClient,
    getEntityByName,
    getEnvironment,
    getHttpClient: () => axios,
    getIrsSuperuserEmail: () => process.env.IRS_SUPERUSER_EMAIL,
    getMessageGateway: () => ({
      sendEmailEventToQueue: async ({
        applicationContext,
        emailParams,
      }: {
        applicationContext: ServerApplicationContext;
        emailParams: SendBulkTemplatedEmailCommandInput;
      }) => {
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
    getMessagingClient,
    getNodeSass: () => {
      return sass;
    },
    getNotificationClient,
    getNotificationGateway,
    getNotificationService,
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
    getSearchClient,
    getSlackWebhookUrl: () => process.env.SLACK_WEBHOOK_URL,
    getStorageClient,
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
    logger: getLogger(),
    setTimeout: (callback: Function, timeout) => setTimeout(callback, timeout),
  };
};

export const applicationContext = createApplicationContext();

export type ServerApplicationContext = ReturnType<
  typeof createApplicationContext
>;

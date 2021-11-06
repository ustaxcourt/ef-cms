/* eslint-disable max-lines */
import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest, runCompute } from 'cerebral/test';
import { DynamoDB, S3 } from 'aws-sdk';
import { JSDOM } from 'jsdom';
import { SERVICE_INDICATOR_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../src/applicationContext';
import {
  back,
  createObjectURL,
  externalRoute,
  revokeObjectURL,
  router,
} from '../src/router';
import {
  calculateDifferenceInDays,
  calculateISODate,
  createISODateString,
  formatDateString,
  formatNow,
  prepareDateFromString,
} from '../../shared/src/business/utilities/DateHandler';
import { changeOfAddress } from '../../shared/src/business/utilities/documentGenerators/changeOfAddress';
import { countPagesInDocument } from '../../shared/src/business/useCaseHelper/countPagesInDocument';
import { coverSheet } from '../../shared/src/business/utilities/documentGenerators/coverSheet';
import {
  fakeData,
  getFakeFile,
} from '../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseMessages as formattedCaseMessagesComputed } from '../src/presenter/computeds/formattedCaseMessages';
import { formattedDocketEntries as formattedDocketEntriesComputed } from '../src/presenter/computeds/formattedDocketEntries';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { generateAndServeDocketEntry } from '../../shared/src/business/useCaseHelper/service/createChangeItems';
import { generatePdfFromHtmlInteractor } from '../../shared/src/business/useCases/generatePdfFromHtmlInteractor';
import { getCaseByDocketNumber } from '../../shared/src/persistence/dynamo/cases/getCaseByDocketNumber';
import { getCasesForUser } from '../../shared/src/persistence/dynamo/users/getCasesForUser';
import { getChromiumBrowser } from '../../shared/src/business/utilities/getChromiumBrowser';
import { getDocketNumbersByUser } from '../../shared/src/persistence/dynamo/cases/getDocketNumbersByUser';
import { getDocumentTypeForAddressChange } from '../../shared/src/business/utilities/generateChangeOfAddressTemplate';
import { getScannerInterface } from '../../shared/src/persistence/dynamsoft/getScannerMockInterface';
import { getUniqueId } from '../../shared/src/sharedAppContext.js';
import { getUserById } from '../../shared/src/persistence/dynamo/users/getUserById';
import {
  image1,
  image2,
} from '../../shared/src/business/useCases/scannerMockFiles';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { saveDocumentFromLambda } from '../../shared/src/persistence/s3/saveDocumentFromLambda';
import { saveWorkItem } from '../../shared/src/persistence/dynamo/workitems/saveWorkItem';
import { sendBulkTemplatedEmail } from '../../shared/src/dispatchers/ses/sendBulkTemplatedEmail';
import { sendServedPartiesEmails } from '../../shared/src/business/useCaseHelper/service/sendServedPartiesEmails';
import { setUserEmailFromPendingEmailInteractor } from '../../shared/src/business/useCases/users/setUserEmailFromPendingEmailInteractor';
import { socketProvider } from '../src/providers/socket';
import { socketRouter } from '../src/providers/socketRouter';
import { updateCase } from '../../shared/src/persistence/dynamo/cases/updateCase';
import { updateCaseAndAssociations } from '../../shared/src/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { updateDocketEntry } from '../../shared/src/persistence/dynamo/documents/updateDocketEntry';
import { updatePetitionerCasesInteractor } from '../../shared/src/business/useCases/users/updatePetitionerCasesInteractor';
import { updateUser } from '../../shared/src/persistence/dynamo/users/updateUser';
import { userMap } from '../../shared/src/test/mockUserTokenMap';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../src/presenter/computeds/workQueueHelper';
import FormDataHelper from 'form-data';
import axios from 'axios';
import jwt from 'jsonwebtoken';
const pdfLib = require('pdf-lib');
import { featureFlagHelper } from '../src/presenter/computeds/FeatureFlags/featureFlagHelper';
import pug from 'pug';
import qs from 'qs';
import riotRoute from 'riot-route';
import sass from 'sass';

const { CASE_TYPES_MAP, PARTY_TYPES } = applicationContext.getConstants();

const formattedDocketEntries = withAppContextDecorator(
  formattedDocketEntriesComputed,
);
const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);
const formattedCaseMessages = withAppContextDecorator(
  formattedCaseMessagesComputed,
);
const workQueueHelper = withAppContextDecorator(workQueueHelperComputed);

Object.assign(applicationContext, {
  getDocumentClient: () => {
    return new DynamoDB.DocumentClient({
      endpoint: 'http://localhost:8000',
      region: 'us-east-1',
    });
  },
  getEnvironment: () => ({
    dynamoDbTableName: 'efcms-local',
    stage: 'local',
  }),
  getScanner: getScannerInterface,
});

export const fakeFile = (() => {
  return getFakeFile();
})();

export const fakeFile1 = (() => {
  return getFakeFile(false, true);
})();

let s3Cache;

export const callCognitoTriggerForPendingEmail = async userId => {
  // mock application context similar to that in cognito-triggers.js
  const environment = {
    s3Endpoint: process.env.S3_ENDPOINT || 'http://localhost:9000',
  };
  const apiApplicationContext = {
    getCaseTitle: Case.getCaseTitle,
    getChromiumBrowser,
    getConstants: () => ({ MAX_SES_RETRIES: 6 }),
    getCurrentUser: () => ({}),
    getDispatchers: () => ({
      sendBulkTemplatedEmail,
    }),
    getDocumentClient: () => {
      return new DynamoDB.DocumentClient({
        endpoint: 'http://localhost:8000',
        region: 'us-east-1',
      });
    },
    getDocumentGenerators: () => ({ changeOfAddress, coverSheet }),
    getDocumentsBucketName: () => {
      return (
        process.env.DOCUMENTS_BUCKET_NAME || 'noop-documents-local-us-east-1'
      );
    },
    getEmailClient: () => {
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
    },
    getEnvironment: () => ({
      dynamoDbTableName: 'efcms-local',
      stage: process.env.STAGE,
    }),
    getIrsSuperuserEmail: () =>
      process.env.IRS_SUPERUSER_EMAIL || 'irssuperuser@example.com',
    getMessageGateway: () => ({
      sendUpdatePetitionerCasesMessage: ({
        applicationContext: appContext,
        user,
      }) => {
        return updatePetitionerCasesInteractor({
          applicationContext: appContext,
          user,
        });
      },
    }),
    getNodeSass: () => {
      return sass;
    },
    getPdfLib: () => {
      return pdfLib;
    },
    getPersistenceGateway: () => ({
      getCaseByDocketNumber,
      getCasesForUser,
      getDocketNumbersByUser,
      getDownloadPolicyUrl: () => {
        return {
          url: 'http://example.com',
        };
      },
      getUserById,
      saveDocumentFromLambda,
      saveWorkItem,
      updateCase,
      updateDocketEntry,
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
      return process.env.DOCUMENTS_BUCKET_NAME || '';
    },
    getUniqueId,
    getUseCaseHelpers: () => ({
      countPagesInDocument,
      generateAndServeDocketEntry,
      sendServedPartiesEmails,
      updateCaseAndAssociations,
    }),
    getUseCases: () => ({ generatePdfFromHtmlInteractor }),
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
      debug: () => {},
      error: () => {},
      info: () => {},
    },
  };

  const user = await getUserRecordById(userId);
  await setUserEmailFromPendingEmailInteractor(apiApplicationContext, {
    user,
  });
};

export const getFormattedDocumentQCMyInbox = async cerebralTest => {
  await cerebralTest.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
  });
  return runCompute(formattedWorkQueue, {
    state: cerebralTest.getState(),
  });
};

const featureFlagHelperComputed = withAppContextDecorator(featureFlagHelper);

export const getFeatureFlagHelper = cerebralTest => {
  return runCompute(featureFlagHelperComputed, {
    state: cerebralTest.getState(),
  });
};

export const getFormattedDocketEntriesForTest = async cerebralTest => {
  await cerebralTest.runSequence('gotoCaseDetailSequence', {
    docketNumber: cerebralTest.docketNumber,
  });
  return runCompute(formattedDocketEntries, {
    state: cerebralTest.getState(),
  });
};

export const contactPrimaryFromState = cerebralTest => {
  return cerebralTest.getState('caseDetail.petitioners.0');
};

export const contactSecondaryFromState = cerebralTest => {
  return cerebralTest.getState('caseDetail.petitioners.1');
};

export const getCaseMessagesForCase = async cerebralTest => {
  await cerebralTest.runSequence('gotoCaseDetailSequence', {
    docketNumber: cerebralTest.docketNumber,
  });
  return runCompute(formattedCaseMessages, {
    state: cerebralTest.getState(),
  });
};

const client = require('../../shared/src/persistence/dynamodbClientService');

export const getConnectionsByUserId = userId => {
  return client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user|${userId}`,
      ':prefix': 'connection',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
};

export const getConnection = connectionId => {
  return client.get({
    Key: {
      pk: `connection|${connectionId}`,
      sk: `connection|${connectionId}`,
    },
    applicationContext,
  });
};

export const getUserRecordById = userId => {
  return client.get({
    Key: {
      pk: `user|${userId}`,
      sk: `user|${userId}`,
    },
    applicationContext,
  });
};

export const setWhitelistIps = ips => {
  return client.put({
    Item: {
      ips,
      pk: 'allowed-terminal-ips',
      sk: 'allowed-terminal-ips',
    },
    applicationContext,
  });
};

export const setOpinionSearchEnabled = isEnabled => {
  return client.put({
    Item: {
      current: isEnabled,
      pk: 'internal-opinion-search-enabled',
      sk: 'internal-opinion-search-enabled',
    },
    applicationContext,
  });
};

export const getFormattedDocumentQCSectionInbox = async cerebralTest => {
  await cerebralTest.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'section',
  });
  return runCompute(formattedWorkQueue, {
    state: cerebralTest.getState(),
  });
};

export const getFormattedDocumentQCMyOutbox = async cerebralTest => {
  await cerebralTest.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'my',
  });
  return runCompute(formattedWorkQueue, {
    state: cerebralTest.getState(),
  });
};

export const getFormattedDocumentQCSectionOutbox = async cerebralTest => {
  await cerebralTest.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'section',
  });
  return runCompute(formattedWorkQueue, {
    state: cerebralTest.getState(),
  });
};

export const serveDocument = async ({
  cerebralTest,
  docketEntryId,
  docketNumber,
}) => {
  await cerebralTest.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
    docketEntryId,
    docketNumber,
  });

  await cerebralTest.runSequence('openConfirmInitiateServiceModalSequence');
  await cerebralTest.runSequence(
    'serveCourtIssuedDocumentFromDocketEntrySequence',
  );
};

export const createCourtIssuedDocketEntry = async ({
  cerebralTest,
  docketEntryId,
  docketNumber,
  eventCode,
  filingDate,
  trialLocation,
}) => {
  await cerebralTest.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
    docketEntryId,
    docketNumber,
  });

  if (eventCode) {
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'eventCode',
        value: eventCode,
      },
    );
  }

  await cerebralTest.runSequence(
    'updateCourtIssuedDocketEntryFormValueSequence',
    {
      key: 'judge',
      value: 'Judge Buch',
    },
  );

  if (trialLocation) {
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'trialLocation',
        value: trialLocation,
      },
    );
  }

  if (filingDate) {
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateMonth',
        value: filingDate.month,
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateDay',
        value: filingDate.day,
      },
    );
    await cerebralTest.runSequence(
      'updateCourtIssuedDocketEntryFormValueSequence',
      {
        key: 'filingDateYear',
        value: filingDate.year,
      },
    );
  }

  await cerebralTest.runSequence('submitCourtIssuedDocketEntrySequence');
};

export const getIndividualInboxCount = cerebralTest => {
  return runCompute(workQueueHelper, {
    state: cerebralTest.getState(),
  }).individualInboxCount;
};

export const getSectionInboxCount = cerebralTest => {
  return runCompute(workQueueHelper, {
    state: cerebralTest.getState(),
  }).sectionInboxCount;
};

export const getSectionInProgressCount = cerebralTest => {
  return runCompute(workQueueHelper, {
    state: cerebralTest.getState(),
  }).sectionInProgressCount;
};

export const getIndividualInProgressCount = cerebralTest => {
  return runCompute(workQueueHelper, {
    state: cerebralTest.getState(),
  }).individualInProgressCount;
};

export const findWorkItemByDocketNumber = (queue, docketNumber) => {
  return queue.find(workItem => workItem.docketNumber === docketNumber);
};

export const getNotifications = cerebralTest => {
  return cerebralTest.getState('notifications');
};

export const assignWorkItems = async (cerebralTest, to, workItems) => {
  const users = {
    adc: {
      name: 'test ADC',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
    docketclerk: {
      name: 'test Docketclerk',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
  };
  await cerebralTest.runSequence('selectAssigneeSequence', {
    assigneeId: users[to].userId,
    assigneeName: users[to].name,
  });
  for (let workItem of workItems) {
    await cerebralTest.runSequence('selectWorkItemSequence', {
      workItem,
    });
  }
  await cerebralTest.runSequence('assignSelectedWorkItemsSequence');
};

export const uploadExternalDecisionDocument = async cerebralTest => {
  const contactPrimary = contactPrimaryFromState(cerebralTest);

  cerebralTest.setState('form', {
    attachments: false,
    category: 'Decision',
    certificateOfService: false,
    certificateOfServiceDate: null,
    documentTitle: 'Agreed Computation for Entry of Decision',
    documentType: 'Agreed Computation for Entry of Decision',
    eventCode: 'ACED',
    filers: [contactPrimary.contactId],
    hasSupportingDocuments: false,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 115022,
    scenario: 'Standard',
    searchError: false,
    supportingDocument: null,
    supportingDocumentFile: null,
    supportingDocumentFreeText: null,
    supportingDocumentMetadata: null,
  });
  await cerebralTest.runSequence('submitExternalDocumentSequence');
};

export const uploadExternalRatificationDocument = async cerebralTest => {
  const contactPrimary = contactPrimaryFromState(cerebralTest);

  cerebralTest.setState('form', {
    attachments: false,
    category: 'Miscellaneous',
    certificateOfService: false,
    certificateOfServiceDate: null,
    documentTitle: 'Ratification of do the test',
    documentType: 'Ratification',
    eventCode: 'RATF',
    filers: [contactPrimary.contactId],
    freeText: 'do the test',
    hasSupportingDocuments: false,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 115022,
    scenario: 'Nonstandard B',
    searchError: false,
    supportingDocument: null,
    supportingDocumentFile: null,
    supportingDocumentFreeText: null,
    supportingDocumentMetadata: null,
  });
  await cerebralTest.runSequence('submitExternalDocumentSequence');
};

export const uploadProposedStipulatedDecision = async cerebralTest => {
  cerebralTest.setState('form', {
    attachments: false,
    category: 'Decision',
    certificateOfService: false,
    certificateOfServiceDate: null,
    documentTitle: 'Proposed Stipulated Decision',
    documentType: 'Proposed Stipulated Decision',
    eventCode: 'PSDE',
    hasSecondarySupportingDocuments: false,
    hasSupportingDocuments: false,
    partyIrsPractitioner: true,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 115022,
    privatePractitioners: [],
    scenario: 'Standard',
    searchError: false,
  });
  await cerebralTest.runSequence('submitExternalDocumentSequence');
};

export const uploadPetition = async (
  cerebralTest,
  overrides = {},
  loginUsername = 'petitioner@example.com',
) => {
  if (!userMap[loginUsername]) {
    throw new Error(`Unable to log into test as ${loginUsername}`);
  }
  const user = {
    ...userMap[loginUsername],
    sub: userMap[loginUsername].userId,
  };

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const petitionMetadata = {
    caseType: overrides.caseType || CASE_TYPES_MAP.cdp,
    contactPrimary: overrides.contactPrimary || {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: user.email,
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      state: 'CT',
    },
    contactSecondary: overrides.contactSecondary || {},
    filingType: 'Myself',
    hasIrsNotice: false,
    partyType: overrides.partyType || PARTY_TYPES.petitioner,
    preferredTrialCity: overrides.preferredTrialCity || 'Seattle, Washington',
    procedureType: overrides.procedureType || 'Regular',
  };

  const petitionFileId = '1f1aa3f7-e2e3-43e6-885d-4ce341588c76';
  const stinFileId = '2efcd272-da92-4e31-bedc-28cdad2e08b0';

  //create token
  const userToken = jwt.sign(user, 'secret');

  const data = {
    petitionFileId,
    petitionMetadata,
    stinFileId,
  };

  if (overrides.ownershipDisclosureFileId) {
    data.ownershipDisclosureFileId = overrides.ownershipDisclosureFileId;
  }

  const response = await axios.post('http://localhost:4000/cases', data, {
    headers: {
      Authorization: `Bearer ${userToken}`,
    },
  });

  cerebralTest.setState('caseDetail', response.data);
  return response.data;
};

export const loginAs = (cerebralTest, user) =>
  it(`login as ${user}`, async () => {
    await cerebralTest.runSequence('signOutSequence');

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'name',
      value: user,
    });

    await cerebralTest.runSequence('submitLoginSequence', {
      path: '/',
    });

    expect(cerebralTest.getState('user.email')).toBeDefined();
  });

export const setupTest = ({ useCases = {} } = {}) => {
  let cerebralTest;
  global.FormData = FormDataHelper;
  global.Blob = () => {
    return fakeFile;
  };
  global.File = () => {
    return fakeFile;
  };
  global.WebSocket = require('websocket').w3cwebsocket;
  const dom = new JSDOM(
    `<!DOCTYPE html>
<body>
  <input type="file" />
</body>`,
    {
      url: 'http://localhost',
    },
  );

  presenter.state = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  presenter.providers.applicationContext = applicationContext;

  const {
    initialize: initializeSocketProvider,
    start,
    stop: stopSocket,
  } = socketProvider({
    socketRouter,
  });
  presenter.providers.socket = { start, stop: stopSocket };

  global.window = {
    ...dom.window,
    DOMParser: () => {
      return {
        parseFromString: () => {
          return {
            children: [
              {
                innerHTML: 'something',
              },
            ],
            querySelector: () => {},
          };
        },
      };
    },
    URL: {
      createObjectURL: () => {
        return fakeData;
      },
      revokeObjectURL: () => {},
    },
    document: {},
    localStorage: {
      getItem: () => null,
      removeItem: () => null,
      setItem: () => null,
    },
    location: { replace: jest.fn() },
    open: url => {
      cerebralTest.setState('openedUrl', url);
      return {
        close: jest.fn(),
        document: {
          write: jest.fn(),
        },
        location: '',
      };
    },
    pdfjsObj: {
      getData: () => Promise.resolve(getFakeFile(true)),
    },
  };

  cerebralTest = CerebralTest(presenter);
  cerebralTest.getSequence = seqName => obj =>
    cerebralTest.runSequence(seqName, obj);
  cerebralTest.closeSocket = stopSocket;

  const originalUseCases = applicationContext.getUseCases();
  presenter.providers.applicationContext.getUseCases = () => {
    return {
      ...originalUseCases,
      ...useCases,
      loadPDFForSigningInteractor: () => Promise.resolve(null),
    };
  };

  const constantsOverrides = {
    CASE_SEARCH_PAGE_SIZE: 1,
    DEADLINE_REPORT_PAGE_SIZE: 1,
  };
  const originalConstants = applicationContext.getConstants();
  presenter.providers.applicationContext.getConstants = () => {
    return {
      ...originalConstants,
      ...constantsOverrides,
    };
  };

  presenter.state = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  const routes = [];

  presenter.providers.router = {
    back,
    createObjectURL,
    externalRoute,
    openInNewTab: (routeToGoTo = '/') => gotoRoute(routes, routeToGoTo),
    revokeObjectURL,
    route: (routeToGoTo = '/') => gotoRoute(routes, routeToGoTo),
  };

  cerebralTest = CerebralTest(presenter);
  cerebralTest.getSequence = seqName => obj =>
    cerebralTest.runSequence(seqName, obj);
  cerebralTest.closeSocket = stopSocket;
  cerebralTest.applicationContext = applicationContext;

  cerebralTest.setState('constants', applicationContext.getConstants());

  router.initialize(cerebralTest, (route, cb) => {
    routes.push({
      cb,
      route,
    });
  });
  initializeSocketProvider(cerebralTest);

  return cerebralTest;
};

const mockQuery = routeToGoTo => {
  const paramsString = routeToGoTo.split('?')[1];
  return qs.parse(paramsString);
};

export const gotoRoute = (routes, routeToGoTo) => {
  for (let route of routes) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regex = new RegExp(
      route.route.replace(/\*/g, '([a-z\\-A-Z0-9]+)').replace(/\.\./g, '(.*)') +
        '$',
    );
    if (routeToGoTo.match(regex)) {
      const match = regex.exec(routeToGoTo);
      if (match != null) {
        const args = match.splice(1);
        riotRoute.query = () => mockQuery(routeToGoTo);
        return route.cb.call(this, ...args);
      }
      return null;
    }
  }
  throw new Error(`route ${routeToGoTo} not found`);
};

export const viewCaseDetail = async ({ cerebralTest, docketNumber }) => {
  await cerebralTest.runSequence('gotoCaseDetailSequence', {
    docketNumber,
  });
};

export const wait = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

export const refreshElasticsearchIndex = async (time = 2000) => {
  // refresh all ES indices:
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-refresh.html#refresh-api-all-ex
  await axios.post('http://localhost:9200/_refresh');
  await axios.post('http://localhost:9200/_flush');
  return await wait(time);
};

export const base64ToUInt8Array = b64 => {
  const binaryStr = Buffer.from(b64, 'base64').toString('binary');
  const len = binaryStr.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return bytes;
};

export const setBatchPages = ({ cerebralTest }) => {
  const selectedDocumentType = cerebralTest.getState(
    'currentViewMetadata.documentSelectedForScan',
  );
  let batches = cerebralTest.getState(
    `scanner.batches.${selectedDocumentType}`,
  );

  cerebralTest.setState(
    `scanner.batches.${selectedDocumentType}`,
    batches.map(batch => ({
      ...batch,
      pages: [base64ToUInt8Array(image1), base64ToUInt8Array(image2)],
    })),
  );
};

export const getPetitionDocumentForCase = caseDetail => {
  // In our tests, we had numerous instances of `case.docketEntries[0]`, which would
  // return the petition document most of the time, but occasionally fail,
  // producing unintended results.
  return caseDetail.docketEntries.find(doc => doc.documentType === 'Petition');
};

export const getPetitionWorkItemForCase = caseDetail => {
  const petitionDocument = getPetitionDocumentForCase(caseDetail);
  return petitionDocument.workItem;
};

export const getTextByCount = count => {
  const baseText =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate efficitur ante, at placerat.';
  const baseCount = baseText.length;

  let resultText = baseText;
  if (count > baseCount) {
    for (let i = 1; i < Math.ceil(count / baseCount); i++) {
      resultText += baseText;
    }
  }

  return resultText.slice(0, count);
};

export const embedWithLegalIpsumText = (phrase = '') => {
  return `While this license do not apply to, the licenses granted by such Contributor under Sections 2.1(b) and 2.2(b) are revoked effective as of the provisions set forth in the case of each Contributor, changes to the Recipient. The term of this Agreement, and b) allow the Commercial Contributor in writing by the Licensor accepting any such claim at its own expense. For example, a Contributor might include the Contribution, nor to (ii) Contributions of other Contributors.

  Therefore, if a Contributor with respect to some or all of the Standard Version. ${phrase} You may Distribute your Modified Version complies with the preceding Paragraph, for commercial or non-commercial purposes, provided that you duplicate all of the General Public License applies to text developed by openSEAL (http://www.openseal.org/)." Alternately, this acknowledgment may appear in the form of the <ORGANIZATION> nor the names of the Agreement will not have their licenses terminated so long as the Derived Program to replace the Derived Program from a web site). Distribution of Modified Versions is governed by the Copyright Holder may not change the License at http://www.opensource.apple.com/apsl/ and read it before using this software for any purpose, but the Licensor except as expressly stated in Sections 2(a) and 2(b) above, Recipient receives no rights or otherwise.
  
  As a condition to exercising the rights set forth in the documentation and/or other rights consistent with the Work can be reasonably considered independent and separate works in conjunction with the library. If this is to make arrangements wholly outside of your status as Current Maintainer. If the Recipient shall meet all of the initial Contributor, the initial Contributor, the initial grant or subsequently acquired, any and all related documents be drafted in English.`;
};

export const updateForm = async (cerebralTest, formValues, sequenceName) => {
  for (let [key, value] of Object.entries(formValues)) {
    await cerebralTest.runSequence(sequenceName, {
      key,
      value,
    });
  }
};

export const updateOpinionForm = async (cerebralTest, formValues) => {
  await cerebralTest.runSequence('clearAdvancedSearchFormSequence', {
    formType: 'opinionSearch',
  });

  await updateForm(
    cerebralTest,
    formValues,
    'updateAdvancedOpinionSearchFormValueSequence',
  );
};

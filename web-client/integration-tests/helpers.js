/* eslint-disable jest/no-export */
import { CerebralTest, runCompute } from 'cerebral/test';
import { DynamoDB } from 'aws-sdk';
import { JSDOM } from 'jsdom';
import { applicationContext } from '../src/applicationContext';
import {
  back,
  createObjectURL,
  externalRoute,
  revokeObjectURL,
  router,
} from '../src/router';
import {
  fakeData,
  getFakeFile,
} from '../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { formattedCaseMessages as formattedCaseMessagesComputed } from '../src/presenter/computeds/formattedCaseMessages';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { getScannerInterface } from '../../shared/src/persistence/dynamsoft/getScannerMockInterface';
import {
  image1,
  image2,
} from '../../shared/src/business/useCases/scannerMockFiles';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { socketProvider } from '../src/providers/socket';
import { socketRouter } from '../src/providers/socketRouter';
import { userMap } from '../../shared/src/test/mockUserTokenMap';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueHelper as workQueueHelperComputed } from '../src/presenter/computeds/workQueueHelper';
import FormData from 'form-data';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import queryString from 'query-string';
import riotRoute from 'riot-route';

const { CASE_TYPES_MAP, PARTY_TYPES } = applicationContext.getConstants();

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
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
    stage: 'local',
  }),
  getScanner: getScannerInterface,
});

export const fakeFile = (() => {
  return getFakeFile();
})();

export const getFormattedDocumentQCMyInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedCaseDetailForTest = async test => {
  await test.runSequence('gotoCaseDetailSequence', {
    docketNumber: test.docketNumber,
  });
  return runCompute(formattedCaseDetail, {
    state: test.getState(),
  });
};

export const getCaseMessagesForCase = async test => {
  await test.runSequence('gotoCaseDetailSequence', {
    docketNumber: test.docketNumber,
  });
  return runCompute(formattedCaseMessages, {
    state: test.getState(),
  });
};

const client = require('../../shared/src/persistence/dynamodbClientService');

export const getEmailsForAddress = address => {
  return client.query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
    },
    ExpressionAttributeValues: {
      ':pk': `email-${address}`,
    },
    KeyConditionExpression: '#pk = :pk',
    applicationContext,
  });
};

export const deleteEmails = emails => {
  return Promise.all(
    emails.map(email =>
      client.delete({
        applicationContext,
        key: {
          pk: email.pk,
          sk: email.sk,
        },
      }),
    ),
  );
};

export const getFormattedDocumentQCSectionInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'section',
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedDocumentQCMyOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'my',
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedDocumentQCSectionOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'section',
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const serveDocument = async ({ docketNumber, documentId, test }) => {
  await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
    docketNumber,
    documentId,
  });

  await test.runSequence('openConfirmInitiateServiceModalSequence');
  await test.runSequence('serveCourtIssuedDocumentFromDocketEntrySequence');
};

export const createCourtIssuedDocketEntry = async ({
  docketNumber,
  documentId,
  eventCode,
  test,
  trialLocation,
}) => {
  await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
    docketNumber,
    documentId,
  });

  if (eventCode) {
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: eventCode,
    });
  }

  await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
    key: 'judge',
    value: 'Judge Buch',
  });

  if (trialLocation) {
    await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: trialLocation,
    });
  }

  await test.runSequence('submitCourtIssuedDocketEntrySequence');
};

export const getInboxCount = test => {
  return runCompute(workQueueHelper, {
    state: test.getState(),
  }).inboxCount;
};

export const findWorkItemByDocketNumber = (queue, docketNumber) => {
  return queue.find(workItem => workItem.docketNumber === docketNumber);
};

export const getNotifications = test => {
  return test.getState('notifications');
};

export const assignWorkItems = async (test, to, workItems) => {
  const users = {
    adc: {
      name: 'Test ADC',
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    },
    docketclerk: {
      name: 'Test Docketclerk',
      userId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    },
  };
  await test.runSequence('selectAssigneeSequence', {
    assigneeId: users[to].userId,
    assigneeName: users[to].name,
  });
  for (let workItem of workItems) {
    await test.runSequence('selectWorkItemSequence', {
      workItem,
    });
  }
  await test.runSequence('assignSelectedWorkItemsSequence');
};

export const uploadExternalDecisionDocument = async test => {
  test.setState('form', {
    attachments: false,
    category: 'Decision',
    certificateOfService: false,
    certificateOfServiceDate: null,
    documentTitle: 'Agreed Computation for Entry of Decision',
    documentType: 'Agreed Computation for Entry of Decision',
    eventCode: 'ACED',
    hasSupportingDocuments: false,
    partyPrimary: true,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 115022,
    scenario: 'Standard',
    searchError: false,
    serviceDate: null,
    supportingDocument: null,
    supportingDocumentFile: null,
    supportingDocumentFreeText: null,
    supportingDocumentMetadata: null,
  });
  await test.runSequence('submitExternalDocumentSequence');
};

export const uploadProposedStipulatedDecision = async test => {
  test.setState('form', {
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
  await test.runSequence('submitExternalDocumentSequence');
};

export const uploadPetition = async (
  test,
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
    contactPrimary: {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: COUNTRY_TYPES.DOMESTIC,
      email: user.email,
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
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

  test.setState('caseDetail', response.data);

  return response.data;
};

export const loginAs = (test, user) => {
  // eslint-disable-next-line jest/expect-expect
  return it(`login as ${user}`, async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'name',
      value: user,
    });

    await test.runSequence('submitLoginSequence', {
      path: '/',
    });
  });
};

export const setupTest = ({ useCases = {} } = {}) => {
  let test;
  global.FormData = FormData;
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

  presenter.providers.applicationContext = applicationContext;
  const { initialize: initializeSocketProvider, start, stop } = socketProvider({
    socketRouter,
  });
  presenter.providers.socket = { start, stop };

  test = CerebralTest(presenter);
  test.getSequence = name => async obj => await test.runSequence(name, obj);
  test.closeSocket = stop;
  test.applicationContext = applicationContext;

  const { window } = dom;

  global.window = {
    ...window,
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
    location: {},
    open: url => {
      test.setState('openedUrl', url);
    },
    pdfjsObj: {
      getData: () => Promise.resolve(getFakeFile(true)),
    },
  };

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

  test = CerebralTest(presenter);
  test.getSequence = name => async obj => {
    const result = await test.runSequence(name, obj);
    return result;
  };
  test.closeSocket = stop;

  test.setState('constants', applicationContext.getConstants());

  router.initialize(test, (route, cb) => {
    routes.push({
      cb,
      route,
    });
  });
  initializeSocketProvider(test);

  return test;
};

const mockQuery = routeToGoTo => {
  const paramsString = routeToGoTo.split('?')[1];
  return queryString.parse(paramsString);
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

export const viewCaseDetail = async ({ docketNumber, test }) => {
  await test.runSequence('gotoCaseDetailSequence', {
    docketNumber,
  });
};

export const wait = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
};

export const refreshElasticsearchIndex = async () => {
  // refresh all ES indices:
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-refresh.html#refresh-api-all-ex
  await axios.post('http://localhost:9200/_refresh');
  await axios.post('http://localhost:9200/_flush');
  return await wait(2000);
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

export const setBatchPages = ({ test }) => {
  const selectedDocumentType = test.getState(
    'currentViewMetadata.documentSelectedForScan',
  );
  let batches = test.getState(`scanner.batches.${selectedDocumentType}`);

  test.setState(
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
  return caseDetail.docketEntries.find(
    document => document.documentType === 'Petition',
  );
};

export const getPetitionWorkItemForCase = caseDetail => {
  const petitionDocument = getPetitionDocumentForCase(caseDetail);
  return petitionDocument.workItem;
};

/* eslint-disable jest/no-export */
import { CerebralTest, runCompute } from 'cerebral/test';
import { DynamoDB } from 'aws-sdk';
import { JSDOM } from 'jsdom';
import { PARTY_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../src/applicationContext';
import {
  back,
  createObjectURL,
  externalRoute,
  openInNewTab,
  revokeObjectURL,
  router,
} from '../src/router';
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

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);
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

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
export const fakeFile = (() => {
  const myFile = new Buffer.from(fakeData, 'base64', {
    type: 'application/pdf',
  });
  myFile.name = 'fakeFile.pdf';
  myFile.size = myFile.length;
  return myFile;
})();

export const getFormattedDocumentQCMyInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
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
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedDocumentQCMyOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'my',
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedDocumentQCSectionOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'section',
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const signProposedStipulatedDecision = async (test, stipDecision) => {
  await viewDocumentDetailMessage({
    docketNumber: stipDecision.docketNumber,
    documentId: stipDecision.document.documentId,
    messageId: stipDecision.currentMessage.messageId,
    test,
    workItemIdToMarkAsRead: stipDecision.workItemId,
  });

  await test.runSequence('gotoSignPDFDocumentSequence', {
    docketNumber: stipDecision.docketNumber,
    documentId: stipDecision.document.documentId,
    pageNumber: 1,
  });

  await test.runSequence('setPDFSignatureDataSequence', {
    signatureData: {
      scale: 1,
      x: 100,
      y: 100,
    },
  });

  test.setState('form', {
    assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
    message: 'serve this please!',
    section: 'docket',
  });

  await test.runSequence('completeDocumentSigningSequence');
};

export const serveDocument = async ({ docketNumber, documentId, test }) => {
  await test.runSequence('gotoEditCourtIssuedDocketEntrySequence', {
    docketNumber,
    documentId,
  });

  await test.runSequence('openConfirmInitiateServiceModalSequence');
  await test.runSequence('serveCourtIssuedDocumentSequence');
};

export const createCourtIssuedDocketEntry = async ({
  docketNumber,
  documentId,
  test,
}) => {
  await test.runSequence('gotoDocumentDetailSequence', {
    docketNumber,
    documentId,
  });

  await test.runSequence('gotoAddCourtIssuedDocketEntrySequence', {
    docketNumber,
    documentId,
  });

  await test.runSequence('updateCourtIssuedDocketEntryFormValueSequence', {
    key: 'judge',
    value: 'Judge Buch',
  });

  await test.runSequence('submitCourtIssuedDocketEntrySequence');
};

export const getFormattedMyInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedSectionInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'section',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedMyOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'my',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getFormattedSectionOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'section',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

export const getInboxCount = test => {
  return runCompute(workQueueHelper, {
    state: test.getState(),
  }).inboxCount;
};

export const findWorkItemByCaseId = (queue, caseId) => {
  return queue.find(workItem => workItem.caseId === caseId);
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
    serviceDate: null,
  });
  await test.runSequence('submitExternalDocumentSequence');
};

export const createMessage = async ({ assigneeId, message, test }) => {
  test.setState('form', {
    assigneeId,
    message,
    section: 'docket',
  });

  await test.runSequence('createWorkItemSequence');
};

export const forwardWorkItem = async (test, to, workItemId, message) => {
  let assigneeId;
  if (to === 'docketclerk1') {
    assigneeId = '2805d1ab-18d0-43ec-bafb-654e83405416';
  }
  test.setState('form', {
    [workItemId]: {
      assigneeId: assigneeId,
      forwardMessage: message,
      section: 'petitions',
    },
  });

  await test.runSequence('submitForwardSequence', {
    workItemId,
  });
};

export const uploadPetition = async (
  test,
  overrides = {},
  loginUsername = 'petitioner',
) => {
  const user = {
    ...userMap[loginUsername],
    sub: userMap[loginUsername].userId,
  };

  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const petitionMetadata = {
    caseType: overrides.caseType || 'CDP (Lien/Levy)',
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

  const response = await axios.post(
    'http://localhost:4000/cases',
    {
      petitionFileId,
      petitionMetadata,
      stinFileId,
    },
    {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    },
  );

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

  presenter.state.baseUrl = process.env.API_URL || 'http://localhost:4000';

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
  };

  const originalUseCases = applicationContext.getUseCases();
  presenter.providers.applicationContext.getUseCases = () => {
    return {
      ...originalUseCases,
      ...useCases,
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
    openInNewTab,
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

export const viewDocumentDetailMessage = async ({
  docketNumber,
  documentId,
  messageId,
  test,
  workItemIdToMarkAsRead,
}) => {
  await test.runSequence('gotoDocumentDetailSequence', {
    docketNumber,
    documentId,
    messageId,
    workItemIdToMarkAsRead,
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
  return await wait(1500);
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
  // In our tests, we had numerous instances of `case.documents[0]`, which would
  // return the petition document most of the time, but occasionally fail,
  // producing unintended results.
  return caseDetail.documents.find(
    document => document.documentType === 'Petition',
  );
};

export const getPetitionWorkItemForCase = caseDetail => {
  const petitionDocument = getPetitionDocumentForCase(caseDetail);
  return petitionDocument.workItems[0];
};

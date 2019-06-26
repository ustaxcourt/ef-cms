import { CASE_CAPTION_POSTFIX } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';
import { applicationContext } from '../src/applicationContext';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueHelper } from '../src/presenter/computeds/workQueueHelper';
import FormData from 'form-data';
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
} = require('../../shared/src/business/entities/contacts/PetitionContact');

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = new Buffer.from(fakeData, 'base64', {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

exports.getFormattedDocumentQCMyInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getFormattedDocumentQCSectionInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'section',
    workQueueIsInternal: false,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getFormattedMyInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'my',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getFormattedSectionInbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'inbox',
    queue: 'section',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getFormattedMyOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'my',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getFormattedSectionOutbox = async test => {
  await test.runSequence('chooseWorkQueueSequence', {
    box: 'outbox',
    queue: 'section',
    workQueueIsInternal: true,
  });
  return runCompute(formattedWorkQueue, {
    state: test.getState(),
  });
};

exports.getInboxCount = test => {
  return runCompute(workQueueHelper, {
    state: test.getState(),
  }).inboxCount;
};

exports.findWorkItemByCaseId = (queue, caseId) => {
  return queue.find(workItem => workItem.caseId === caseId);
};

exports.getNotifications = test => {
  return test.getState('notifications');
};

exports.assignWorkItems = async (test, to, workItems) => {
  const users = {
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

exports.uploadExternalDecisionDocument = async test => {
  test.setState('form', {
    attachments: false,
    category: 'Decision',
    certificateOfService: false,
    certificateOfServiceDate: null,
    documentTitle: 'Agreed Computation for Entry of Decision',
    documentType: 'Agreed Computation for Entry of Decision',
    eventCode: 'ACED',
    exhibits: false,
    hasSupportingDocuments: false,
    partyPrimary: true,
    primaryDocumentFile: fakeFile,
    primaryDocumentFileSize: 115022,
    scenario: 'Standard',
    searchError: false,
    secondaryDocument: {},
    serviceDate: 'undefined-undefined-undefined',
    supportingDocument: null,
    supportingDocumentFile: null,
    supportingDocumentFreeText: null,
    supportingDocumentMetadata: null,
  });
  await test.runSequence('submitExternalDocumentSequence');
};

exports.createMessage = async ({ assigneeId, message, test }) => {
  test.setState('form', {
    assigneeId,
    message,
    section: 'docket',
  });

  await test.runSequence('createWorkItemSequence');
};

exports.forwardWorkItem = async (test, to, workItemId, message) => {
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

exports.uploadPetition = async test => {
  test.setState('form', {
    caseType: 'CDP (Lien/Levy)',
    contactPrimary: {
      address1: '734 Cowley Parkway',
      address2: 'Cum aut velit volupt',
      address3: 'Et sunt veritatis ei',
      city: 'Et id aut est velit',
      countryType: 'domestic',
      name: 'Mona Schultz',
      phone: '+1 (884) 358-9729',
      postalCode: '77546',
      state: 'CT',
    },
    contactSecondary: {},
    filingType: 'Myself',
    hasIrsNotice: false,
    partyType: 'Petitioner',
    preferredTrialCity: 'Lubbock, Texas',
    procedureType: 'Regular',
    signature: true,
  });

  await test.runSequence('updatePetitionValueSequence', {
    key: 'petitionFile',
    value: fakeFile,
  });

  await test.runSequence('updatePetitionValueSequence', {
    key: 'petitionFileSize',
    value: 1,
  });

  await test.runSequence('updatePetitionValueSequence', {
    key: 'stinFile',
    value: fakeFile,
  });

  await test.runSequence('updatePetitionValueSequence', {
    key: 'stinFileSize',
    value: 1,
  });

  await test.runSequence('submitFilePetitionSequence');

  await exports.waitForRouter();

  return test.getState('caseDetail');
};

exports.waitForRouter = () => {
  return new Promise(resolve => {
    setImmediate(() => resolve(true));
  });
};

exports.loginAs = async (test, user) => {
  await test.runSequence('updateFormValueSequence', {
    key: 'name',
    value: user,
  });
  await test.runSequence('submitLoginSequence');
  await exports.waitForRouter();
};

exports.setupTest = () => {
  let test;
  global.FormData = FormData;
  global.Blob = () => {};
  presenter.providers.applicationContext = applicationContext;
  presenter.providers.router = {
    route: async url => {
      if (url === `/case-detail/${test.docketNumber}`) {
        await test.runSequence('gotoCaseDetailSequence', {
          docketNumber: test.docketNumber,
        });
      }

      if (url === '/') {
        await test.runSequence('gotoDashboardSequence');
      }
    },
  };

  presenter.state = mapValues(presenter.state, value => {
    if (isFunction(value)) {
      return withAppContextDecorator(value, applicationContext);
    }
    return value;
  });

  test = CerebralTest(presenter);

  global.window = {
    localStorage: {
      removeItem: () => null,
      setItem: () => null,
    },
  };

  test.setState('constants', {
    CASE_CAPTION_POSTFIX,
    COUNTRY_TYPES,
    PARTY_TYPES,
    TRIAL_CITIES,
  });

  return test;
};

exports.viewDocumentDetailMessage = async ({
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

/**
 * This is needed because some sequences run router.route which runs another test.runSequence which
 * adds an new entry on the node event loop and causes the tests to continue running even though the sequence is
 * not yet done.
 *
 * @returns {Promise} resolves when the setImmediate is done
 */
exports.waitForRouter = () => {
  return new Promise(resolve => {
    setImmediate(() => resolve(true));
  });
};

import { CerebralTest } from 'cerebral/test';
import { isFunction, mapValues } from 'lodash';
import { runCompute } from 'cerebral/test';
import FormData from 'form-data';

import { CASE_CAPTION_POSTFIX } from '../../shared/src/business/entities/Case';
import { TRIAL_CITIES } from '../../shared/src/business/entities/TrialCities';
import { applicationContext } from '../src/applicationContext';
import { formattedWorkQueue as formattedWorkQueueComputed } from '../src/presenter/computeds/formattedWorkQueue';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import { workQueueHelper } from '../src/presenter/computeds/workQueueHelper';

const formattedWorkQueue = withAppContextDecorator(formattedWorkQueueComputed);

const {
  PARTY_TYPES,
  COUNTRY_TYPES,
} = require('../../shared/src/business/entities/contacts/PetitionContact');

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

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';
const fakeFile = new Buffer.from(fakeData, 'base64', {
  type: 'application/pdf',
});
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

const waitForRouter = () => {
  return new Promise(resolve => {
    setImmediate(() => resolve(true));
  });
};

async function loginAs(user) {
  await test.runSequence('updateFormValueSequence', {
    key: 'name',
    value: user,
  });
  await test.runSequence('submitLoginSequence');
}

async function createCase(test) {
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
  return await waitForRouter();
}

describe('Create a work item', () => {
  beforeAll(() => {
    jest.setTimeout(300000);

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
  });

  let caseDetail;
  let qcMyInboxCountBefore;
  let qcSectionInboxCountBefore;
  let notificationsBefore;

  it('get initial docket clerk inbox counts', async () => {
    await loginAs('docketclerk');
    await waitForRouter();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: false,
    });
    qcMyInboxCountBefore = await runCompute(workQueueHelper, {
      state: test.getState(),
    }).inboxCount;

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });
    qcSectionInboxCountBefore = await runCompute(workQueueHelper, {
      state: test.getState(),
    }).inboxCount;

    notificationsBefore = test.getState('notifications');
  });

  it('create the case for this test', async () => {
    await loginAs('taxpayer');
    await waitForRouter();
    await createCase(test);
    caseDetail = test.getState('caseDetail');
  });

  it('upload an external document to the case', async () => {
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
    await test.runSequence('submitExternalDocumentSequence');
    await test.runSequence('submitExternalDocumentSequence');
  });

  it('docket clerk views section document qc inbox and checks inbox counts increase by 3', async () => {
    await loginAs('docketclerk');
    await waitForRouter();

    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      workQueueIsInternal: false,
    });

    const documentQCSectionInbox = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });

    const decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(decisionWorkItem).toMatchObject({
      document: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = await runCompute(workQueueHelper, {
      state: test.getState(),
    }).inboxCount;
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 3);
  });

  it('docket clerk assigns the 3 decision work items to self', async () => {
    const documentQCSectionInbox = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    const decisionWorkItems = documentQCSectionInbox.filter(
      workItem => workItem.caseId === caseDetail.caseId,
    );

    await test.runSequence('selectAssigneeSequence', {
      assigneeId: '1805d1ab-18d0-43ec-bafb-654e83405416',
      assigneeName: 'Test Docketclerk',
    });
    for (let workItem of decisionWorkItems) {
      await test.runSequence('selectWorkItemSequence', {
        workItem,
      });
    }
    await test.runSequence('assignSelectedWorkItemsSequence');
  });

  it('docket clerk views their individual document qc inbox and checks inbox counts increase by 3', async () => {
    await test.runSequence('chooseWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
      workQueueIsInternal: false,
    });
    const documentQCMyInbox = runCompute(formattedWorkQueue, {
      state: test.getState(),
    });
    const decisionWorkItem = documentQCMyInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(decisionWorkItem).toMatchObject({
      document: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
    const qcMyInboxCountAfter = await runCompute(workQueueHelper, {
      state: test.getState(),
    }).inboxCount;
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 3);
  });

  it('check that unread notifications increase by 3', async () => {
    expect(test.getState('notifications')).toMatchObject({
      myInboxUnreadCount: notificationsBefore.myInboxUnreadCount,
      qcUnreadCount: notificationsBefore.qcUnreadCount + 3,
    });
  });
});

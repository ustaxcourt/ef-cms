import {
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PETITIONS_SECTION,
} from '../../shared/src/business/entities/EntityConstants';
import {
  assignWorkItems,
  contactPrimaryFromState,
  embedWithLegalIpsumText,
  getFormattedDocumentQCSectionInbox,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { createNewMessageOnCase } from './journey/createNewMessageOnCase';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';

const docketSectionMessage = 'To CSS under Docket Section';
const petitionsSectionMessage = 'To CSS under Petitions Section';
const seedCaseServicesSupervisorUserid = '35959d1a-0981-40b2-a93d-f65c7977db52';
const seededDocketNumber = '105-20';

describe('Case Services Supervisor Messages Journey', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Creates the first case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      contactPrimary: {
        address1: '734 Cowley Parkway',
        city: 'Amazing',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'welcome to flavortown',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'AZ',
      },
    });

    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentContents: embedWithLegalIpsumText('magic'),
    documentTitle: 'some title',
    eventCode: 'O',
    expectedDocumentType: 'Order',
    signedAtFormatted: '01/02/2020',
  });
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 0);

  loginAs(cerebralTest, 'admissionsclerk@example.com');
  createNewMessageOnCase(cerebralTest, {
    docketNumber: seededDocketNumber,
    preserveCreatedMessage: false,
    subject: docketSectionMessage,
    toSection: DOCKET_SECTION,
    toUserId: seedCaseServicesSupervisorUserid,
  });

  createNewMessageOnCase(cerebralTest, {
    docketNumber: seededDocketNumber,
    preserveCreatedMessage: false,
    subject: petitionsSectionMessage,
    toSection: PETITIONS_SECTION,
    toUserId: seedCaseServicesSupervisorUserid,
  });

  loginAs(cerebralTest, 'caseservicessupervisor@example.com');
  it('case services supervisor views my messages inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeDefined();

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeDefined();
  });

  it('case services supervisor views docket section inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeDefined();

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeUndefined();
  });

  it('case services supervisor views petitions section inbox', async () => {
    await cerebralTest.runSequence('gotoMessagesSequence', {
      box: 'inbox',
      queue: 'section',
      section: PETITIONS_SECTION,
    });

    const messages = cerebralTest.getState('messages');

    const foundMessageToPetitionsSection = messages.find(
      message => message.subject === petitionsSectionMessage,
    );

    expect(foundMessageToPetitionsSection).toBeDefined();

    const foundMessageToDocketSection = messages.find(
      message => message.subject === docketSectionMessage,
    );

    expect(foundMessageToDocketSection).toBeUndefined();
  });

  it('case services supervisor views docket section document QC', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    const workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );

    expect(workItem).toBeDefined();
  });

  it('case services supervisor views petitions section document QC', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      section: 'petitions',
    });

    const workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );

    expect(workItem).toBeDefined();
  });

  it('assign petitions section work item to self', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
      'petitions',
    );
    const workItem = documentQCSectionInbox.filter(
      workItemToAssign =>
        workItemToAssign.docketNumber === cerebralTest.docketNumber,
    );

    await assignWorkItems(cerebralTest, 'caseservicessupervisor', workItem);
  });

  it('case services supervisor views my document QC', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'inbox',
      queue: 'my',
    });

    const workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );

    expect(workItem).toBeDefined();
  });

  it('assign docket section work item to Test Docket Clerk 1', async () => {
    let documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      cerebralTest,
      DOCKET_SECTION,
    );
    const workItem = documentQCSectionInbox.filter(
      workItemToAssign =>
        workItemToAssign.docketNumber === cerebralTest.docketNumber,
    );

    await assignWorkItems(cerebralTest, 'docketclerk', workItem);

    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    const assignedWorkItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );

    expect(assignedWorkItem.section).toBe(DOCKET_SECTION);
  });

  it('completed work items should appear in the "Processed" tab of the docket section inbox', async () => {
    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'inbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    let workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );

    expect(workItem).toBeDefined();

    await cerebralTest.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: workItem.docketEntry.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'documentType',
      value: 'Order',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);
    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await cerebralTest.runSequence('completeDocketEntryQCSequence');
    expect(cerebralTest.getState('validationErrors')).toEqual({});
    await cerebralTest.runSequence('gotoWorkQueueSequence', {
      box: 'outbox',
      queue: 'section',
      section: DOCKET_SECTION,
    });

    workItem = cerebralTest
      .getState('workQueue')
      .find(
        workItemInQueue =>
          workItemInQueue.docketNumber === cerebralTest.docketNumber,
      );
    expect(workItem).toBeDefined();
  });
});

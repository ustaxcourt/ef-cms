import {
  createMessage,
  getFormattedDocumentQCSectionInbox,
  getFormattedMyInbox,
  getFormattedMyOutbox,
  getFormattedSectionOutbox,
  getInboxCount,
  getNotifications,
  loginAs,
  setupTest,
  uploadExternalDecisionDocument,
  uploadPetition,
  viewDocumentDetailMessage,
} from './helpers';

const test = setupTest();

describe('a docketclerk user creates a new message for another docketclerk user', () => {
  let caseDetail;
  let qcSectionInboxCountBefore;
  let notificationsBefore;
  let decisionWorkItem;
  let myCountBefore;
  let myInboxWorkItem;

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await loginAs(test, 'docketclerk1');

    await getFormattedDocumentQCSectionInbox(test);
    qcSectionInboxCountBefore = getInboxCount(test);

    await getFormattedMyInbox(test);
    myCountBefore = getInboxCount(test);

    notificationsBefore = getNotifications(test);
  });

  it('login as a tax payer and create a case', async () => {
    await loginAs(test, 'taxpayer');
    caseDetail = await uploadPetition(test);
  });

  it('taxpayer uploads the external documents', async () => {
    await uploadExternalDecisionDocument(test);
  });

  it('login as the docketclerk and verify there is a message in the qc section inbox entries', async () => {
    await loginAs(test, 'docketclerk');
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );
    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(decisionWorkItem).toMatchObject({
      document: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
    const qcSectionInboxCountAfter = getInboxCount(test);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 1);
  });

  it('selects a document and creates a message', async () => {
    await viewDocumentDetailMessage({
      docketNumber: caseDetail.docketNumber,
      documentId: decisionWorkItem.document.documentId,
      messageId: decisionWorkItem.currentMessage.messageId,
      test,
    });
    await createMessage({
      assigneeId: '2805d1ab-18d0-43ec-bafb-654e83405416',
      message: 'I’m the lyrical ganster!',
      test,
    });
  });

  it('verify a new message exists on the user outbox', async () => {
    const myOutbox = await getFormattedMyOutbox(test);
    const workItem = myOutbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(workItem).toMatchObject({
      document: {
        documentType: 'Agreed Computation for Entry of Decision',
      },
      isInitializeCase: false,
      isInternal: true,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'I’m the lyrical ganster!',
          to: 'Test Docketclerk1',
          toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    });
  });

  it('verify a new message exists on the section outbox', async () => {
    const mySectionOutbox = await getFormattedSectionOutbox(test);
    const workItem = mySectionOutbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(workItem).toMatchObject({
      document: {
        documentType: 'Agreed Computation for Entry of Decision',
      },
      isInitializeCase: false,
      isInternal: true,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'I’m the lyrical ganster!',
          to: 'Test Docketclerk1',
          toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    });
  });

  it('login as docketclerk1 and verify we have a message in my inbox', async () => {
    await loginAs(test, 'docketclerk1');
    const myInbox = await getFormattedMyInbox(test);
    myInboxWorkItem = myInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(myInboxWorkItem).toMatchObject({
      document: {
        documentType: 'Agreed Computation for Entry of Decision',
      },
      isInitializeCase: false,
      isInternal: true,
      messages: [
        {
          from: 'Test Docketclerk',
          fromUserId: '1805d1ab-18d0-43ec-bafb-654e83405416',
          message: 'I’m the lyrical ganster!',
          to: 'Test Docketclerk1',
          toUserId: '2805d1ab-18d0-43ec-bafb-654e83405416',
        },
      ],
    });
  });

  it('expect the inbox counts to have increased', async () => {
    const currentCount = getInboxCount(test);
    expect(currentCount).toEqual(myCountBefore + 1);
  });

  it('expect a new unread notifications', async () => {
    const currentNotifications = getNotifications(test);
    expect(currentNotifications.myInboxUnreadCount).toEqual(
      notificationsBefore.myInboxUnreadCount + 1,
    );
  });

  it('the unread counts should decrease by one after reading the message', async () => {
    expect(myInboxWorkItem).toMatchObject({
      showUnreadIndicators: true,
      showUnreadStatusIcon: true,
    });
    await viewDocumentDetailMessage({
      docketNumber: caseDetail.docketNumber,
      documentId: myInboxWorkItem.document.documentId,
      messageId: myInboxWorkItem.currentMessage.messageId,
      test,
    });
    const myInbox = await getFormattedMyInbox(test);
    const workItem = myInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(workItem).toMatchObject({
      showUnreadIndicators: false,
      showUnreadStatusIcon: false,
    });
    const notifications = getNotifications(test);
    expect(notifications.myInboxUnreadCount).toEqual(
      notificationsBefore.myInboxUnreadCount,
    );
  });
});

import {
  assignWorkItems,
  findWorkItemByCaseId,
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCSectionInbox,
  getInboxCount,
  getNotifications,
  loginAs,
  setupTest,
  uploadExternalDecisionDocument,
  uploadPetition,
} from './helpers';

const test = setupTest();

describe('Create a work item', () => {
  let caseDetail;
  let qcMyInboxCountBefore;
  let qcSectionInboxCountBefore;
  let notificationsBefore;

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await loginAs(test, 'docketclerk');

    await getFormattedDocumentQCMyInbox(test);
    qcMyInboxCountBefore = getInboxCount(test);

    await getFormattedDocumentQCSectionInbox(test);
    qcSectionInboxCountBefore = getInboxCount(test);

    notificationsBefore = getNotifications(test);
  });

  it('login as a tax payer and create a case', async () => {
    await loginAs(test, 'taxpayer');
    caseDetail = await uploadPetition(test);
  });

  it('taxpayer uploads the external documents', async () => {
    await uploadExternalDecisionDocument(test);
    await uploadExternalDecisionDocument(test);
    await uploadExternalDecisionDocument(test);
  });

  it('login as the docketclerk and verify there are 3 document qc section inbox entries', async () => {
    await loginAs(test, 'docketclerk');

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    const decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    expect(decisionWorkItem).toMatchObject({
      document: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getInboxCount(test);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 3);
  });

  it('have the docketclerk assign those 3 items to self', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );
    const decisionWorkItems = documentQCSectionInbox.filter(
      workItem => workItem.caseId === caseDetail.caseId,
    );
    await assignWorkItems(test, 'docketclerk', decisionWorkItems);
  });

  it('verify the docketclerk has 3 messages in document qc my inbox', async () => {
    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(test);
    const decisionWorkItem = findWorkItemByCaseId(
      documentQCMyInbox,
      caseDetail.caseId,
    );
    expect(decisionWorkItem).toMatchObject({
      document: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
    const qcMyInboxCountAfter = getInboxCount(test);
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 3);
  });

  it('verify the docketclerk has the expected unread count', async () => {
    const notifications = getNotifications(test);
    expect(notifications).toMatchObject({
      myInboxUnreadCount: notificationsBefore.myInboxUnreadCount,
      qcUnreadCount: notificationsBefore.qcUnreadCount + 3,
    });
  });
});

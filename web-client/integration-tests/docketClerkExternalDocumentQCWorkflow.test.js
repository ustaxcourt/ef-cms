import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
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
  viewDocumentDetailMessage,
} from './helpers';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Create a work item', () => {
  beforeEach(() => {
    jest.setTimeout(40000);
  });

  let caseDetail;
  let qcMyInboxCountBefore;
  let qcSectionInboxCountBefore;
  let notificationsBefore;
  let decisionWorkItem;

  loginAs(test, 'docketclerk');

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await getFormattedDocumentQCMyInbox(test);
    qcMyInboxCountBefore = getInboxCount(test);

    await getFormattedDocumentQCSectionInbox(test);
    qcSectionInboxCountBefore = getInboxCount(test);

    notificationsBefore = getNotifications(test);
  });

  loginAs(test, 'petitioner');
  it('login as a tax payer and create a case', async () => {
    caseDetail = await uploadPetition(test, {
      contactSecondary: {
        address1: '734 Cowley Parkway',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Secondary Person',
        phone: '+1 (884) 358-9729',
        postalCode: '77546',
        state: 'CT',
      },
      partyType: PARTY_TYPES.petitionerSpouse,
    });
    expect(caseDetail.docketNumber).toBeDefined();
  });

  it('petitioner uploads the external documents', async () => {
    await test.runSequence('gotoFileDocumentSequence', {
      docketNumber: caseDetail.docketNumber,
    });

    await uploadExternalDecisionDocument(test);
    await uploadExternalDecisionDocument(test);
    await uploadExternalDecisionDocument(test);
  });

  loginAs(test, 'docketclerk');
  it('login as the docketclerk and verify there are 3 document qc section inbox entries', async () => {
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
    decisionWorkItem = findWorkItemByCaseId(
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

  it('the unread counts should decrease by one after a docketclerk reads one of those messages', async () => {
    await viewDocumentDetailMessage({
      docketNumber: caseDetail.docketNumber,
      documentId: decisionWorkItem.document.documentId,
      messageId: decisionWorkItem.currentMessage.messageId,
      test,
      workItemIdToMarkAsRead: decisionWorkItem.workItemId,
    });
    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(test);
    decisionWorkItem = documentQCMyInbox.find(
      workItem => workItem.workItemId === decisionWorkItem.workItemId,
    );
    expect(decisionWorkItem).toMatchObject({
      showUnreadIndicators: false,
      showUnreadStatusIcon: false,
    });
    const qcMyInboxCountAfter = getInboxCount(test);
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 2);
    const notifications = getNotifications(test);
    expect(notifications).toMatchObject({
      myInboxUnreadCount: notificationsBefore.myInboxUnreadCount,
      qcUnreadCount: notificationsBefore.qcUnreadCount + 2,
    });
  });

  it('docket clerk QCs a document, updates the document title, and generates a Notice of Docket Change', async () => {
    await test.runSequence('gotoEditDocketEntrySequence', {
      docketNumber: caseDetail.docketNumber,
      documentId: decisionWorkItem.document.documentId,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await test.runSequence('completeDocketEntryQCSequence');

    const noticeDocument = test.getState('caseDetail.documents.5');
    expect(noticeDocument.documentType).toEqual('Notice of Docket Change');
    expect(noticeDocument.servedAt).toBeDefined();
    expect(test.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );
  });
});

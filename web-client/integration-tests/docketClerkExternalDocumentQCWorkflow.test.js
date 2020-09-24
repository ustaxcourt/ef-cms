import { DOCUMENT_PROCESSING_STATUS_OPTIONS } from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import {
  assignWorkItems,
  findWorkItemByDocketNumber,
  getCaseMessagesForCase,
  getFormattedDocumentQCMyInbox,
  getFormattedDocumentQCMyOutbox,
  getFormattedDocumentQCSectionInbox,
  getIndividualInboxCount,
  getNotifications,
  getSectionInboxCount,
  loginAs,
  setupTest,
  uploadExternalDecisionDocument,
  uploadPetition,
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

  loginAs(test, 'docketclerk@example.com');

  it('login as the docketclerk and cache the initial inbox counts', async () => {
    await getFormattedDocumentQCMyInbox(test);
    qcMyInboxCountBefore = getIndividualInboxCount(test);

    await getFormattedDocumentQCSectionInbox(test);
    qcSectionInboxCountBefore = getSectionInboxCount(test);

    notificationsBefore = getNotifications(test);
  });

  loginAs(test, 'petitioner@example.com');
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
    test.docketNumber = caseDetail.docketNumber;
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

  loginAs(test, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 3 document qc section inbox entries', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    const decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getSectionInboxCount(test);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 3);
  });

  it('have the docketclerk assign those 3 items to self', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );
    const decisionWorkItems = documentQCSectionInbox.filter(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    await assignWorkItems(test, 'docketclerk', decisionWorkItems);
  });

  it('verify the docketclerk has 3 messages in document qc my inbox', async () => {
    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(test);
    decisionWorkItem = findWorkItemByDocketNumber(
      documentQCMyInbox,
      caseDetail.docketNumber,
    );
    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
    const qcMyInboxCountAfter = getIndividualInboxCount(test);
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 3);
  });

  it('verify the docketclerk has the expected unread count', async () => {
    const notifications = getNotifications(test);
    expect(notifications).toMatchObject({
      qcUnreadCount: notificationsBefore.qcUnreadCount + 3,
    });
  });

  it('docket clerk QCs a document, updates the document title, and generates a Notice of Docket Change', async () => {
    await test.runSequence('gotoEditDocketEntrySequence', {
      docketEntryId: decisionWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await test.runSequence('completeDocketEntryQCSequence');

    const noticeDocketEntry = test
      .getState('caseDetail.docketEntries')
      .find(doc => doc.documentType === 'Notice of Docket Change');

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
    expect(test.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );
  });

  it('docket clerk completes QC of a document and sends a message', async () => {
    test.setState('modal.showModal', '');

    await test.runSequence('openCompleteAndSendMessageModalSequence');

    expect(test.getState('modal.showModal')).toEqual(
      'CreateMessageModalDialog',
    );

    await test.runSequence('completeDocketEntryQCAndSendMessageSequence');

    let errors = test.getState('validationErrors');

    expect(errors).toEqual({
      message: 'Enter a message',
      toSection: 'Select a section',
      toUserId: 'Select a recipient',
    });

    const updatedDocumentTitle = 'Motion in Limine';
    const messageBody = 'This is a message in a bottle';

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'documentTitle',
      value: updatedDocumentTitle,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'message',
      value: messageBody,
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toSection',
      value: 'petitions',
    });

    await test.runSequence('updateModalFormValueSequence', {
      key: 'toUserId',
      value: '7805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await test.runSequence('completeDocketEntryQCAndSendMessageSequence');

    errors = test.getState('validationErrors');

    expect(errors).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: 'Motion in Limine QC completed and message sent.',
    });

    expect(test.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (await getFormattedDocumentQCMyOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    const formattedCaseMessages = await getCaseMessagesForCase(test);
    const qcDocumentMessage =
      formattedCaseMessages.inProgressMessages[0].message;

    expect(qcDocumentMessage).toBe(messageBody);
  });
});

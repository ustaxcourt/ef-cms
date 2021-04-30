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
  refreshElasticsearchIndex,
  setupTest,
  uploadExternalDecisionDocument,
  uploadExternalRatificationDocument,
  uploadPetition,
  wait,
} from './helpers';

const test = setupTest();
const { COUNTRY_TYPES, PARTY_TYPES } = applicationContext.getConstants();

describe('Create a work item', () => {
  beforeEach(() => {
    jest.setTimeout(40000);
  });

  afterAll(() => {
    test.closeSocket();
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
    await uploadExternalRatificationDocument(test);
    await uploadExternalRatificationDocument(test);
  });

  loginAs(test, 'docketclerk@example.com');
  it('login as the docketclerk and verify there are 4 document qc section inbox entries', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    const qcSectionInboxCountAfter = getSectionInboxCount(test);
    expect(qcSectionInboxCountAfter).toEqual(qcSectionInboxCountBefore + 4);
  });

  it('have the docketclerk assign those 4 items to self', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );
    const decisionWorkItems = documentQCSectionInbox.filter(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );
    await assignWorkItems(test, 'docketclerk', decisionWorkItems);
  });

  it('verify the docketclerk has 4 messages in document qc my inbox', async () => {
    await refreshElasticsearchIndex();
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
    expect(qcMyInboxCountAfter).toEqual(qcMyInboxCountBefore + 4);
  });

  it('verify the docketclerk has the expected unread count', async () => {
    await refreshElasticsearchIndex();
    const notifications = getNotifications(test);
    expect(notifications).toMatchObject({
      qcUnreadCount: notificationsBefore.qcUnreadCount + 4,
    });
  });

  it('docket clerk QCs a document, updates the document title, and generates a Notice of Docket Change', async () => {
    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: decisionWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    await wait(1000);

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    await refreshElasticsearchIndex();

    const documentQCMyInbox = await getFormattedDocumentQCMyInbox(test);

    const foundInMyInbox = documentQCMyInbox.find(workItem => {
      return workItem.workItemId === decisionWorkItem.workItemId;
    });

    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    const foundInSectionInbox = documentQCSectionInbox.find(workItem => {
      return workItem.workItemId === decisionWorkItem.workItemId;
    });

    const noticeDocketEntry = test
      .getState('caseDetail.docketEntries')
      .find(doc => doc.documentType === 'Notice of Docket Change');

    expect(foundInMyInbox).toBeFalsy();
    expect(foundInSectionInbox).toBeFalsy();

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
    expect(test.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );

    await test.runSequence('navigateToPrintPaperServiceSequence');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
  });

  it('docket clerk completes QC of a document and sends a message', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    decisionWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(decisionWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Agreed Computation for Entry of Decision',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: decisionWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('DocketEntryQc');

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    test.setState('modal.showModal', '');

    await test.runSequence('openCompleteAndSendMessageModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toEqual(
      'CreateMessageModalDialog',
    );

    expect(test.getState('modal.form.subject')).toEqual('Answer');

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

    await refreshElasticsearchIndex();

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

    expect(test.getState('modal.showModal')).toEqual(
      'PaperServiceConfirmModal',
    );

    await test.runSequence('navigateToPrintPaperServiceSequence');
    expect(test.getState('pdfPreviewUrl')).toBeDefined();
  });

  it('docket clerk completes QC of a document, updates freeText, and sends a message', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    const ratificationWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(ratificationWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: ratificationWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('DocketEntryQc');

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'break the test',
    });

    test.setState('modal.showModal', '');

    await test.runSequence('openCompleteAndSendMessageModalSequence');

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('modal.showModal')).toEqual(
      'CreateMessageModalDialog',
    );

    const updatedDocumentTitle = 'Ratification of break the test';

    expect(test.getState('modal.form.subject')).toEqual(updatedDocumentTitle);

    const messageBody = 'This is a message in a bottle';

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

    expect(test.getState('validationErrors')).toEqual({});

    expect(test.getState('alertSuccess')).toMatchObject({
      message: `${updatedDocumentTitle} QC completed and message sent.`,
    });

    expect(test.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (await getFormattedDocumentQCMyOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketEntries = test.getState('caseDetail.docketEntries');

    const ratificationDocketEntry = docketEntries.find(
      d => d.docketEntryId === ratificationWorkItem.docketEntry.docketEntryId,
    );

    const noticeDocketEntry = docketEntries.find(
      doc =>
        doc.documentTitle ===
        `Notice of Docket Change for Docket Entry No. ${ratificationDocketEntry.index}`,
    );

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });

  it('docket clerk updates freeText and completes QC', async () => {
    const documentQCSectionInbox = await getFormattedDocumentQCSectionInbox(
      test,
    );

    const ratificationWorkItem = documentQCSectionInbox.find(
      workItem => workItem.docketNumber === caseDetail.docketNumber,
    );

    expect(ratificationWorkItem).toMatchObject({
      docketEntry: {
        documentTitle: 'Ratification of do the test',
        userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });

    await test.runSequence('gotoDocketEntryQcSequence', {
      docketEntryId: ratificationWorkItem.docketEntry.docketEntryId,
      docketNumber: caseDetail.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('DocketEntryQc');

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: '',
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({
      freeText: 'Provide an answer',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'freeText',
      value: 'striking realism, neutrality, dynamics and clarity',
    });

    await test.runSequence('completeDocketEntryQCSequence');

    expect(test.getState('validationErrors')).toEqual({});

    const updatedDocumentTitle =
      'Ratification of striking realism, neutrality, dynamics and clarity';

    expect(test.getState('alertSuccess')).toMatchObject({
      message: `${updatedDocumentTitle} has been completed.`,
    });

    expect(test.getState('currentPage')).toBe('WorkQueue');

    const myOutbox = (await getFormattedDocumentQCMyOutbox(test)).filter(
      item => item.docketNumber === caseDetail.docketNumber,
    );
    const qcDocumentTitleMyOutbox = myOutbox[0].docketEntry.documentTitle;

    expect(qcDocumentTitleMyOutbox).toBe(updatedDocumentTitle);

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const docketEntries = test.getState('caseDetail.docketEntries');

    const ratificationDocketEntry = docketEntries.find(
      d => d.docketEntryId === ratificationWorkItem.docketEntry.docketEntryId,
    );

    const noticeDocketEntry = docketEntries.find(
      doc =>
        doc.documentTitle ===
        `Notice of Docket Change for Docket Entry No. ${ratificationDocketEntry.index}`,
    );

    expect(noticeDocketEntry).toBeTruthy();
    expect(noticeDocketEntry.servedAt).toBeDefined();
    expect(noticeDocketEntry.processingStatus).toEqual(
      DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
    );
  });
});

import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkAddsTrackedDocketEntry } from './journey/docketClerkAddsTrackedDocketEntry';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

import {
  contactPrimaryFromState,
  createCourtIssuedDocketEntry,
  fakeFile,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';

const { PAYMENT_STATUS } = applicationContext.getConstants();
const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Verifies Docket Record Display', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile, 'Birmingham, Alabama', false);
  it('verifies docket entries exist for petition for an unserved case', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        index: 1,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  petitionsClerkSubmitsCaseToIrs(test);
  it('verifies docket entries exist for petition, APW, DISC and RQT for a served case', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        index: 1,
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'APW',
        index: 2,
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        index: 3,
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
        index: 4,
        showNotServed: false,
        showServed: true,
      },
    ]);

    test.docketNumber = null;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(test, fakeFile, 'Birmingham, Alabama', false);

  loginAs(test, 'docketclerk@example.com');
  it('files an initial filing type document AFTER a paper petition is added but not served', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    //4654- docket entries for initial filing type documents are not created until after the case has been served
    expect(formattedDocketEntriesOnDocketRecord[4]).toBeUndefined();
  });

  loginAs(test, 'petitionsclerk@example.com');
  it('serves the case', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    await test.runSequence('serveCaseToIrsSequence');
  });

  loginAs(test, 'docketclerk@example.com');
  it('files an initial filing type document AFTER a paper petition is added and is served', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    //4654- docket entries for initial (un-served and served) filing type documents are created when case has been served
    expect(formattedDocketEntriesOnDocketRecord[4]).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'RQT',
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(test, 'floater@example.com');
  it('allows access to the floater user to view the case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
  });

  loginAs(test, 'general@example.com');
  it('allows access to the general user to view the case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
  });

  loginAs(test, 'reportersOffice@example.com');
  it('allows access to the reportersOffice user to view the case detail', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  it('updates the fee payment status on case detail and verifies minute entry on the docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoEditPetitionDetailsSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateYear',
      value: '2018',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateMonth',
      value: '12',
    });
    await test.runSequence('updateFormValueSequence', {
      key: 'paymentDateDay',
      value: '24',
    });

    await test.runSequence('updatePetitionDetailsSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const feeEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'FEE',
    );

    expect(feeEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'FEE',
      index: 6,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(test, fakeFile);
  it('verifies the docket record after filing an unservable document type', async () => {
    const uploadedDocument = test.draftOrders[0];

    await createCourtIssuedDocketEntry({
      docketEntryId: uploadedDocument.docketEntryId,
      docketNumber: test.docketNumber,
      eventCode: 'HEAR',
      filingDate: {
        day: '1',
        month: '1',
        year: '2020',
      },
      test,
      trialLocation: 'Birmingham, AL',
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const docketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === uploadedDocument.docketEntryId,
    );
    expect(docketEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'HEAR',
      index: 7,
      servedAtFormatted: undefined,
      showNotServed: false,
      showServed: false,
      trialLocation: 'Birmingham, AL',
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 1);
  docketClerkSignsOrder(test, 1);
  docketClerkAddsDocketEntryFromOrder(test, 1);
  it('verifies the docket record after adding a draft order to the docket record (not served)', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const orderEntry = formattedDocketEntriesOnDocketRecord[8];

    expect(orderEntry.index).toBeUndefined();
    expect(orderEntry).toMatchObject({
      createdAtFormatted: undefined,
      eventCode: 'O',
      servedAtFormatted: undefined,
      showNotServed: true,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something else',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  docketClerkViewsDraftOrder(test, 2);
  docketClerkSignsOrder(test, 2);
  docketClerkAddsDocketEntryFromOrder(test, 2);
  docketClerkServesDocument(test, 2);
  it('verifies the docket record after adding a draft order to the docket record and serving', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const orderEntry = formattedDocketEntriesOnDocketRecord[8];

    expect(orderEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'O',
      index: 8,
      servedAtFormatted: expect.anything(),
      showNotServed: false,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  it('verifies the docket record after filing a paper document (without serving)', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedMonth',
      value: 1,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedDay',
      value: 2,
    });
    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'dateReceivedYear',
      value: 2018,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await test.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    const contactPrimary = contactPrimaryFromState(test);

    await test.runSequence('updateFileDocumentWizardFormValueSequence', {
      key: `filersMap.${contactPrimary.contactId}`,
      value: true,
    });

    await test.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const entry = formattedDocketEntriesOnDocketRecord[6];

    test.docketEntryId = entry.docketEntryId;

    expect(entry.index).toBeUndefined();
    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      showNotServed: true,
    });
  });

  it('verifies the docket record after serving a paper filing', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    await test.runSequence('openConfirmServePaperFiledDocumentSequence', {
      docketEntryId: test.docketEntryId,
    });

    await test.runSequence('servePaperFiledDocumentSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const servedEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === test.docketEntryId,
    );

    expect(servedEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      index: 9,
      showNotServed: false,
      showServed: true,
    });
  });

  it('verifies the docket record after filing a petition electronically', async () => {
    const caseDetail = await uploadPetition(test, {
      ownershipDisclosureFileId: '2da6d239-555a-40e8-af81-1949c8270cd7',
    });
    test.docketNumber = caseDetail.docketNumber;

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        index: 1,
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
        index: 2,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        index: 3,
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(test);

  loginAs(test, 'docketclerk@example.com');
  const today = applicationContext.getUtilities().formatNow('MMDDYYYY');
  const [todayMonth, todayDay, todayYear] = today.split('/');

  docketClerkAddsDocketEntryWithoutFile(test, {
    dateReceivedDay: todayDay,
    dateReceivedMonth: todayMonth,
    dateReceivedYear: todayYear,
  });
  it('verifies the docket record after filing a paper document without a file', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    expect(formattedDocketEntriesOnDocketRecord.length).toEqual(4);
    const entry = formattedDocketEntriesOnDocketRecord[3];

    expect(entry.index).toBeUndefined();
    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'ADMR',
      isInProgress: true,
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(test, 'petitioner@example.com');
  petitionerFilesADocumentForCase(test, fakeFile);
  it('verifies the docket record after filing a document electronically after serving the petition', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const entry = formattedDocketEntriesOnDocketRecord[3];

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'CIVP',
      index: 4,
      showNotServed: false,
      showServed: true,
    });
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkAddsTrackedDocketEntry(test, fakeFile);
  it('verifies the docket record after filing a tracked, paper-filed docket entry (APPL)', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const entry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.eventCode === 'APPL',
    );

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'APPL',
      index: 5,
      pending: true,
    });
  });

  const { SERVICE_INDICATOR_TYPES } = applicationContext.getConstants();

  docketClerkEditsServiceIndicatorForPetitioner(
    test,
    SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  );

  docketClerkAddsTrackedDocketEntry(test, fakeFile, true);
  it('verifies the docket record after filing a tracked, paper-filed docket entry (APPL) on a case with paper service parties', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);

    const entry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.eventCode === 'APPL',
    );

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'APPL',
      index: 5,
      pending: true,
    });
  });
});

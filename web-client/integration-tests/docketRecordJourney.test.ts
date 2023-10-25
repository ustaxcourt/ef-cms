import { FORMATS } from '@shared/business/utilities/DateHandler';
import {
  PAYMENT_STATUS,
  SERVICE_INDICATOR_TYPES,
} from '../../shared/src/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  contactPrimaryFromState,
  createCourtIssuedDocketEntry,
  fakeFile,
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
  waitForCondition,
} from './helpers';
import { docketClerkAddsDocketEntryFromOrder } from './journey/docketClerkAddsDocketEntryFromOrder';
import { docketClerkAddsDocketEntryWithoutFile } from './journey/docketClerkAddsDocketEntryWithoutFile';
import { docketClerkAddsTrackedDocketEntry } from './journey/docketClerkAddsTrackedDocketEntry';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkFilesRQTBeforePetitionIsServed } from './journey/docketClerkFilesRQTBeforePetitionIsServed';
import { docketClerkServesDocument } from './journey/docketClerkServesDocument';
import { docketClerkSignsOrder } from './journey/docketClerkSignsOrder';
import { docketClerkUploadsACourtIssuedDocument } from './journey/docketClerkUploadsACourtIssuedDocument';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkCreatesNewCase } from './journey/petitionsClerkCreatesNewCase';
import { petitionsClerkServesPetitionFromDocumentView } from './journey/petitionsClerkServesPetitionFromDocumentView';
import { petitionsClerkSubmitsCaseToIrs } from './journey/petitionsClerkSubmitsCaseToIrs';

describe('Docket Clerk Verifies Docket Record Display', () => {
  const cerebralTest = setupTest();

  afterAll(() => {
    cerebralTest.closeSocket();
    cerebralTest.draftOrders = [];
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, { shouldServe: false });
  it('verifies docket entries exist for petition for an unserved case', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  petitionsClerkSubmitsCaseToIrs(cerebralTest);
  it('verifies docket entries exist for petition, APW, DISC, RQT, and NOTR for a served case', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'APW',
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
        showNotServed: false,
        showServed: true,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'FEE',
        showNotServed: false,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'NOTR',
        showNotServed: false,
        showServed: true,
      },
    ]);

    cerebralTest.docketNumber = null;
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCase(cerebralTest, { shouldServe: false });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkFilesRQTBeforePetitionIsServed(cerebralTest, fakeFile);
  it('verifies docket record after filing initial filing document', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    //4654- docket entries for initial filing type documents are not created until after the case has been served
    expect(formattedDocketEntriesOnDocketRecord[4]).toBeUndefined();
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  it('serves the case', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });
    await cerebralTest.runSequence('serveCaseToIrsSequence');
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('files an initial filing type document AFTER a paper petition is added and is served', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/1/2018',
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'RQT',
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'trialLocation',
      value: 'Little Rock, AR',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    //4654- docket entries for initial (un-served and served) filing type documents are created when case has been served
    expect(formattedDocketEntriesOnDocketRecord[5]).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'RQT',
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('updates the fee payment status on case detail and verifies minute entry on the docket record', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoEditCaseDetailsSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentStatus',
      value: PAYMENT_STATUS.PAID,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'petitionPaymentMethod',
      value: 'check',
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'petitionPaymentDate',
        toFormat: FORMATS.ISO,
        value: '12/24/2018',
      },
    );

    await cerebralTest.runSequence('updateCaseDetailsSequence');

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const feeEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'FEE',
    );

    expect(feeEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'FEE',
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkUploadsACourtIssuedDocument(cerebralTest, fakeFile);
  it('verifies the docket record after filing an unservable document type', async () => {
    const uploadedDocument = cerebralTest.draftOrders[0];

    await createCourtIssuedDocketEntry({
      cerebralTest,
      docketEntryId: uploadedDocument.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
      documentType: 'Hearing before',
      eventCode: 'HEAR',
      filingDate: {
        day: '1',
        month: '1',
        year: '2020',
      },
      trialLocation: 'Birmingham, AL',
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const docketEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === uploadedDocument.docketEntryId,
    );
    expect(docketEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'HEAR',
      servedAtFormatted: '',
      showNotServed: false,
      showServed: false,
      trialLocation: 'Birmingham, AL',
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 1);
  it('verifies the docket record after adding a draft order to the docket record (not served)', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const orderEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.documentTitle === 'Order to do something',
    );

    expect(orderEntry.index).toBeUndefined();
    expect(orderEntry).toMatchObject({
      createdAtFormatted: '',
      eventCode: 'O',
      servedAtFormatted: '',
      showNotServed: true,
    });
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something else',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });

  docketClerkViewsDraftOrder(cerebralTest);
  docketClerkSignsOrder(cerebralTest);
  docketClerkAddsDocketEntryFromOrder(cerebralTest, 2);
  docketClerkServesDocument(cerebralTest, 2);
  it('verifies the docket record after adding a draft order to the docket record and serving', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          createdAtFormatted: expect.anything(),
          eventCode: 'O',
          servedAtFormatted: expect.anything(),
          showNotServed: false,
        }),
      ]),
    );
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('verifies the docket record after filing a paper document (without serving)', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoAddPaperFilingSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence(
      'formatAndUpdateDateFromDatePickerSequence',
      {
        key: 'receivedAt',
        toFormat: FORMATS.ISO,
        value: '1/2/2018',
      },
    );

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'primaryDocumentFileSize',
      value: 100,
    });

    await cerebralTest.runSequence('updateDocketEntryFormValueSequence', {
      key: 'eventCode',
      value: 'A',
    });

    const contactPrimary = contactPrimaryFromState(cerebralTest);

    await cerebralTest.runSequence(
      'updateFileDocumentWizardFormValueSequence',
      {
        key: `filersMap.${contactPrimary.contactId}`,
        value: true,
      },
    );

    await cerebralTest.runSequence('submitPaperFilingSequence', {
      isSavingForLater: true,
    });

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const entry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.eventCode === 'A',
    );

    cerebralTest.docketEntryId = entry.docketEntryId;

    expect(entry.index).toBeUndefined();
    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      showNotServed: true,
    });
  });

  it('verifies the docket record after serving a paper filing', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    await cerebralTest.runSequence('gotoEditPaperFilingSequence', {
      docketEntryId: cerebralTest.docketEntryId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toBe('PaperFiling');

    await cerebralTest.runSequence('openConfirmPaperServiceModalSequence');

    await cerebralTest.runSequence('submitPaperFilingSequence');

    await waitForCondition({
      booleanExpressionCondition: () =>
        cerebralTest.getState('currentPage') === 'CaseDetailInternal',
    });

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const servedEntry = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.docketEntryId === cerebralTest.docketEntryId,
    );

    expect(servedEntry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'A',
      showNotServed: false,
      showServed: true,
    });
  });

  it('verifies the docket record after filing a petition electronically', async () => {
    const caseDetail = await uploadPetition(cerebralTest, {
      corporateDisclosureFileId: '2da6d239-555a-40e8-af81-1949c8270cd7',
    });
    cerebralTest.docketNumber = caseDetail.docketNumber;

    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject([
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'P',
        showNotServed: true,
        showServed: false,
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'RQT',
      },
      {
        createdAtFormatted: expect.anything(),
        eventCode: 'DISC',
        showNotServed: true,
        showServed: false,
      },
    ]);
  });

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkServesPetitionFromDocumentView(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  const today = applicationContext.getUtilities().formatNow(FORMATS.MMDDYYYY);
  const [todayMonth, todayDay, todayYear] = today.split('/');

  docketClerkAddsDocketEntryWithoutFile(cerebralTest, {
    dateReceivedDay: todayDay,
    dateReceivedMonth: todayMonth,
    dateReceivedYear: todayYear,
  });

  it('verifies the docket record after filing a paper document without a file', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const entryWithoutFile = formattedDocketEntriesOnDocketRecord.find(
      entry => entry.eventCode === 'ADMR',
    );

    expect(entryWithoutFile.index).toBeUndefined();
    expect(entryWithoutFile).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'ADMR',
      isInProgress: true,
      showNotServed: true,
      showServed: false,
    });
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  petitionerFilesADocumentForCase(cerebralTest, fakeFile);
  it('verifies the docket record after filing a document electronically after serving the petition', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    expect(formattedDocketEntriesOnDocketRecord).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({
          createdAtFormatted: expect.anything(),
          eventCode: 'CIVP',
          showNotServed: false,
          showServed: true,
        }),
      ]),
    );
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkAddsTrackedDocketEntry(cerebralTest, fakeFile);
  it('verifies the docket record after filing a tracked, paper-filed docket entry (APPL)', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const entry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.eventCode === 'APPL',
    );

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'APPL',
      pending: true,
    });
  });

  docketClerkEditsServiceIndicatorForPetitioner(
    cerebralTest,
    SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
  );

  docketClerkAddsTrackedDocketEntry(cerebralTest, fakeFile, true);
  it('verifies the docket record after filing a tracked, paper-filed docket entry (APPL) on a case with paper service parties', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);

    const entry = formattedDocketEntriesOnDocketRecord.find(
      docketEntry => docketEntry.eventCode === 'APPL',
    );

    expect(entry).toMatchObject({
      createdAtFormatted: expect.anything(),
      eventCode: 'APPL',
      pending: true,
    });
  });
});

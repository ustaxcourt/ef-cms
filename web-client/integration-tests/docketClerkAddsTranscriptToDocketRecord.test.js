import { applicationContextForClient as applicationContext } from '../../shared/src/business/test/createTestApplicationContext';
import { docketClerkAddsTranscriptDocketEntryFromOrder } from './journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
import {
  getFormattedDocketEntriesForTest,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';

const cerebralTest = setupTest();
cerebralTest.draftOrders = [];

describe('Docket Clerk Adds Transcript to Docket Record', () => {
  const { TRANSCRIPT_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest, 0);
  // old transcript that should be available to the user
  docketClerkAddsTranscriptDocketEntryFromOrder(cerebralTest, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });
  docketClerkCreatesAnOrder(cerebralTest, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(cerebralTest, 1);
  // new transcript that should NOT be available to the user
  const today = applicationContext.getUtilities().getMonthDayYearObj();
  docketClerkAddsTranscriptDocketEntryFromOrder(cerebralTest, 1, {
    day: today.day,
    month: today.month,
    year: today.year,
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('petitioner views transcript on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(cerebralTest);
    const transcriptDocuments = formattedDocketEntriesOnDocketRecord.filter(
      document => document.eventCode === TRANSCRIPT_EVENT_CODE,
    );
    // first transcript should be available to the user
    expect(transcriptDocuments[0].showLinkToDocument).toEqual(true);
    expect(transcriptDocuments[0].isUnservable).toEqual(true);

    await cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: transcriptDocuments[0].docketEntryId,
      docketNumber: cerebralTest.docketNumber,
      isPublic: false,
      useSameTab: true,
    });
    expect(window.location.href).toContain(
      transcriptDocuments[0].docketEntryId,
    );

    // second transcript should NOT be available to the user
    expect(transcriptDocuments[1].showLinkToDocument).toEqual(false);
    expect(transcriptDocuments[1].isUnservable).toEqual(true);

    await expect(
      cerebralTest.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: transcriptDocuments[1].docketEntryId,
        docketNumber: cerebralTest.docketNumber,
        isPublic: false,
      }),
    ).rejects.toThrow('Unauthorized to view document at this time.');

    const transDocketRecord = formattedDocketEntriesOnDocketRecord.find(
      record => record.eventCode === TRANSCRIPT_EVENT_CODE,
    );
    expect(transDocketRecord.index).toBeTruthy();
  });
});

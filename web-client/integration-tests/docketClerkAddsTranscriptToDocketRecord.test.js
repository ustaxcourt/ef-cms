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

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk Adds Transcript to Docket Record', () => {
  const { TRANSCRIPT_EVENT_CODE } = applicationContext.getConstants();

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 0);
  // old transcript that should be available to the user
  docketClerkAddsTranscriptDocketEntryFromOrder(test, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 1);
  // new transcript that should NOT be available to the user
  const today = applicationContext.getUtilities().getMonthDayYearObj();
  docketClerkAddsTranscriptDocketEntryFromOrder(test, 1, {
    day: today.day,
    month: today.month,
    year: today.year,
  });

  loginAs(test, 'petitioner@example.com');
  it('petitioner views transcript on docket record', async () => {
    const { formattedDocketEntriesOnDocketRecord } =
      await getFormattedDocketEntriesForTest(test);
    const transcriptDocuments = formattedDocketEntriesOnDocketRecord.filter(
      document => document.eventCode === TRANSCRIPT_EVENT_CODE,
    );
    // first transcript should be available to the user
    expect(transcriptDocuments[0].showLinkToDocument).toEqual(true);
    expect(transcriptDocuments[0].isUnservable).toEqual(true);

    await test.runSequence('openCaseDocumentDownloadUrlSequence', {
      docketEntryId: transcriptDocuments[0].docketEntryId,
      docketNumber: test.docketNumber,
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
      test.runSequence('openCaseDocumentDownloadUrlSequence', {
        docketEntryId: transcriptDocuments[1].docketEntryId,
        docketNumber: test.docketNumber,
        isPublic: false,
      }),
    ).rejects.toThrow('Unauthorized to view document at this time.');

    const transDocketRecord = formattedDocketEntriesOnDocketRecord.find(
      record => record.eventCode === TRANSCRIPT_EVENT_CODE,
    );
    expect(transDocketRecord.index).toBeTruthy();
  });
});

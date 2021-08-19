import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  getSectionInboxCount,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionerFilesADocumentForCase } from './journey/petitionerFilesADocumentForCase';
import { petitionsClerkManuallyAddsCaseToCalendaredTrialSession } from './journey/petitionsClerkManuallyAddsCaseToCalendaredTrialSession';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const cerebralTest = setupTest();

describe('JUDGE and ADC DOC QC: Work Item Filtering', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  cerebralTest.createdCases = [];
  let judgeDocketSectionQCInboxCountBefore;
  let adcDocketSectionQCInboxCountBefore;

  loginAs(cerebralTest, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(cerebralTest);
    judgeDocketSectionQCInboxCountBefore = getSectionInboxCount(cerebralTest);
  });

  loginAs(cerebralTest, 'adc@example.com');
  it("Get adc's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(cerebralTest);
    adcDocketSectionQCInboxCountBefore = getSectionInboxCount(cerebralTest);
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  for (let index = 0; index <= 2; index++) {
    it(`Create case ${index}`, async () => {
      const caseDetail = await uploadPetition(cerebralTest);
      expect(caseDetail.docketNumber).toBeDefined();
      cerebralTest.createdCases.push(caseDetail.docketNumber);
      cerebralTest.docketNumber = caseDetail.docketNumber;
    });
    petitionerFilesADocumentForCase(cerebralTest, fakeFile);
  }

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest);
  docketClerkViewsTrialSessionList(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(cerebralTest);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(cerebralTest, 0);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(cerebralTest, 1);

  loginAs(cerebralTest, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(cerebralTest);
    const judgeDocketSectionQCInboxCountAfter =
      getSectionInboxCount(cerebralTest);
    expect(judgeDocketSectionQCInboxCountAfter).toBe(
      judgeDocketSectionQCInboxCountBefore + 2,
    );
  });

  loginAs(cerebralTest, 'adc@example.com');
  it("Get adc's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(cerebralTest);
    const adcDocketSectionQCInboxCountAfter =
      getSectionInboxCount(cerebralTest);
    expect(adcDocketSectionQCInboxCountAfter).toBe(
      adcDocketSectionQCInboxCountBefore + 1,
    );
  });
});

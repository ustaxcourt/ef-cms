import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  getInboxCount,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import { petitionerFilesDocumentForCase } from './journey/petitionerFilesDocumentForCase';
import { petitionsClerkManuallyAddsCaseToCalendaredTrialSession } from './journey/petitionsClerkManuallyAddsCaseToCalendaredTrialSession';
import { petitionsClerkSetsATrialSessionsSchedule } from './journey/petitionsClerkSetsATrialSessionsSchedule';

const test = setupTest();

describe('JUDGE and ADC DOC QC: Work Item Filtering', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  test.createdCases = [];
  let judgeDocketSectionQCInboxCountBefore;
  let adcDocketSectionQCInboxCountBefore;

  loginAs(test, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(test);
    judgeDocketSectionQCInboxCountBefore = getInboxCount(test);
  });

  loginAs(test, 'adc@example.com');
  it("Get adc's document qc section inbox before", async () => {
    await getFormattedDocumentQCSectionInbox(test);
    adcDocketSectionQCInboxCountBefore = getInboxCount(test);
  });

  loginAs(test, 'petitioner@example.com');
  for (let index = 0; index <= 2; index++) {
    it(`Create case ${index}`, async () => {
      let caseDetail = await uploadPetition(test);
      expect(caseDetail.docketNumber).toBeDefined();
      test.createdCases.push(caseDetail.docketNumber);
      test.docketNumber = caseDetail.docketNumber;
    });
    petitionerFilesDocumentForCase(test, fakeFile);
  }

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test);
  docketClerkViewsTrialSessionList(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkSetsATrialSessionsSchedule(test);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(test, 0);
  petitionsClerkManuallyAddsCaseToCalendaredTrialSession(test, 1);

  loginAs(test, 'judgeCohen@example.com');
  it("Get judge's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(test);
    const judgeDocketSectionQCInboxCountAfter = getInboxCount(test);
    expect(judgeDocketSectionQCInboxCountAfter).toBe(
      judgeDocketSectionQCInboxCountBefore + 8,
    );
  });

  loginAs(test, 'adc@example.com');
  it("Get adc's document qc section inbox after", async () => {
    await getFormattedDocumentQCSectionInbox(test);
    const adcDocketSectionQCInboxCountAfter = getInboxCount(test);
    expect(adcDocketSectionQCInboxCountAfter).toBe(
      adcDocketSectionQCInboxCountBefore + 4,
    );
  });
});

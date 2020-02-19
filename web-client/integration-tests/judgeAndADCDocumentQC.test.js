import {
  fakeFile,
  getFormattedDocumentQCSectionInbox,
  getInboxCount,
  loginAs,
  setupTest,
  uploadPetition,
} from './helpers';
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkManuallyAddsCaseToCalendaredTrialSession from './journey/calendarClerkManuallyAddsCaseToCalendaredTrialSession';
import calendarClerkSetsATrialSessionsSchedule from './journey/calendarClerkSetsATrialSessionsSchedule';
import calendarClerkSignsOut from './journey/calendarClerkSignsOut';
import docketClerkCreatesATrialSession from './journey/docketClerkCreatesATrialSession';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsTrialSessionList from './journey/docketClerkViewsTrialSessionList';
import petitionerFilesDocumentForCase from './journey/petitionerFilesDocumentForCase';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionerSignsOut from './journey/petitionerSignsOut';

const test = setupTest();

describe('JUDGE and ADC DOC QC: Work Item Filtering', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });
  test.createdCases = [];
  let judgeDocketSectionQCInboxCountBefore;
  let adcDocketSectionQCInboxCountBefore;

  it("Get judge's document qc section inbox before", async () => {
    await loginAs(test, 'judgeCohen');
    await getFormattedDocumentQCSectionInbox(test);
    judgeDocketSectionQCInboxCountBefore = getInboxCount(test);
  });

  it("Get adc's document qc section inbox before", async () => {
    await loginAs(test, 'adc');
    await getFormattedDocumentQCSectionInbox(test);
    adcDocketSectionQCInboxCountBefore = getInboxCount(test);
  });

  petitionerLogIn(test);
  for (let index = 0; index <= 2; index++) {
    it(`Create case ${index}`, async () => {
      let caseDetail = await uploadPetition(test);
      test.createdCases.push(caseDetail.docketNumber);
    });
    petitionerFilesDocumentForCase(test, fakeFile);
  }
  petitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkCreatesATrialSession(test);
  docketClerkViewsTrialSessionList(test);
  docketClerkSignsOut(test);

  calendarClerkLogIn(test);
  calendarClerkSetsATrialSessionsSchedule(test);
  calendarClerkManuallyAddsCaseToCalendaredTrialSession(test, 0);
  calendarClerkManuallyAddsCaseToCalendaredTrialSession(test, 1);
  calendarClerkSignsOut(test);

  it("Get judge's document qc section inbox after", async () => {
    await loginAs(test, 'judgeCohen');
    await getFormattedDocumentQCSectionInbox(test);
    const judgeDocketSectionQCInboxCountAfter = getInboxCount(test);
    expect(judgeDocketSectionQCInboxCountAfter).toBe(
      judgeDocketSectionQCInboxCountBefore + 8,
    );
  });

  it("Get adc's document qc section inbox after", async () => {
    await loginAs(test, 'adc');
    await getFormattedDocumentQCSectionInbox(test);
    const adcDocketSectionQCInboxCountAfter = getInboxCount(test);
    expect(adcDocketSectionQCInboxCountAfter).toBe(
      adcDocketSectionQCInboxCountBefore + 4,
    );
  });
});

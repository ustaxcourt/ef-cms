import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';

import { docketClerkAddEditsCalendarNote } from './journey/docketClerkAddEditsCalendarNote';
import { docketClerkDeletesCalendarNote } from './journey/docketClerkDeletesCalendarNote';
import { docketClerkViewsTrialSessionWithNote } from './journey/docketClerkViewsTrialSessionWithNote';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('case trial calendar notes journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation1 = `Boulder, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };

  cerebralTest.createdTrialSessions = [];

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides1);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('creates a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithoutNote(cerebralTest);
  docketClerkViewsTrialSessionWithNote(cerebralTest);

  docketClerkAddEditsCalendarNote(cerebralTest, 'adds');
  docketClerkViewsTrialSessionWithNote(cerebralTest);
  docketClerkAddEditsCalendarNote(cerebralTest, 'edits');
  docketClerkDeletesCalendarNote(cerebralTest);

  docketClerkViewsTrialSessionWithNote(cerebralTest);
});

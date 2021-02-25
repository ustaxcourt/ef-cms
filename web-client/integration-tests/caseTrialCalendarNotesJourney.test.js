import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';

import { docketClerkAddEditsCalendarNote } from './journey/docketClerkAddEditsCalendarNote';
import { docketClerkDeletesCalendarNote } from './journey/docketClerkDeletesCalendarNote';
import { docketClerkViewsTrialSessionWithNote } from './journey/docketClerkViewsTrialSessionWithNote';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('case trial calendar notes journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation1 = `Boulder, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };

  test.createdTrialSessions = [];

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides1);
  docketClerkViewsTrialSessionList(test);
  docketClerkViewsNewTrialSession(test);

  loginAs(test, 'petitioner@example.com');
  it('creates a case', async () => {
    const caseDetail = await uploadPetition(test, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithoutNote(test);
  docketClerkViewsTrialSessionWithNote(test);

  docketClerkAddEditsCalendarNote(test, 'adds');
  docketClerkViewsTrialSessionWithNote(test);
  docketClerkAddEditsCalendarNote(test, 'edits');
  docketClerkDeletesCalendarNote(test);

  docketClerkViewsTrialSessionWithNote(test);
});

import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddEditsCalendarNote } from './journey/docketClerkAddEditsCalendarNote';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkDeletesCalendarNote } from './journey/docketClerkDeletesCalendarNote';
import { docketClerkManuallyAddsCaseToTrialSessionWithoutNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithoutNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { docketClerkViewsTrialSessionWithNote } from './journey/docketClerkViewsTrialSessionWithNote';
import { loginAs, setupTest, uploadPetition } from './helpers';

describe('case trial calendar notes journey', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdTrialSessions = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  // eslint-disable-next-line @miovision/disallow-date/no-static-date
  const trialLocation1 = `Boulder, Colorado, ${Date.now()}`;
  const overrides = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: SESSION_TYPES.small,
    trialLocation: trialLocation1,
  };

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, overrides);
  docketClerkViewsTrialSessionList(cerebralTest);
  docketClerkViewsNewTrialSession(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  it('creates a case', async () => {
    const caseDetail = await uploadPetition(cerebralTest, overrides);
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

import { SESSION_TYPES } from '../../shared/src/business/entities/EntityConstants';
import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

describe('Docket Clerk updates a hearing session', () => {
  const cerebralTest = setupTest();

  cerebralTest.createdTrialSessions = [];

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const { docketNumber } = await uploadPetition(cerebralTest);

    expect(docketNumber).toBeDefined();

    cerebralTest.docketNumber = docketNumber;
  });

  const trialLocation = `Hartford, Connecticut, ${Date.now()}`;
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    sessionType: SESSION_TYPES.motionHearing,
    trialLocation,
  });
  docketClerkViewsTrialSessionList(cerebralTest);

  docketClerkAddsCaseToHearing(cerebralTest, 'Low blast radius', 0);

  docketClerkEditsTrialSession(cerebralTest);

  docketClerkViewsCaseDetail(cerebralTest);

  it('should NOT set the trialSessionId on the case', () => {
    expect(cerebralTest.getState('caseDetail.trialSessionId')).toBeUndefined();
  });
});

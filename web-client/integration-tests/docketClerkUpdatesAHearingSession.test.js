import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('Docket Clerk updates a hearing session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  test.createdTrialSessions = [];

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  const trialLocation = `Hartford, Connecticut, ${Date.now()}`;
  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, {
    sessionType: 'Motion/Hearing',
    trialLocation,
  });
  docketClerkViewsTrialSessionList(test, {
    sessionType: 'Motion/Hearing',
    trialLocation,
  });

  docketClerkAddsCaseToHearing(test, 'Low blast radius', 0);

  docketClerkEditsTrialSession(test);

  docketClerkViewsCaseDetail(test);

  it('should NOT set the trialSessionId on the case', () => {
    expect(test.getState('caseDetail.trialSessionId')).toBeUndefined();
  });
});

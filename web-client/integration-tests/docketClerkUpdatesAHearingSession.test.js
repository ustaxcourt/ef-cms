import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkEditsTrialSession } from './journey/docketClerkEditsTrialSession';
import { docketClerkViewsCaseDetail } from './journey/docketClerkViewsCaseDetail';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

const cerebralTest = setupTest();

describe('Docket Clerk updates a hearing session', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  cerebralTest.createdTrialSessions = [];

  loginAs(cerebralTest, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(cerebralTest);
    expect(caseDetail.docketNumber).toBeDefined();
    cerebralTest.docketNumber = caseDetail.docketNumber;
  });

  const trialLocation = `Hartford, Connecticut, ${Date.now()}`;
  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, {
    sessionType: 'Motion/Hearing',
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

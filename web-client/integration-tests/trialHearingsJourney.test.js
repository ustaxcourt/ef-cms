import { docketClerkAddsCaseToHearing } from './journey/docketClerkAddsCaseToHearing';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkManuallyAddsCaseToTrialSessionWithNote } from './journey/docketClerkManuallyAddsCaseToTrialSessionWithNote';
import { docketClerkViewsNewTrialSession } from './journey/docketClerkViewsNewTrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();

describe('trial hearings journey', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const trialLocation1 = `Denver, Colorado, ${Date.now()}`;
  const overrides1 = {
    maxCases: 3,
    preferredTrialCity: trialLocation1,
    sessionType: 'Small',
    trialLocation: trialLocation1,
  };
  const trialLocation2 = `Biloxi, Mississippi, ${Date.now()}`;
  const overrides2 = {
    maxCases: 3,
    preferredTrialCity: trialLocation2,
    sessionType: 'Small',
    trialLocation: trialLocation2,
  };
  test.createdTrialSessions = [];
  test.createdCases = [];

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, overrides1);
  docketClerkViewsTrialSessionList(test, overrides1);
  docketClerkViewsNewTrialSession(test);
  docketClerkCreatesATrialSession(test, overrides2);
  docketClerkViewsTrialSessionList(test, overrides2);
  docketClerkViewsNewTrialSession(test);

  loginAs(test, 'petitioner@example.com');
  it('create case 1', async () => {
    const caseDetail = await uploadPetition(test, overrides1);
    expect(caseDetail.docketNumber).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk@example.com');
  docketClerkManuallyAddsCaseToTrialSessionWithNote(test);
  docketClerkAddsCaseToHearing(test);
});

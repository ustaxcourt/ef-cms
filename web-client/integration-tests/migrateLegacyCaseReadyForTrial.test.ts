import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import { loginAs, setupTest } from './helpers';

describe('Migrate legacy cases that are ready for trial', () => {
  const cerebralTest = setupTest();

  const TRIAL_CITY = 'Washington, District of Columbia';

  // note: leaving commented code here for documentation reasons
  const SEEDED_DOCKET_NUMBER_UNBLOCKED = '150-12';
  // const SEEDED_DOCKET_NUMBER_BLOCKED = '151-12';
  // const SEEDED_DOCKET_NUMBER_DEADLINE = '152-12';

  const options = {
    maxCases: 100,
    preferredTrialCity: TRIAL_CITY,
    trialLocation: TRIAL_CITY,
  };

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(cerebralTest, options);
  docketClerkViewsTrialSessionList(cerebralTest);

  it('docket clerk should see migrated case as eligible for trial on session', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.eligibleCases').length).toEqual(
      1,
    );
    expect(
      cerebralTest.getState('trialSession.eligibleCases')[0].docketNumber,
    ).toEqual(SEEDED_DOCKET_NUMBER_UNBLOCKED);
  });
});

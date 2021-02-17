import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession.js';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList.js';
import { loginAs, setupTest } from './helpers';

const test = setupTest();

const TRIAL_CITY = 'Washington, District of Columbia';

describe('Migrate legacy cases that are ready for trial', () => {
  // note: leaving commented code here for documentation reasons
  const SEEDED_DOCKET_NUMBER_UNBLOCKED = '150-12';
  // const SEEDED_DOCKET_NUMBER_BLOCKED = '151-12';
  // const SEEDED_DOCKET_NUMBER_DEADLINE = '152-12';

  const options = {
    maxCases: 100,
    preferredTrialCity: TRIAL_CITY,
    sessionType: 'Hybrid',
    trialLocation: TRIAL_CITY,
  };

  loginAs(test, 'docketclerk@example.com');
  docketClerkCreatesATrialSession(test, options);
  docketClerkViewsTrialSessionList(test);

  it('docket clerk should see migrated case as eligible for trial on session', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.eligibleCases').length).toEqual(1);
    expect(test.getState('trialSession.eligibleCases')[0].docketNumber).toEqual(
      SEEDED_DOCKET_NUMBER_UNBLOCKED,
    );
  });
});

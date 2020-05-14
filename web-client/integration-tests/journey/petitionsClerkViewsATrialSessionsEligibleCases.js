import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCases = (
  test,
  expectedCount,
) => {
  return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
    await test.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: test.trialSessionId,
    });

    expect(test.getState('trialSession.eligibleCases').length).toEqual(
      expectedCount,
    );
    expect(test.getState('trialSession.isCalendared')).toEqual(false);

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: test.getState(),
      },
    );
    expect(trialSessionFormatted.computedStatus).toEqual('New');
  });
};

import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCases = (
  cerebralTest,
  expectedCount,
) => {
  return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.eligibleCases').length).toEqual(
      expectedCount,
    );
    expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);

    const trialSessionFormatted = runCompute(
      withAppContextDecorator(formattedTrialSessionDetails),
      {
        state: cerebralTest.getState(),
      },
    );
    expect(trialSessionFormatted.computedStatus).toEqual('New');
  });
};

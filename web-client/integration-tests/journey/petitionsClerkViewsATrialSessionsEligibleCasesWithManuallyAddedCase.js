import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase =
  (test, expectedCount) => {
    return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
      await test.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: test.trialSessionId,
      });

      const eligibleCases = test.getState('trialSession.eligibleCases');

      expect(eligibleCases.length).toEqual(expectedCount);

      const manuallyAddedCase = eligibleCases.find(
        eligibleCase => eligibleCase.isManuallyAdded,
      );

      expect(manuallyAddedCase).toBeDefined();

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

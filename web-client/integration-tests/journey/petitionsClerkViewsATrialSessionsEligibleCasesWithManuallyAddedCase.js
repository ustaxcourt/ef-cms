import { formattedTrialSessionDetails } from '../../src/presenter/computeds/formattedTrialSessionDetails';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsATrialSessionsEligibleCasesWithManuallyAddedCase =
  (cerebralTest, expectedCount) => {
    return it('Petitions Clerk Views A Trial Sessions Eligible Cases', async () => {
      await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
        trialSessionId: cerebralTest.trialSessionId,
      });

      const eligibleCases = cerebralTest.getState('trialSession.eligibleCases');

      expect(eligibleCases.length).toEqual(expectedCount);

      const manuallyAddedCase = eligibleCases.find(
        eligibleCase => eligibleCase.isManuallyAdded,
      );

      expect(manuallyAddedCase).toBeDefined();

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

import { formattedTrialSessionDetailsForFilteredEligibleCases } from '../../src/presenter/computeds/formattedTrialSessionDetailsForFilteredEligibleCases';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases = (
  cerebralTest,
  expectedCount,
  hybridFilter = null,
) => {
  return it(`Petitions Clerk Views A Hybrid Trial Sessions with "${
    hybridFilter || 'All'
  }" Eligible Cases`, async () => {
    await cerebralTest.runSequence('gotoTrialSessionDetailSequence', {
      trialSessionId: cerebralTest.trialSessionId,
    });

    expect(cerebralTest.getState('trialSession.eligibleCases').length).toEqual(
      expectedCount,
    );
    expect(cerebralTest.getState('trialSession.isCalendared')).toEqual(false);

    cerebralTest.setState(
      'screenMetadata.eligibleCasesFilter.hybridSessionFilter',
      hybridFilter,
    );

    const formattedEligibleCases = runCompute(
      withAppContextDecorator(
        formattedTrialSessionDetailsForFilteredEligibleCases,
      ),
      {
        state: cerebralTest.getState(),
      },
    );

    if (hybridFilter) {
      expect(formattedEligibleCases).toHaveLength(expectedCount - 2);
    } else {
      expect(formattedEligibleCases).toHaveLength(expectedCount);
    }
  });
};

import { formattedEligibleCasesHelper } from '../../src/presenter/computeds/formattedEligibleCasesHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../src/withAppContext';

export const petitionsClerkViewsAHybridTrialSessionFilteredEligibleCases = (
  cerebralTest,
  expectedCount,
  hybridFilter?: string,
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
      withAppContextDecorator(formattedEligibleCasesHelper),
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

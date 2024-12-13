import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/setTrialSessionPlanningReportAction';

describe('setTrialSessionPlanningReportAction', () => {
  const TEST_PREVIOUS_TERMS = 'TEST_PREVIOUS_TERMS';
  const TEST_TRIAL_LOCATION_DATA = 'TEST_TRIAL_LOCATION_DATA';

  it('should set data in state correctly', async () => {
    const { state } = await runAction(setTrialSessionPlanningReportAction, {
      props: {
        previousTerms: TEST_PREVIOUS_TERMS,
        trialLocationData: TEST_TRIAL_LOCATION_DATA,
      },
      state: {
        trialSessionPlanningReportData: {},
      },
    });

    const { previousTerms, trialLocationData } =
      state.trialSessionPlanningReportData;

    expect(previousTerms).toEqual(TEST_PREVIOUS_TERMS);
    expect(trialLocationData).toEqual(TEST_TRIAL_LOCATION_DATA);
  });
});

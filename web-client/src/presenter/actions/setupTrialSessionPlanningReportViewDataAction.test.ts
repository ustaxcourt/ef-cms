import { runAction } from '@web-client/presenter/test.cerebral';
import { setupTrialSessionPlanningReportViewDataAction } from '@web-client/presenter/actions/setupTrialSessionPlanningReportViewDataAction';

describe('setupTrialSessionPlanningReportViewDataAction', () => {
  it('should call route with correct path', async () => {
    const { state } = await runAction(
      setupTrialSessionPlanningReportViewDataAction,
      {
        props: {
          term: 'TEST_TRIAL_TERM',
          year: 'TEST_TRIAL_YEAR',
        },
        state: {
          trialSessionPlanningReportData: {},
        },
      },
    );

    const { trialTerm, trialYear } = state.trialSessionPlanningReportData;
    expect(trialTerm).toEqual('TEST_TRIAL_TERM');
    expect(trialYear).toEqual('TEST_TRIAL_YEAR');
  });
});

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { getTrialSessionPlanningReportAction } from '@web-client/presenter/actions/TrialSession/getTrialSessionPlanningReportAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('getTrialSessionPlanningReportAction', () => {
  const TEST_TERM = 'TEST_TERM';
  const TEST_YEAR = 'TEST_YEAR';

  const MOCK_REPORT_DATA = {
    previousTerms: 'PREVIOUS_TERMS',
    trialLocationData: 'TRIAL_LOCATION_DATA',
  };

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getTrialSessionPlanningReportDataInteractor.mockReturnValue(
        MOCK_REPORT_DATA,
      );

    presenter.providers.applicationContext = applicationContext;
  });

  it('should return the trial session planning report data', async () => {
    const { output } = await runAction(getTrialSessionPlanningReportAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionPlanningReportData: {
          trialTerm: TEST_TERM,
          trialYear: TEST_YEAR,
        },
      },
    });

    const getTrialSessionPlanningReportDataInteractorCalls =
      applicationContext.getUseCases()
        .getTrialSessionPlanningReportDataInteractor.mock.calls;

    expect(getTrialSessionPlanningReportDataInteractorCalls.length).toEqual(1);
    expect(getTrialSessionPlanningReportDataInteractorCalls[0][1]).toEqual({
      term: TEST_TERM,
      year: TEST_YEAR,
    });

    expect(output).toEqual({
      previousTerms: 'PREVIOUS_TERMS',
      trialLocationData: 'TRIAL_LOCATION_DATA',
    });
  });
});

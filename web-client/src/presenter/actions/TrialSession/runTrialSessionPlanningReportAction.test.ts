import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { runTrialSessionPlanningReportAction } from './runTrialSessionPlanningReportAction';

describe('runTrialSessionPlanningReportAction', () => {
  const mockPdfUrl = 'www.example.com';

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;

    applicationContext
      .getUseCases()
      .runTrialSessionPlanningReportInteractor.mockResolvedValue({
        url: mockPdfUrl,
      });

    applicationContext.getUtilities().openUrlInNewTab.mockReturnValue(null);
  });

  it('should open PDF url in new tab', async () => {
    await runAction(runTrialSessionPlanningReportAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: 'winter',
          year: '2020',
        },
      },
    });

    const openUrlInNewTabCalls =
      applicationContext.getUtilities().openUrlInNewTab.mock.calls;

    expect(openUrlInNewTabCalls.length).toEqual(1);
    expect(openUrlInNewTabCalls[0][0]).toEqual({
      url: mockPdfUrl,
    });
  });
});

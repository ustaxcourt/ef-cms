import { navigateToTrialSessionPlanningReportAction } from './navigateToTrialSessionPlanningReportAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToTrialSessionPlanningReportAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to trial-session-planning-report', async () => {
    await runAction(navigateToTrialSessionPlanningReportAction, {
      modules: {
        presenter,
      },
      state: {},
    });

    expect(routeStub).toHaveBeenCalledWith('/trial-session-planning-report');
  });
});

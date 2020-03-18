import { navigateToTrialSessionPlanningReportAction } from './navigateToTrialSessionPlanningReportAction';
import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';

describe('navigateToTrialSessionPlanningReportAction', () => {
  let routeStub;

  beforeEach(() => {
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

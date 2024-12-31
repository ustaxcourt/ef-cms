import { navigateToTrialSessionPlanningReportViewAction } from '@web-client/presenter/actions/navigateToTrialSessionPlanningReportViewAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToTrialSessionPlanningReportViewAction', () => {
  let routeMock: jest.Mock;
  beforeEach(() => {
    routeMock = jest.fn();
    presenter.providers.router = {
      route: routeMock,
    };
  });

  it('should call route with correct path', async () => {
    await runAction(navigateToTrialSessionPlanningReportViewAction, {
      modules: {
        presenter,
      },
      state: {
        modal: {
          term: 'TEST_TERM',
          year: 'TEST_YEAR',
        },
      },
    });

    const routeCalls = routeMock.mock.calls;
    expect(routeCalls.length).toEqual(1);
    expect(routeCalls[0][0]).toEqual(
      '/trial-session-planning-report/TEST_TERM/TEST_YEAR',
    );
  });
});

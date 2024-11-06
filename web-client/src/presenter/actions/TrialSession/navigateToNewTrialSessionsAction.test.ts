import { navigateToNewTrialSessionsAction } from '@web-client/presenter/actions/TrialSession/navigateToNewTrialSessionsAction';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('navigateToNewTrialSessionsAction', () => {
  let routeStub;

  beforeAll(() => {
    routeStub = jest.fn();

    presenter.providers.router = {
      route: routeStub,
    };
  });

  it('navigates to new trial sessions', async () => {
    await runAction(navigateToNewTrialSessionsAction, {
      modules: {
        presenter,
      },
    });

    expect(routeStub).toHaveBeenCalledWith('/trial-sessions?currentTab=new');
  });
});

import { navigateToTrialSessionsAction } from './navigateToTrialSessionsAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeStub = jest.fn();

presenter.providers.router = {
  route: routeStub,
};

describe('navigateToTrialSessionAction', () => {
  it('should navigate to the trial sessions page using an unmodified route if `tab` is not set in state.currentViewMetadata', async () => {
    await runAction(navigateToTrialSessionsAction, {
      modules: {
        presenter,
      },
    });
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual('/trial-sessions');
  });

  it('should navigate to the trial sessions after appending `tab` from state.currentViewMetadata to the route as a query string', async () => {
    await runAction(navigateToTrialSessionsAction, {
      modules: {
        presenter,
      },
      state: {
        currentViewMetadata: {
          tab: 'new',
        },
      },
    });
    expect(routeStub.mock.calls.length).toEqual(1);
    expect(routeStub.mock.calls[0][0]).toEqual('/trial-sessions?status=new');
  });
});

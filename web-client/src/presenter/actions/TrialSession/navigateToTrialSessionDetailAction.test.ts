import { navigateToTrialSessionDetailAction } from './navigateToTrialSessionDetailAction';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

const routeMock = jest.fn();

presenter.providers.router = {
  route: routeMock,
};

describe('navigateToTrialSessionDetailAction', () => {
  it('should go to the trials session detail route using state.trialSession.trialSessionId', async () => {
    await runAction(navigateToTrialSessionDetailAction, {
      modules: {
        presenter,
      },
      state: {
        trialSession: { trialSessionId: '123' },
      },
    });
    expect(routeMock).toHaveBeenCalled();
    expect(routeMock.mock.calls[0][0]).toEqual('/trial-session-detail/123');
  });
});

import { navigateToTrialSessionDetailAction } from './navigateToTrialSessionDetailAction';
import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';

const routeMock = jest.fn();

presenter.providers.router = {
  route: routeMock,
};

describe('navigateToTrialSessionDetailAction', () => {
  it('should go to the trials session detail route using state.trialSessionId', async () => {
    await runAction(navigateToTrialSessionDetailAction, {
      modules: {
        presenter,
      },
      state: {
        trialSessionId: '123',
      },
    });
    expect(routeMock).toHaveBeenCalled();
    expect(routeMock.mock.calls[0][0]).toEqual('/trial-session-detail/123');
  });
});

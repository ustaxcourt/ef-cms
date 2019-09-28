import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { stopWebSocketConnectionAction } from './stopWebSocketConnectionAction';

describe('stopWebSocketConnectionAction', () => {
  it('should call the socket stop function', async () => {
    const stop = jest.fn();
    presenter.providers.socket = { stop };

    await runAction(stopWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(stop).toHaveBeenCalled();
  });
});

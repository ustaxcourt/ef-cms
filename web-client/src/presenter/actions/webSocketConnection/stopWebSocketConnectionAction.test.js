import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { stopWebSocketConnectionAction } from './stopWebSocketConnectionAction';

describe('stopWebSocketConnectionAction', () => {
  it('should call the socket stop function', async () => {
    const stop = jest.fn();
    global.clearInterval = jest.fn();
    presenter.providers.socket = { stop };

    const result = await runAction(stopWebSocketConnectionAction, {
      modules: {
        presenter,
      },
      state: {
        wsPingInterval: 'interval',
      },
    });

    expect(stop).toHaveBeenCalled();
    expect(global.clearInterval).toHaveBeenCalledWith('interval');
    expect(global.clearInterval).toHaveBeenCalled();
    expect(result.state.wsPingInterval).toBeUndefined();
  });
});

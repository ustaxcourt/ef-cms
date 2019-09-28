import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { startWebSocketConnectionAction } from './startWebSocketConnectionAction';

describe('startWebSocketConnectionAction', () => {
  it('should call the socket start function', async () => {
    const start = jest.fn();
    presenter.providers.socket = { start };

    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(start).toHaveBeenCalled();
  });
});

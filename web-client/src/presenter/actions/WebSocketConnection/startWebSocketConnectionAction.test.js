import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { startWebSocketConnectionAction } from './startWebSocketConnectionAction';

describe('startWebSocketConnectionAction', () => {
  const pathSuccessStub = jest.fn();
  const pathErrorStub = jest.fn();

  presenter.providers.path = {
    error: pathErrorStub,
    success: pathSuccessStub,
  };

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

  it('should call the success path if there is no error when starting the socket', async () => {
    const start = jest.fn();
    presenter.providers.socket = { start };

    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathSuccessStub).toHaveBeenCalled();
  });

  it('should call the error path if there is an error when starting the socket', async () => {
    const start = jest.fn().mockImplementation(() => {
      throw new Error('Nope!');
    });

    presenter.providers.socket = { start };

    await runAction(startWebSocketConnectionAction, {
      modules: {
        presenter,
      },
    });

    expect(pathErrorStub).toHaveBeenCalled();
  });
});

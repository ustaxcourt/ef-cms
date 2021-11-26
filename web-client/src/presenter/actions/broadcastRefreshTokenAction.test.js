import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { broadcastRefreshTokenAction } from './broadcastRefreshTokenAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

describe('broadcastRefreshTokenAction', () => {
  const postMessageMock = jest.fn();

  beforeAll(() => {
    presenter.providers.applicationContext = applicationContext;
    applicationContext.getBroadcastGateway = () => ({
      postMessage: postMessageMock,
    });
  });

  it('posts a message to the broadcast channel with subject "receiveToken"', async () => {
    await runAction(broadcastRefreshTokenAction, {
      modules: {
        presenter,
      },
      state: {
        refreshToken: 'my-refresh-token',
      },
    });
    expect(postMessageMock.mock.calls[0][0]).toMatchObject({
      refreshToken: 'my-refresh-token',
      subject: 'receiveToken',
    });
  });
  it('does not post a message to the broadcast channel with subject "receiveToken" if own refreshToken is undefined', async () => {
    await runAction(broadcastRefreshTokenAction, {
      modules: {
        presenter,
      },
      state: {
        refreshToken: undefined,
      },
    });
    expect(postMessageMock).not.toHaveBeenCalled();
  });
});

import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setDawsonHasUpdatedAction } from '@web-client/presenter/actions/setDawsonHasUpdatedAction';

describe('setDawsonHasUpdatedAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('sets dawsonHasUpdated to true and clears refreshTokenInterval (both in state and with clearInterval)', async () => {
    const mockInterval = 10;
    const mockClearInterval = jest.spyOn(global, 'clearInterval');
    const result = await runAction(setDawsonHasUpdatedAction, {
      modules: {
        presenter,
      },
      state: {
        dawsonHasUpdated: false,
        refreshTokenInterval: mockInterval,
      },
    });

    expect(result.state.dawsonHasUpdated).toEqual(true);
    expect(result.state.refreshTokenInterval).toBeUndefined();
    expect(mockClearInterval).toHaveBeenCalledWith(mockInterval);
  });

  it('broadcasts message when skipBroadcast is falsy', async () => {
    await runAction(setDawsonHasUpdatedAction, {
      modules: {
        presenter,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().postMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getBroadcastGateway().postMessage.mock.calls[0][0],
    ).toMatchObject({
      subject: BROADCAST_MESSAGES.dawsonHasUpdated,
    });
  });

  it('does not broadcast message when skipBroadcast is true', async () => {
    await runAction(setDawsonHasUpdatedAction, {
      modules: {
        presenter,
      },
      props: {
        skipBroadcast: true,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().postMessage,
    ).not.toHaveBeenCalled();
  });
});

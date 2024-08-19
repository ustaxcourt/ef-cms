import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { broadcastAppUpdatedAction } from '@web-client/presenter/actions/broadcastAppUpdatedAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('broadcastAppUpdatedAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should broadcast message when skipBroadcast is false (the default)', async () => {
    await runAction(broadcastAppUpdatedAction, {
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
      subject: BROADCAST_MESSAGES.appHasUpdated,
    });
  });

  it('should not broadcast message when skipBroadcast is true', async () => {
    await runAction(broadcastAppUpdatedAction, {
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

import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { broadcastLogoutAction } from './broadcastLogoutAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('broadcastLogoutAction', () => {
  it('does not broadcast an event when skipBroadcast is true', async () => {
    await runAction(broadcastLogoutAction, {
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

  it('does broadcast an event when skipBroadcast is false', async () => {
    delete process.env.CI;
    await runAction(broadcastLogoutAction, {
      modules: {
        presenter,
      },
      props: {
        skipBroadcast: false,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().postMessage,
    ).toHaveBeenCalled();
  });
});

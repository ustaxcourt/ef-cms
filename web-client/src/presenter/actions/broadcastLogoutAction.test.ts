import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { broadcastLogoutAction } from './broadcastLogoutAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('broadcastLogoutAction', () => {
  it('does not broadcast an event if skipBroadcast is true and CI is undefined', async () => {
    delete process.env.CI;

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

  it('does not broadcast an event if skipBroadcast is true and CI is defined', async () => {
    process.env.CI = 'true';
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

  it('does not broadcast an event if skipBroadcast is false and CI is defined', async () => {
    process.env.CI = 'true';
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
    ).not.toHaveBeenCalled();
  });

  it('will only broad an event when both skipBroadcast is false and CI is undefined', async () => {
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

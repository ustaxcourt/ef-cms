import { BROADCAST_MESSAGES } from '@shared/business/entities/EntityConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { broadcastIdleStatusActiveAction } from './broadcastIdleStatusActiveAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('broadcastIdleStatusActiveAction', () => {
  presenter.providers.applicationContext = applicationContext;

  it('should invoke postMessage idleStatusActive message when props.closeModal is false', async () => {
    await runAction(broadcastIdleStatusActiveAction, {
      modules: {
        presenter,
      },
      props: {
        closeModal: false,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().postMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getBroadcastGateway().postMessage.mock.calls[0][0],
    ).toMatchObject({
      subject: BROADCAST_MESSAGES.idleStatusActive,
    });
  });

  it('should invoke postMessage stayLoggedIn message when props.closeModal is true', async () => {
    await runAction(broadcastIdleStatusActiveAction, {
      modules: {
        presenter,
      },
      props: {
        closeModal: true,
      },
    });

    expect(
      applicationContext.getBroadcastGateway().postMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getBroadcastGateway().postMessage.mock.calls[0][0],
    ).toMatchObject({
      subject: BROADCAST_MESSAGES.stayLoggedIn,
    });
  });
});

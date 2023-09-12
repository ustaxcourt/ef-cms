import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { broadcastStayLoggedInAction } from './broadcastStayLoggedInAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('broadcastStayLoggedInAction', () => {
  it('should invoke postMessage with the expected arguments', async () => {
    await runAction(broadcastStayLoggedInAction, {
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
      subject: 'stayLoggedIn',
    });
  });
});

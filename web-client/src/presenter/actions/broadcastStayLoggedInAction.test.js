import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { broadcastStayLoggedInAction } from './broadcastStayLoggedInAction';
import { presenter } from '../presenter-mock';
import { runAction } from 'cerebral/test';

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

import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { broadcastIdleStatusActiveAction } from './broadcastIdleStatusActiveAction';
import { presenter } from '../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

presenter.providers.applicationContext = applicationContext;

describe('broadcastIdleStatusActiveAction', () => {
  it('should invoke postMessage with the expected arguments', async () => {
    await runAction(broadcastIdleStatusActiveAction, {
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
      subject: 'idleStatusActive',
    });
  });
});

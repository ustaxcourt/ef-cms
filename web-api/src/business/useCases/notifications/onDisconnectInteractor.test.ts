import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { onDisconnectInteractor } from './onDisconnectInteractor';

describe('deleteUserConnection', () => {
  it('attempts to delete the user connection', async () => {
    await onDisconnectInteractor(applicationContext, {
      connectionId: 'abc',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserConnection,
    ).toHaveBeenCalled();
  });
});

import { applicationContext } from '../../test/createTestApplicationContext';
import { onConnectInteractor } from './onConnectInteractor';

describe('onConnectInteractor', () => {
  it('attempts to save the user connection', async () => {
    await onConnectInteractor(applicationContext, {
      connectionId: 'abc',
      endpoint: {} as any,
    } as any);

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalled();
  });
});

import { applicationContext } from '../../test/createTestApplicationContext';
import { onConnectInteractor } from './onConnectInteractor';

describe('onConnectInteractor', () => {
  const mockClientConnectionId = '03c1ee1e-c24a-480d-9ffc-683c8c417df7';
  const mockConnectionId = '7f926304-e167-45e7-8601-e320298aaed3';
  const mockEndpoint = 'www.example.com';

  it('should save the user connection', async () => {
    await onConnectInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      connectionId: mockConnectionId,
      endpoint: mockEndpoint,
    });

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalled();
  });

  it('should NOT save the user connection when the current user is undefined', async () => {
    applicationContext.getCurrentUser.mockReturnValue(undefined);

    await onConnectInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      connectionId: mockConnectionId,
      endpoint: mockEndpoint,
    });

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).not.toHaveBeenCalled();
  });
});

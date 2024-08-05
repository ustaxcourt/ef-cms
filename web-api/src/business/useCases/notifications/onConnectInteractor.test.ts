import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { onConnectInteractor } from './onConnectInteractor';

describe('onConnectInteractor', () => {
  const mockClientConnectionId = '03c1ee1e-c24a-480d-9ffc-683c8c417df7';
  const mockConnectionId = '7f926304-e167-45e7-8601-e320298aaed3';
  const mockEndpoint = 'www.example.com';

  it('should save the user connection', async () => {
    await onConnectInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        connectionId: mockConnectionId,
        endpoint: mockEndpoint,
      },
      mockDocketClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalled();
  });

  it('should NOT save the user connection when the current user is undefined', async () => {
    await onConnectInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        connectionId: mockConnectionId,
        endpoint: mockEndpoint,
      },
      undefined,
    );

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).not.toHaveBeenCalled();
  });

  it('should add https protocol to the endpoint when the endpoint does not have a protocol', async () => {
    let endpoint = 'somedomain.hello.org';
    await onConnectInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        connectionId: mockConnectionId,
        endpoint,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalledWith({
      applicationContext,
      clientConnectionId: mockClientConnectionId,
      connectionId: mockConnectionId,
      endpoint: 'https://' + endpoint,
      userId: mockPetitionerUser.userId,
    });
  });

  it('should not add https protocol when endpoint already has a protocol', async () => {
    let endpoint = 'https://somedomain.hello.org';
    await onConnectInteractor(
      applicationContext,
      {
        clientConnectionId: mockClientConnectionId,
        connectionId: mockConnectionId,
        endpoint,
      },
      mockPetitionerUser,
    );

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalledWith({
      applicationContext,
      clientConnectionId: mockClientConnectionId,
      connectionId: mockConnectionId,
      endpoint,
      userId: mockPetitionerUser.userId,
    });
  });
});

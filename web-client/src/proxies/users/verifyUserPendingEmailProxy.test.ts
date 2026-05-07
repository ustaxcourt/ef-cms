jest.mock('../requests');
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { put } from '../requests';
import { verifyUserPendingEmailInteractor } from './verifyUserPendingEmailProxy';

describe('verifyUserPendingEmailProxy', () => {
  const mockedPut = jest.mocked(put);

  beforeEach(() => {
    mockedPut.mockResolvedValue(undefined as unknown as void);
  });

  it('sends the token to `/auth/verify-email` (works for both private and public API hosts)', async () => {
    await verifyUserPendingEmailInteractor(applicationContext, {
      token: 'test-token',
    });

    expect(mockedPut).toHaveBeenCalledWith({
      applicationContext,
      body: { token: 'test-token' },
      endpoint: '/auth/verify-email',
    });
  });
});

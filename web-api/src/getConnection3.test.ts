const mockGetAuthToken = jest.fn();
jest.mock('@aws-sdk/rds-signer', () => {
  class Signer {
    getAuthToken() {
      return mockGetAuthToken();
    }
  }
  return {
    Signer,
  };
});
import { getConnection } from '@web-api/getConnection';
import { environment } from '@web-api/environment';

describe('getConnection', () => {
  environment.nodeEnv = 'production';
  it('should wait for pool password when multiple promises are attempting to reset', async () => {
    mockGetAuthToken.mockResolvedValue('12346789');
    const dateNowStub = jest
      .fn()
      .mockReturnValueOnce(1747161078724)
      .mockReturnValueOnce(1747161078724)
      .mockReturnValue(1747161078724 + 1000 * 60 * 15);
    global.Date.now = dateNowStub;
    await getConnection({ cb: () => {} });

    await Promise.all([
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
      getConnection({ cb: () => {} }),
    ]);

    expect(mockGetAuthToken).toHaveBeenCalledTimes(2);
  });
});

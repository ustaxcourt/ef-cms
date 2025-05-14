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
  it('should allow resetting the token after getToken failure', async () => {
    mockGetAuthToken.mockResolvedValue('12346789');
    // first two calls to Date.now() correspond to the FIRST getConnection call (Date.now is called twice)
    // thereafter, our token should be expired (set to 15 minutes later which is greater than the 13 minute timer in getConnection)
    const dateNowStub = jest
      .fn()
      .mockReturnValueOnce(1747161078724)
      .mockReturnValueOnce(1747161078724)
      .mockReturnValue(1747161078724 + 1000 * 60 * 15);
    global.Date.now = dateNowStub;
    await getConnection({ cb: () => {} });

    mockGetAuthToken.mockRejectedValueOnce(new Error('NO!'));

    await expect(() =>
      Promise.all([
        getConnection({
          cb: () => {},
        }),
        getConnection({
          cb: () => {},
        }),
        getConnection({
          cb: () => {},
        }),
      ]),
    ).rejects.toThrow();

    await getConnection({ cb: () => {} });

    expect(mockGetAuthToken).toHaveBeenCalledTimes(3);
  });
});

import { mockEntireFile } from '@shared/test/mockFactory';
jest.mock('@shared/business/utilities/DateHandler', () =>
  mockEntireFile({
    keepImplementation: true,
    module: '@shared/business/utilities/DateHandler',
  }),
);
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
jest.mock('pg', () => {
  class Pool {
    options = {};
    connect() {
      return { release() {} };
    }
  }
  return {
    Pool,
  };
});
import { getConnection } from '@web-api/getConnection';
import { environment } from '@web-api/environment';
import { formatNow as formatNowMock } from '@shared/business/utilities/DateHandler';

describe('getConnection', () => {
  environment.stage = 'testing';
  it('should allow resetting the token after getToken failure', async () => {
    mockGetAuthToken.mockResolvedValue('12346789');
    // first two calls to formatNow correspond to the FIRST getConnection call (formatNow is called twice)
    // thereafter, our token should be expired (set to 15 minutes later which is greater than the 13 minute timer in getConnection)
    const formatNow = jest.mocked(formatNowMock);
    formatNow
      .mockReturnValueOnce('1747161078724')
      .mockReturnValueOnce('1747161078724')
      .mockReturnValue(`${1747161078724 + 1000 * 60 * 15}`);
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
